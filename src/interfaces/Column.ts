export interface IColumn {
	key: string;
	type:
		| "NULL"
		| "INTEGER"
		| "CHARACTER VARYING"
		| "BOOLEAN"
		| "JSONB"
		| "TIMESTAMPTZ";
	size?: number;
	primary?: boolean;
}

export class Column {
	constructor(column: IColumn) {
		this.key = column.key;
		this.type = column.type;
		this.size = column.size;
		this.primary = column.primary;
	}

	key: string;
	type:
		| "NULL"
		| "INTEGER"
		| "CHARACTER VARYING"
		| "BOOLEAN"
		| "JSONB"
		| "TIMESTAMPTZ";
	size?: number;
	primary?: boolean;

	get getCreateString(): string {
		return `"${this.key}" ${this.type}${this.getSize}${this.getPrimary}`;
	}

	get getReplaceString(): string {
		return `ALTER COLUMN "${this.key}" TYPE ${this.type}${this.getSize};`;
	}

	get getSize(): string {
		return this.type === "CHARACTER VARYING" ? `(255)` : "";
	}

	get getPrimary(): string {
		return this.primary ? ` PRIMARY KEY` : "";
	}
}
