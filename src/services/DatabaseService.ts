import { Pool } from "pg";

export class DatabaseService {
	private readonly connection: Pool;

	constructor(connString: string) {
		this.connection = new Pool({
			connectionString: connString
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
