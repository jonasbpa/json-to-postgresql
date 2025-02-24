# json-to-postgresql

## About
A simple application that generates queries for importing JSON collections into PostgreSQL.<br />
It auto-detects column names, column types, creates the table and inserts the data into the table.

Only supports locally saved .json files.<br />
Currently supported actions: `create, alter, insert, createAndInsert, alterAndInsert`

## Usage
Should be called from CLI, using arguments to tell the application what to do.<br />
`npm run exec --action=createAndImport --filePath=collection.json`

Always refer to type `ImportConfig` to know what arguments to use.<br />
```Typescript
export type ImportConfig = {
	/**
	 * Path(s) of the file(s) to be imported, relative to __dirname.
	 * Usage: --filePath=collection1.json,collection2.json
	 */
	filePath: Array<string>;

	/**
	 * Columns to be ignored while auto-detecting, creating the table and inserting the values.
	 * Usage: --ignoreColumns=created_at,deactivated_at
	 */
	ignoreColumns?: Array<string>;

	/**
	 * Defines the action that will be executed in the database
	 * IMPORTANT: When using alter, the alterations will only be made to the auto-detected columns
	 * Usage: --action=createAndInsert
	 * Available actions: create, alter, insert, createAndInsert, alterAndInsert
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
	 * Only usable when action is set to insert or alterAndInsert
	 * Usage: --shouldReplace=true
	 * Default: false
	 */
	shouldReplace?: boolean;

	/**
	 * Defines the column that is supposed to be set as primary key in the table.
	 * Usage: --primaryKey=id
	 * Default: id
	 */
	primaryKey?: string;

	/**
	 * Should only use this if you want to execute the queries automatically into the database you wish.
	 * When this is left empty, the application will only create the queries and store them inside queries -> (create/alter/insert) -> (collection_name).sql
	 * Usage: --connString=postgresql://username:password@host:port/database
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
