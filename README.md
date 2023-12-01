# json-to-postgresql
A simple application that imports JSON collections into PostgreSQL.
It auto-detects column names, column types, creates the table and imports the data into the table.

Currently, it only supports locally saved .json files, and it's using express requests to manage these imports.

# Planned
Currently planned:
- Bigint support
- Console support
- Different configs (for indexing, specifying types and others)
