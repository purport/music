import path from "path";
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "url";
import { readAllLines } from "./helpers";
import { compileFromFile } from "json-schema-to-typescript";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, "../../../data");
const outputPath = path.join(__dirname, "generated");

await getSchema(
  100000,
  "20230501-masters.json",
  "master.schema.json",
  "master.ts"
);

await getSchema(
  null,
  "20230501-artists.json",
  "artist.schema.json",
  "artist.ts"
);

await getSchema(
  null,
  "20230501-releases.json",
  "release.schema.json",
  "release.ts"
);

async function getSchema(
  maxLines: number | null,
  dataFileName: string,
  schemaFileName: string,
  typesFileName: string
) {
  const artistsPath = path.join(dataPath, dataFileName);
  let schema: any;
  await readAllLines(artistsPath, maxLines, async (line) => {
    const artist = JSON.parse(line);
    if (schema) {
      mergeTypes([schema, getType(artist)]);
    } else {
      schema = getType(artist);
    }
  });
  convertToJsonSchema(schema);
  await writeFile(
    path.join(outputPath, schemaFileName),
    JSON.stringify(schema)
  );
  const types = await compileFromFile(path.join(outputPath, schemaFileName));
  await writeFile(path.join(outputPath, typesFileName), types);
}

function getType(object: any) {
  if (object == null) {
    return { type: "null" };
  }
  if (typeof object == "object") {
    if (Array.isArray(object)) {
      const items = mergeTypes(object.map(getType));
      return { type: "array", items: items };
    } else {
      const type = { type: "object", properties: <any>{} };
      for (const key in object) {
        type.properties[key] = getType(object[key]);
      }
      return type;
    }
  }
  if (typeof object == "string") {
    return { type: "string" };
  }
  if (typeof object == "number") {
    return { type: "number" };
  }
}

function mergeTypes(object: any[]) {
  let simpleType = new Set<string>();
  let objectType: any;
  let arrayTypes: any[] = [];
  for (const type of object) {
    if (type.type === "object") {
      if (!objectType) objectType = type;
      else {
        for (const prop in type.properties) {
          if (prop in objectType.properties) {
            if (objectType.properties[prop] !== type.properties[prop]) {
              if (!Array.isArray(objectType.properties[prop]))
                objectType.properties[prop] = [objectType.properties[prop]];
              objectType.properties[prop].push(type.properties[prop]);
              objectType.properties[prop] = mergeTypes(
                objectType.properties[prop]
              );
            }
          } else {
            objectType.properties[prop] = type.properties[prop];
          }
        }
      }
    } else if (type.type === "array") {
      arrayTypes.push(type.items);
    } else {
      if (Array.isArray(type.type)) {
        for (let t of type.type) {
          simpleType.add(t);
        }
      } else {
        simpleType.add(type.type);
      }
    }
  }

  let arrayType: any;
  if (arrayTypes.length !== 0) {
    if (arrayTypes.length > 1) {
      arrayType = mergeTypes(arrayTypes);
    } else arrayType = arrayTypes[0];
    arrayType = { type: "array", items: arrayType };
  }

  let st: any;
  if (simpleType.size != 0) {
    if (simpleType.size > 1) {
      st = { type: [...simpleType] };
    } else st = { type: [...simpleType][0] };
  }

  let types = [];
  if (st) types.push(st);
  if (objectType) types.push(objectType);
  if (arrayType) types.push(arrayType);

  return types.length === 1 ? types[0] : types;
}

function convertToJsonSchema(schema: any) {
  if (Array.isArray(schema)) {
    for (const item of schema) {
      convertToJsonSchema(item);
    }
  } else {
    if (schema.items) {
      convertToJsonSchema(schema.items);
    }
    if (schema.properties) {
      for (const key in schema.properties) {
        convertToJsonSchema(schema.properties[key]);
        if (Array.isArray(schema.properties[key])) {
          schema.properties[key] = { anyOf: schema.properties[key] };
        }
      }
    }
  }
}
