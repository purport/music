import path from "path";
import { open } from "node:fs/promises";
import { fileURLToPath } from "url";
import { Artist as RawArtist } from "./artist";
import { Master as RawMaster } from "./master";
import { readAllLines } from "./helpers";

transform(transformMaster, "20230501-masters.json", "masters.json");
// transform(transformArtist, "20230501-artists.json", "artists.json");

async function transform<T>(
  f: (line: string) => T | undefined,
  fileName: string,
  outputFileName: string
) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const dataPath = path.join(__dirname, "../../../data");

  const dataFilePath = path.join(dataPath, fileName);
  const outputFile = await open(path.join(dataPath, outputFileName), "w");
  await readAllLines(dataFilePath, null, async (line) => {
    const artist = f(line);
    if (artist == null) return;
    await outputFile.write(JSON.stringify(artist));
    await outputFile.write("\n");
  });

  await outputFile.close();
}

type DataQuality =
  | "Needs Vote"
  | "Correct"
  | "Needs Major Changes"
  | "Complete and Correct"
  | "Needs Minor Changes"
  | "Entirely Incorrect";

type Artist = {
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

function transformArtist(line: string): Artist | undefined {
  const artist: RawArtist = JSON.parse(line);
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
  return {
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
}

type Video = {
  src: string;
  embed: boolean | null;
  title: string;
  description: string;
  duration: number;
};

type Master = {
  year: number | null;
  title: string;
  release: string;
  notes: string;
  quality: DataQuality;
  genres: string[];
  styles: string[];
  videos: Video[];
};

function transformMaster(line: string): Master | undefined {
  const raw: RawMaster = JSON.parse(line);

  if (
    raw.year == null ||
    raw.title == null ||
    raw.main_release == null ||
    raw.data_quality == null
  ) {
    return;
  }

  const notes = raw.notes ?? "";

  raw.genres ??= {};
  raw.genres.genre ??= [];
  if (!Array.isArray(raw.genres.genre)) raw.genres.genre = [raw.genres.genre];
  const genres = raw.genres.genre.filter(notEmpty);

  raw.styles ??= {};
  raw.styles.style ??= [];
  if (!Array.isArray(raw.styles.style)) raw.styles.style = [raw.styles.style];
  const styles = raw.styles.style.filter(notEmpty);

  raw.videos ??= {};
  raw.videos.video ??= [];
  if (!Array.isArray(raw.videos.video)) raw.videos.video = [raw.videos.video];
  const videos = raw.videos.video
    .filter(notEmpty)
    .filter(
      (x) =>
        x["@src"] != null &&
        x.title != null &&
        x["@duration"] != null &&
        !isNaN(parseFloat(x["@duration"]))
    )
    .map(
      (x): Video => ({
        src: x["@src"] ?? "",
        embed: x["@embed"] != null ? x["@embed"] == "true" : null,
        title: x.title ?? "",
        description: x.description ?? "",
        duration: parseFloat(x["@duration"] ?? ""),
      })
    );

  let year: number | null = parseInt(raw.year);
  if (isNaN(year) || year == 0) year = null;

  const quality = raw.data_quality as DataQuality;
  return {
    year,
    title: raw.title,
    release: raw.main_release,
    quality,
    notes,
    genres,
    styles,
    videos,
  };
}

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}
