import path from "path";
import { open } from "node:fs/promises";
import { fileURLToPath } from "url";
import { Artist } from "./artist";
import { readAllLines } from "./helpers";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, "../../../data");

type DataQuality =
  | "Needs Vote"
  | "Correct"
  | "Needs Major Changes"
  | "Complete and Correct"
  | "Needs Minor Changes"
  | "Entirely Incorrect";

type MyArtist = {
  id: string;
  quality: DataQuality;
  name: {
    main: string;
    real: string | null;
    variations: string[];
  };
  profile: string;
  urls: string[];
  aliases: {
    id: string;
    name: string;
  }[];
  groups: {
    id: string;
    name: string;
  }[];
  members: {
    id: string;
    name: string;
  }[];
};
const dataFilePath = path.join(dataPath, "20230501-artists.json");

const outputFile = await open(path.join(dataPath, "artists.json"), "w");
await readAllLines(dataFilePath, async (line) => {
  const artist: Artist = JSON.parse(line);
  if (artist.id == null || artist.name == null) return;
  if (artist.realname == null) artist.realname = null;

  if (artist.aliases == null) artist.aliases ??= {};
  if (artist.aliases.name == null) artist.aliases.name = [];
  if (!Array.isArray(artist.aliases.name))
    artist.aliases.name = [artist.aliases.name];

  if (artist.urls == null) artist.urls = {};
  if (artist.urls.url == null) artist.urls.url = [];
  if (!Array.isArray(artist.urls.url)) artist.urls.url = [artist.urls.url];

  if (artist.namevariations == null) artist.namevariations = {};
  if (artist.namevariations.name == null) artist.namevariations.name = [];
  if (!Array.isArray(artist.namevariations.name))
    artist.namevariations.name = [artist.namevariations.name];

  if (artist.members == null) artist.members = {};
  if (artist.members.name == null) artist.members.name = [];
  if (artist.members.id == null) artist.members.id = [];
  if (!Array.isArray(artist.members.name))
    artist.members.name = [artist.members.name];
  if (!Array.isArray(artist.members.id))
    artist.members.id = [artist.members.id];

  if (artist.groups == null) artist.groups = {};
  if (artist.groups.name == null) artist.groups.name = [];
  if (!Array.isArray(artist.groups.name))
    artist.groups.name = [artist.groups.name];

  const quality = artist.data_quality as DataQuality;
  const newArtist: MyArtist = {
    id: artist.id,
    quality,
    name: {
      main: artist.name,
      real: artist.realname,
      variations: artist.namevariations.name.filter(notEmpty),
    },
    profile: artist.profile ?? "",
    urls: artist.urls.url.filter(notEmpty),
    aliases: artist.aliases.name
      .filter(notEmpty)
      .filter((g) => g["@id"] != null && g["#text"] != null)
      .map((g) => ({ id: g["@id"]!, name: g["#text"]! })),
    groups: artist.groups.name
      .filter(notEmpty)
      .filter((g) => g["@id"] != null && g["#text"] != null)
      .map((g) => ({ id: g["@id"]!, name: g["#text"]! })),
    members: artist.members.name
      .filter(notEmpty)
      .filter((g) => g["@id"] != null && g["#text"] != null)
      .map((g) => ({ id: g["@id"]!, name: g["#text"]! })),
  };

  await outputFile.write(JSON.stringify(newArtist));
  await outputFile.write("\n");
});

await outputFile.close();

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}
