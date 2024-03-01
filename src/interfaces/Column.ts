export interface IColumn {
    key: string;
    type: "NULL" | "INTEGER" | "CHARACTER VARYING" | "BOOLEAN" | "JSONB" | "TIMESTAMPTZ";
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
    type: "NULL" | "INTEGER" | "CHARACTER VARYING" | "BOOLEAN" | "JSONB" | "TIMESTAMPTZ";
    size?: number;
    primary?: boolean;

    get toString(): string {
        return `"${this.key}" ${this.type}${this.getSize}${this.getPrimary}`;
    }

    get getSize(): string {
        return this.type === "CHARACTER VARYING" ? `(${this.size ? this.size + 50 : 200})` : "";
    }

    get getPrimary(): string {
        return this.primary ? ` PRIMARY KEY` : "";
    }
}
