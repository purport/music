import { DataQuality, Video, Artist, Master, Release } from "./types";
import path from "path";
import { fileURLToPath } from "url";
import { readAllLines } from "./helpers";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, "../../../data");
const mastersFilePath = path.join(dataPath, "masters.json");
const artistsFilePath = path.join(dataPath, "artists.json");
const releasesFilePath = path.join(dataPath, "releases.json");

// const artists = new Map<number, Artist>();
const masters = new Map<number, Master>();
await readAllLines(mastersFilePath, null, async (line) => {
  const master: Master = JSON.parse(line);
  masters.set(master.release, master);
});

await readAllLines(releasesFilePath, 100, async (line) => {
  const release: Release = JSON.parse(line);
  let master = masters.get(release.id);
  if (master) {
    if (!release.main) {
      console.warn(
        "Release is a master but the main flag is not set",
        JSON.stringify(release).substring(0, 70)
      );
    }

    console.log(
      `${release.master},${release.main},${release.title},${JSON.stringify(
        release.released
      )} -> ${master?.title},${master?.release},${master?.year}`
    );
  } else {
    console.log(
      `Cannot find master for ${release.master},${release.main},${
        release.title
      },${JSON.stringify(release.released)}`
    );
  }
});
