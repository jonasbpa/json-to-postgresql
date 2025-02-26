import "reflect-metadata";
import { ImportConfig } from "@src/types/ImportConfig";
import { ImportService } from "@src/services/ImportService";
import { Command } from "@commander-js/extra-typings";

const program = new Command()
	.option("-r, --replace")
	.option("-a, --action <string>")
	.option("-i, --ignore <string>")
	.option("-p, --primary <string>")
	.option("-c, --connection <string>")
	.argument("<string...>")
	.parse();
const options = program.opts();

const config: ImportConfig = {
	filePath: program.args,
	ignoreColumns: listToArray(options.ignore),
	action: (options.action as ImportConfig["action"]) || "createAndInsert",
	shouldReplace: options.replace,
	primaryKey: options.primary || "id",
	connString: options.connection
};

const importService = new ImportService(config);
importService.exec().then(() => console.log("Success!"));

function listToArray(list?: string): string[] | undefined {
	return list?.split(",")?.map((x) => x.trim());
}
