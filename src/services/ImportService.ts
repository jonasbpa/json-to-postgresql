import { Column } from "../types/Column";
import fsAsync from "fs/promises";
import path from "path";
import { ImportConfig } from "../types/ImportConfig";
import { DatabaseService } from "./DatabaseService";

export class ImportService {
	private readonly databaseService?: DatabaseService;

	constructor(private readonly config: ImportConfig) {
		if (config.connString)
			this.databaseService = new DatabaseService(config.connString);
	}

	async exec() {
		for (const file of this.config.filePath) {
			const content = JSON.parse(
				(
					await fsAsync.readFile(path.join(__dirname, "../../", file))
				).toString()
			);
			const fileSplit = file.split("/");
			const tableName = fileSplit[fileSplit.length - 1].replace(
				".json",
				""
			);
			const columns = this.generateColumns(content);
			if (this.config.action?.startsWith("create")) {
				await this.createTable(tableName, columns);
			}

			if (this.config.action?.startsWith("alter")) {
				await this.alterTable(tableName, columns);
			}

			if (
				this.config.action === "insert" ||
				this.config.action?.endsWith("Insert")
			) {
				await this.insertRows(tableName, columns, content);
			}
		}
	}

	private createTable = async (tableName: string, columns: Array<Column>) => {
		const query = ImportService.createTableQuery(tableName, columns);
		await fsAsync.writeFile(
			path.join(__dirname, `../../queries/create/${tableName}.sql`),
			query
		);
		if (this.databaseService) await this.databaseService.query(query);
	};

	private alterTable = async (tableName: string, columns: Array<Column>) => {
		const query = ImportService.alterTableQuery(tableName, columns);
		await fsAsync.writeFile(
			path.join(__dirname, `../../queries/alter/${tableName}.sql`),
			query
		);
		if (this.databaseService) await this.databaseService.query(query);
	};

	private insertRows = async (
		tableName: string,
		columns: Array<Column>,
		content: Array<object>
	) => {
		const columnNames = columns.map((x) => x.key);
		const query =
			`INSERT INTO ${tableName}(${columnNames.map((x) => `"${x}"`).join(", ")})  ` +
			`VALUES ${this.getInsertsFromContent(content, columns)}\n` +
			`ON CONFLICT (${ImportService.getPrimaryKeysNames(columns)}) ` +
			(this.config.shouldReplace
				? `DO UPDATE SET ` + ImportService.getReplacers(columns)
				: "DO NOTHING") +
			`;`;
		await fsAsync.writeFile(
			path.join(__dirname, `../../queries/insert/${tableName}.sql`),
			query
		);
		if (this.databaseService) await this.databaseService.query(query);
	};

	static createTableQuery = (tableName: string, columns: Array<Column>) => {
		return `CREATE TABLE IF NOT EXISTS ${tableName}
                (
                    ${columns.map((x) => x.getCreateString).join(",\n")}
                ) USING HEAP;`;
	};

	static alterTableQuery = (tableName: string, columns: Array<Column>) => {
		return `ALTER TABLE IF EXISTS ${tableName} ${columns.map((x) => x.getReplaceString).join(",\n")};`;
	};

	private generateColumns = (content: Array<object>): Array<Column> => {
		const columns: Array<Column> = [];

		// searches for types in ALL elements
		for (let i = 0; i < content.length; i++) {
			if (!content[i]) continue;

			for (const [key, value] of Object.entries(content[i])) {
				const column = new Column({
					key,
					primary: this.checkColumnPrimary(key),
					type: "NULL"
				});
				if (value === null || !value) continue;

				if (this.config.ignoreColumns?.includes(column.key)) continue;

				if (typeof value === "number") {
					column.type = "INTEGER";
				} else if (typeof value === "string") {
					if (
						!new RegExp(
							/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z?$/
						).test(value)
					) {
						column.type = "CHARACTER VARYING";
						column.size = value.length;
					} else {
						column.type = "TIMESTAMPTZ";
					}
				} else if (typeof value === "boolean") {
					column.type = "BOOLEAN";
				} else if (typeof value === "object") {
					column.type = "JSONB";
				}
				if (column.type === "NULL")
					throw new Error(`NULL TYPE: ${JSON.stringify(content[i])}`);
				const foundColumn = columns.find((x) => x.key == key);
				if (foundColumn) {
					if (
						foundColumn.type === "CHARACTER VARYING" &&
						column.size! > foundColumn.size!
					) {
						foundColumn.size = column.size;
					} else if (foundColumn.type !== column.type) {
						throw new Error(
							`DIFFERING TYPES FROM KEY ${key}: ${foundColumn.type} & ${column.type} -> ${JSON.stringify(content[i])}`
						);
					}
				} else {
					columns.push(column);
				}
			}
		}

		return columns;
	};

	private getInsertsFromContent = (content: any, columns: Array<Column>) => {
		return `${content
			.map(
				(row: any) =>
					`(${columns.map((x) => ImportService.getRowColumnValue(row, x)).join(", ")})`
			)
			.join(",\n")}`;
	};

	static getReplacers = (columns: Array<Column>) =>
		columns
			.filter((x) => !x.primary)
			.map((x) => `"${x.key}" = EXCLUDED."${x.key}"`)
			.join(", ");

	static getPrimaryKeysNames = (columns: Array<Column>) =>
		columns
			.filter((x) => x.primary)
			.map((x) => `"${x.key}"`)
			.join(", ");

	static getRowColumnValue = (row: any, column: Column) => {
		const stringed = JSON.stringify(row[column.key]);
		if (stringed === "null") return stringed;
		switch (column.type) {
			case "INTEGER":
			case "BOOLEAN":
			case "TIMESTAMPTZ":
				return stringed.replace(/"/g, "'");
			case "CHARACTER VARYING":
				return `E${stringed.replace(/'/g, "\\'").replace(/"/g, "'")}`;
			case "JSONB":
				return `'${stringed}'`;
			case "NULL":
				throw new Error("NULL COLUMN");
		}
	};

	private checkColumnPrimary = (columnName: string): boolean =>
		this.config.primaryKey === columnName;
}
