export interface ImportConfig {
    /**
     * Path relative to __dirname
     */
    filePath: string;

    /**
     * Columns to be ignored while creating the table and inserting the values
     */
    ignoreColumns?: Array<string>;
}
