import "reflect-metadata";
import { Container } from "typedi";
import * as fsAsync from "fs/promises";
import path from "path";
import { ImportConfig } from "@src/interfaces/ImportConfig";
import { ImportService } from "@src/services/ImportService";

(async () => {
	const config1 = getConfig();
	const importService = Container.get(ImportService);
	if (typeof config1.filePath === "object") {
		for (const file of config1.filePath) {
			const content = JSON.parse(
				(
					await fsAsync.readFile(
						path.join(__dirname, "../backup/", file)
					)
				).toString()
			);
			const table = file.replace(".json", "");
			const columns = importService.generateColumns(
				content,
				config1.primaryKey,
				config1.ignoreColumns
			);
			await importService.createTable(table, columns);
			if (!config1.onlyCreate)
				await importService.insertRows(table, columns, content);
		}
	} else {
		const content = JSON.parse(
			(
				await fsAsync.readFile(
					path.join(__dirname, "../backup/", config1.filePath)
				)
			).toString()
		);
		const table = config1.filePath.replace(".json", "");
		const columns = importService.generateColumns(
			content,
			config1.primaryKey,
			config1.ignoreColumns
		);
		await importService.createTable(table, columns);
		if (!config1.onlyCreate)
			await importService.insertRows(table, columns, content);
	}
})();

function getConfig(): ImportConfig {
	return {
		filePath: processArgument("filePath")!,
		ignoreColumns: processArgument("ignoreColumns"),
		onlyCreate: processArgument("onlyCreate"),
		primaryKey: processArgument("primaryKey")
	};
}

function processArgument<T extends keyof ImportConfig>(
	name: T
): ImportConfig[T] | undefined {
	if (!name) return undefined;
	const args = process.execArgv;
	if (!args?.length) {
		throw new Error("Not enough arguments");
	}

	const arg = args
		.find((x) => x.startsWith(`--${name}=`))
		?.replace(`--${name}=`, "");
	if (!arg && name === "filePath") {
		throw new Error("File path is required");
	}

	if (!arg) {
		return undefined;
	}

	if (name === "onlyCreate") {
		return (arg === "true") as ImportConfig[T];
	}

	return (
		arg.includes(",") || name === "ignoreColumns"
			? arg.split(",").map((x) => x.trim())
			: arg
	) as ImportConfig[T];
}
