# json-to-postgresql
A simple application that imports JSON collections into PostgreSQL.
It auto-detects column names, column types, creates the table and imports the data into the table.

Currently, it only supports locally saved .json files, and it's using command line arguments to manage these imports.

# Planned
Currently being worked on:
- Implement actions, such as: `create, update, import, createAndImport, updateAndImport`
- Replace (upsert) when importing

Currently planned:
- Bigint support
- Interactive configuration for fixing or changing types after auto-detection
- Different configs (for dynamic indexing, specifying types and others)
