# json-to-postgresql

## About
A simple application that generates queries for importing JSON collections into PostgreSQL.<br />
It auto-detects column names, column types, creates the table and inserts the data into the table.

Only supports locally saved .json files.<br />
Currently supported actions: `create, alter, insert, createAndInsert, alterAndInsert`

## Usage
Should be called from CLI, using arguments and flags to tell the application what to do.<br />
`node -r ts-node/register src/index.ts [-a action] [-r] [-i column] [-p column] [-c connection] ...COLLECTIONS`

Always refer to type `ImportConfig` to understand how to use flags correctly.<br />
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
Currently planned:
- Auto-detection of table structure and constraints when altering or inserting without creating
- Bigint support
- Interactive configuration for fixing or changing types after auto-detection
- Different configs (for dynamic indexing, specifying types and others)
- GUI
- NPM package & NPX usage
