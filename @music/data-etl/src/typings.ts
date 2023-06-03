import path from "path";
import { fileURLToPath } from "url";
import { compileFromFile } from "json-schema-to-typescript";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, "../../../data");

// 20230501-labels.json
// 20230501-masters.json
// 20230501-releases.json

// const schemaFilePath = path.join(dataPath, "artist.schema.json");
// const typings = await compileFromFile(schemaFilePath);
// console.log(typings);
const schemaFilePath = path.join(dataPath, "master.schema.json");
const typings = await compileFromFile(schemaFilePath);
console.log(typings);
