# json-to-postgresql

## About
A simple Bun application that generates queries for importing JSON collections into PostgreSQL.<br />
It auto-detects column names, column types, creates the table and inserts the data into the table.

Only supports locally saved .json files.<br />
Currently supported actions: `create, alter, insert, createAndInsert, alterAndInsert`

## Usage
### Quickstart
First, you need to have at least one package manager installed in your machine.
- [bun](https://bun.sh/) (preferably)
- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [yarn](https://classic.yarnpkg.com/lang/en/docs/install)

After making sure you have at least one installed and cloning the project, you should now download all the required dependencies using one of the below commands (according to the one you have installed), in the project's main directory.
```Bash
# If you have Bun installed
bun install
# If you have NPM installed
npm install
# If you have Yarn installed
yarn install
```

After downloading the dependencies, you're now ready to run the project.<br />
Execute the below command in the project's main directory, changing the flags and arguments to match your needs.
```Bash
# Flags and arguments are used so the application knows what to do correctly
bun start [-a action] [-r] [-i column] [-p column] [-c connection] ...COLLECTIONS
```

### Flags
```Typescript
export type ImportConfig = {
	/**
	 * Path(s) of the file(s) to be imported, relative to __dirname.
	 * Populated by the CLI arguments.
	 */
	filePath: Array<string>;

	/**
	 * Columns to be ignored while auto-detecting, creating the table and inserting the values.
	 * Separated by commas.
	 * Usage: -i or --ignore
	 */
	ignoreColumns?: Array<string>;

	/**
	 * Defines the action that will be executed in the database.
	 * IMPORTANT: When using alter, the alterations will only be made to the auto-detected columns.
	 * Usage: -a or --action
	 * Default: createAndInsert
	 */
	action?:
		| "create"
		| "alter"
		| "insert"
		| "createAndInsert"
		| "alterAndInsert";

	/**
	 * If set to true, will replace all occurrences of data that already exist in the table.
	 * Only used when action is set to either insert or alterAndInsert.
	 * When the flag is set, this value is set to true. Otherwise, it defaults to false.
	 * Usage: -r or --replace
	 * Default: false
	 */
	shouldReplace?: boolean;

	/**
	 * Defines the column that is supposed to be set as primary key in the table.
	 * Only used when action is set to either create or createAndInsert.
	 * Usage: -p or --primary
	 * Default: id
	 */
	primaryKey: string;

	/**
	 * Defines the connection to use to execute the queries after generating them.
	 * Should only use this if you want to execute the queries automatically into the database you wish.
	 * When this is left empty, the application will only create the queries and store them inside queries -> (create/alter/insert) -> (collection_name).sql
	 * Usage: -c or --connection
	 * Example: postgresql://username:password@host:port/database
	 */
	connString?: string;
};
```

## Planned
- Allow usage of directories instead of having to point out every JSON file (also usage of wildcards)
- Auto-detection of Postgres table structure and constraints when not creating the table
- Interactive config for confirming or changing types after JSON auto-detection
- Bigint support
- More flags (dynamic indexing, specifying types, etc.)
- npm package & npx/bunx usage
- GUI (maybe?)
