import "reflect-metadata";
import { Container } from "typedi";
import express from "express";
import config from "@src/config";
import * as fsAsync from "fs/promises";
import path from "path";
import { ImportConfig } from "@src/interfaces/ImportConfig";
import { ImportService } from "@src/services/ImportService";

const app = express();
app.set('port', config.port);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/", async (req: express.Request, res: express.Response) => {
    const importService = Container.get(ImportService);
    const config1: ImportConfig = req.body;
    const content = JSON.parse((await fsAsync.readFile(path.join(__dirname, "../backup/", config1.filePath))).toString());
    const table = config1.filePath.replace(".json", "");
    const columns = importService.generateColumns(content, config1.ignoreColumns);
    await importService.createTable(table, columns);
    await importService.insertRows(table, columns, content);
    res.sendStatus(200);
});

app.listen(app.get('port'), () => {
    console.log(`server started on port ${app.get('port')}`);
});

