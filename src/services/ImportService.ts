import { Service } from "typedi";
import { DatabaseService } from "@src/services/DatabaseService";
import { Column } from "@src/interfaces/Column";
import fsAsync from "fs/promises";
import path from "path";

@Service()
export class ImportService {
    constructor(private readonly databaseService: DatabaseService) {}

    createTable = async (table: string, columns: Array<Column>) => {
        const query = this.generateTableQuery(table, columns);
        await fsAsync.writeFile(path.join(__dirname, "../backup/create", `${table}.sql`), query);
        return this.databaseService.query(query);
    }

    insertRows = async (table: string, columns: Array<Column>, content: Array<object>) => {
        const columnNames = columns.map(x => x.key);
        const query = `INSERT INTO ${table}(${columnNames.map(x => `"${x}"`).join(", ")})\n` +
                                `VALUES ${this.getInsertsFromContent(content, columns)}`;
        await fsAsync.writeFile(path.join(__dirname, "../backup/insert", `${table}.sql`), query);
        return this.databaseService.query(query);
    }

    private generateTableQuery = (table: string, columns: Array<Column>) => {
        return `CREATE TABLE IF NOT EXISTS ${table} (\n${columns.map(x => x.toString).join(",\n")}\n) USING HEAP;`;
    }

    generateColumns = (content: Array<object>): Array<Column> => {
        const columns: Array<Column> = [];

        // searches for types in first 150 elements
        for (let i = 0; i < 150; i++) {
            if (!content[i])
                continue;

            for (const [key, value] of Object.entries(content[i])) {
                const column = new Column({
                    key,
                    type: "NULL"
                });
                if (value === null || !value)
                    continue;
                if (typeof value === "number") {
                    column.type = "INTEGER";
                } else if (typeof value === "string") {
                    if (!new RegExp(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z?$/).test(value)) {
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
                    throw new Error(`NULL TYPE: ${JSON.stringify(content[i])}`)
                const foundColumn = columns.find(x => x.key == key);
                if (foundColumn) {
                    if (foundColumn.type === "CHARACTER VARYING" && column.size! > foundColumn.size!) {
                        foundColumn.size = column.size;
                    } else if (foundColumn.type !== column.type) {
                        throw new Error(`DIFFERING TYPES FROM KEY ${key}: ${foundColumn.type} & ${column.type} -> ${JSON.stringify(content[i])}`);
                    }
                } else {
                    columns.push(column);
                }
            }
        }

        return columns;
    }

    private getInsertsFromContent = (content: any, columns: Array<Column>) => {
        return `${content.map((row: any) =>
            `(${columns.map(x => this.getRowColumnValue(row, x)).join(", ")})`)
            .join(",\n")};`;
    }

    private getRowColumnValue = (row: any, column: Column) => {
        const stringed = JSON.stringify(row[column.key]);
        if (stringed === "null")
            return stringed;
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
    }

}
