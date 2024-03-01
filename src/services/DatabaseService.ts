import config from "@src/config";
import { Pool } from "pg";
import { Service } from "typedi";

@Service()
export class DatabaseService {
    private readonly connection: Pool;

    constructor() {
        this.connection = new Pool({
            connectionString: config.connection_string
        });
    }

    async query(query: string) {
        const client = await this.connection.connect();
        try {
            return client.query(query);
        } finally {
            client.release();
        }
    }
}
