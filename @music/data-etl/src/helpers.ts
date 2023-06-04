import { open } from "node:fs/promises";

export async function readAllLines(
  path: string,
  max: number | null,
  cbk: (line: string) => Promise<void>
) {
  let print = false;
  let lineNumber = 0;
  let printMultiple = 100;
  const dataFile = await open(path);
  for await (const line of dataFile.readLines()) {
    await cbk(line);
    if (++lineNumber % printMultiple === 0) {
      if (print) console.log(`Processed ${lineNumber} lines.`);
      if (lineNumber === printMultiple * 10 && printMultiple < 100000) {
        printMultiple *= 10;
      }
    }
    if (max != null) {
      if (lineNumber >= max) break;
    }
  }
  console.log(`Processed ${lineNumber} lines.`);
  await dataFile.close();
}
