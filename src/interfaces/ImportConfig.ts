export interface ImportConfig {
    /**
     * Path or arrays of paths of the file(s) to be imported, relative to __dirname.
     */
    filePath: string | Array<string>;

    /**
     * Columns to be ignored while creating the table and inserting the values.
     */
    ignoreColumns?: Array<string>;

    /**
     * If set to true, will only create the database, without importing the data.
     * Default: false
     */
    onlyCreate?: boolean;

    /**
     * Defines the columns that are supposed to be set as primary keys in the table.
     */
    primaryKey?: string | Array<string>;
}
