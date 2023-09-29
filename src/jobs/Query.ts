import { Container } from "typedi";
import { DatabaseService } from "@src/services/DatabaseService";

export default {
    key: 'Query',
    async handle({ data }: { data: any }) {
        await Container.get(DatabaseService).query(data.sql);
    }
};
