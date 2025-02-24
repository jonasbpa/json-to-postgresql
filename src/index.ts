import "reflect-metadata";
import { ImportConfig } from "@src/interfaces/ImportConfig";
import { ImportService } from "@src/services/ImportService";

(async () => {
	const importService = new ImportService(getConfig());
	await importService.exec();
})();

function getConfig(): ImportConfig {
	return {
		filePath: processArgument("filePath")!,
		ignoreColumns: processArgument("ignoreColumns"),
		action: processArgument("action"),
		shouldReplace: processArgument("shouldReplace"),
		primaryKey: processArgument("primaryKey"),
		connString: processArgument("connString")
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

	if (name === "shouldReplace") {
		return (arg === "true") as ImportConfig[T];
	}

	if (name === "primaryKey") {
		return arg as ImportConfig[T];
	}

	return arg.split(",").map((x) => x.trim()) as ImportConfig[T];
}
