import { open } from "node:fs/promises";

export async function readAllLines(
  path: string,
  cbk: (line: string) => Promise<void>
) {
  let lineNumber = 0;
  let printMultiple = 100;
  const dataFile = await open(path);
  for await (const line of dataFile.readLines()) {
    await cbk(line);
    if (++lineNumber % printMultiple === 0) {
      console.log(`Processed ${lineNumber} lines.`);
      if (lineNumber === printMultiple * 10 && printMultiple < 100000) {
        printMultiple *= 10;
      }
    }
  }
  console.log(`Processed ${lineNumber} lines.`);
  await dataFile.close();
}
