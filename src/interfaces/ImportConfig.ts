export interface ImportConfig {
	/**
	 * Path(s) of the file(s) to be imported, relative to __dirname.
	 * Usage: --filePath=collection1.json,collection2.json
	 */
	filePath: string | Array<string>;

	/**
	 * Columns to be ignored while creating the table and inserting the values.
	 * Usage: --ignoreColumns=id,created_at
	 */
	ignoreColumns?: Array<string>;

	/**
	 * If set to true, will only create the database, without importing the data.
	 * Usage: --onlyCreate=true
	 * Default: false
	 */
	onlyCreate?: boolean;

	/**
	 * Defines the columns that are supposed to be set as primary keys in the table.
	 * Usage: --primaryKey=id,userId
	 */
	primaryKey?: string | Array<string>;
}
