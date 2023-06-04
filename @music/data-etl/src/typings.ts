import path from "path";
import { fileURLToPath } from "url";
import { compileFromFile } from "json-schema-to-typescript";
import { writeFile } from "node:fs/promises";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, "../../../data");
const srcPath = __dirname;

const artistType = await compileFromFile(
  path.join(dataPath, "artist.schema.json")
);
await writeFile(path.join(srcPath, "artist.ts"), artistType);

const masterType = await compileFromFile(
  path.join(dataPath, "master.schema.json")
);
await writeFile(path.join(srcPath, "master.ts"), masterType);

const releaseType = await compileFromFile(
  path.join(dataPath, "release.schema.json")
);
await writeFile(path.join(srcPath, "release.ts"), releaseType);
