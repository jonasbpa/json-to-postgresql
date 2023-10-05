export interface IColumn {
    key: string;
    type: "NULL" | "INTEGER" | "CHARACTER VARYING" | "BOOLEAN" | "JSONB" | "TIMESTAMPTZ";
    size?: number;
}

export class Column {
    constructor(column: IColumn) {
        this.key = column.key;
        this.type = column.type;
        this.size = column.size;
    }

    key: string;
    type: "NULL" | "INTEGER" | "CHARACTER VARYING" | "BOOLEAN" | "JSONB" | "TIMESTAMPTZ";
    size?: number;

    get toString(): string {
        return `"${this.key}" ${this.type}${this.getSize}`;
    }

    get getSize(): string {
        return this.type === "CHARACTER VARYING" ? `(${this.size})` : "";
    }
}
