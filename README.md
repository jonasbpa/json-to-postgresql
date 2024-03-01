# json-to-postgresql
A simple application that imports JSON collections into PostgreSQL.
It auto-detects column names, column types, creates the table and imports the data into the table.

Currently, it only supports locally saved .json files, and it's using express requests to manage these imports.

# Planned
Currently planned:
- Bigint support
- Console support
- Interactive configuration for fixing or changing types after auto-detection
- Different configs (for dynamic indexing, specifying types and others)
