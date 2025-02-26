export interface IColumn {
	key: string;
	type: "NULL" | "INTEGER" | "TEXT" | "BOOLEAN" | "JSONB" | "TIMESTAMPTZ";
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
	type: "NULL" | "INTEGER" | "TEXT" | "BOOLEAN" | "JSONB" | "TIMESTAMPTZ";
	size?: number;
	primary?: boolean;

	get getCreateString(): string {
		return `"${this.key}" ${this.type}${this.getPrimary}`;
	}

	get getReplaceString(): string {
		return `ALTER COLUMN "${this.key}" TYPE ${this.type}`;
	}

	get getPrimary(): string {
		return this.primary ? ` PRIMARY KEY` : "";
	}
}
