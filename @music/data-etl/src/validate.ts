import path from "path";
import { open, readFile } from "node:fs/promises";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, "../../../data");

// 20230501-labels.json
// 20230501-masters.json
// 20230501-releases.json

const dataFilePath = path.join(dataPath, "20230501-artists.json");
const dataFile = await open(dataFilePath);
const schemaFilePath = path.join(dataPath, "artists.schema.json");
const schemaFile = await readFile(schemaFilePath);
const schema: Schema = JSON.parse(schemaFile.toString());

console.log("Validating");

import { Schema, Validator } from "jsonschema";
const v = new Validator();
let lineNumber = 0;
for await (const line of dataFile.readLines()) {
  const artist = JSON.parse(line);
  const validationResult = v.validate(artist, schema);
  if (validationResult.errors.length !== 0) {
    console.log(`Error on line ${lineNumber}: `, validationResult.errors);
  }

  if (lineNumber % 1000 == 0) {
    console.log(`Validated ${lineNumber} lines.`);
  }
  lineNumber++;
}
console.log(`Validated ${lineNumber} lines.`);
