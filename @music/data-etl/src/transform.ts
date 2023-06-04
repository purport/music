import path from "path";
import { open } from "node:fs/promises";
import { fileURLToPath } from "url";
import { Artist as RawArtist } from "./generated/artist";
import { Master as RawMaster } from "./generated/master";
import { Release as RawRelease } from "./generated/release";
import { readAllLines } from "./helpers";
import { DataQuality, Video, Artist, Master, Release } from "./types";

let masterId = 0;
let releaseId = 0;
console.log("Masters");
await transform(transformMaster, "20230501-masters.json", "masters.json");
console.log("Artists");
await transform(transformArtist, "20230501-artists.json", "artists.json");
console.log("Releases");
await transform(transformRelease, "20230501-releases.json", "releases.json");
console.log("Done");

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

function transformArtist(line: string): Artist | undefined {
  const artist: RawArtist = JSON.parse(line);
  if (artist.id == null || artist.name == null) return;
  if (artist.realname == null) artist.realname = null;

  const id = parseInt(artist.id);
  if (isNaN(id)) return;

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
    id,
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
      .filter(
        (g) =>
          g["@id"] != null && g["#text"] != null && !isNaN(parseInt(g["@id"]))
      )
      .map((g) => ({ id: parseInt(g["@id"]!), name: g["#text"]! })),
    groups: artist.groups.name
      .filter(notEmpty)
      .filter(
        (g) =>
          g["@id"] != null && g["#text"] != null && !isNaN(parseInt(g["@id"]))
      )
      .map((g) => ({ id: parseInt(g["@id"]!), name: g["#text"]! })),
    members: artist.members.name
      .filter(notEmpty)
      .filter(
        (g) =>
          g["@id"] != null && g["#text"] != null && !isNaN(parseInt(g["@id"]))
      )
      .map((g) => ({ id: parseInt(g["@id"]!), name: g["#text"]! })),
  };
}

function transformMaster(line: string): Master | undefined {
  ++masterId;
  const raw: RawMaster = JSON.parse(line);

  if (
    raw.year == null ||
    raw.title == null ||
    raw.main_release == null ||
    raw.data_quality == null
  ) {
    return;
  }

  let release = parseInt(raw.main_release);
  if (isNaN(release)) return;

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
      (x: any) =>
        x["@src"] != null &&
        x.title != null &&
        x["@duration"] != null &&
        !isNaN(parseFloat(x["@duration"]))
    )
    .map(
      (x: any): Video => ({
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
    id: masterId,
    year,
    title: raw.title,
    release,
    quality,
    genres,
    styles,
    videos,
  };
}

function transformRelease(line: string): Release | undefined {
  ++releaseId;
  const raw: RawRelease = JSON.parse(line);

  if (
    raw.released == null ||
    raw.title == null ||
    raw.master_id == null ||
    raw.data_quality == null ||
    raw.tracklist == null
  ) {
    return;
  }
  const master = parseInt(raw.master_id["#text"] ?? "");
  const main = raw.master_id["@is_main_release"] == "true";
  if (master == null || isNaN(master)) return;

  raw.tracklist.track ??= [];
  if (!Array.isArray(raw.tracklist.track))
    raw.tracklist.track = [raw.tracklist.track];

  const validTracks = raw.tracklist.track;

  const tracks = validTracks.map((x) => {
    const durationSplits = (x.duration ?? "").split(":");
    let duration: number | null = NaN;
    if (durationSplits.length == 2) {
      duration = parseInt(durationSplits[0]) * 60 + parseInt(durationSplits[1]);
    }

    if (isNaN(duration)) {
      duration = null;
    }
    return {
      position: x.position ?? null,
      title: x.title ?? "",
      duration: duration ?? null,
      artists: getArtists(x),
    };
  });

  let released = raw.released.split("-");
  if (released.length > 3) return;
  let date: { year: number; month?: number; day?: number } = {
    year: parseInt(released[0]),
  };
  if (released.length > 1) {
    date.month = parseInt(released[1]);
    if (date.month == 0) delete date.month;
  }
  if (released.length > 2) {
    date.day = parseInt(released[2]);
    if (date.day == 0) delete date.day;
  }
  if (isNaN(date.year) || isNaN(date.month ?? 0) || isNaN(date.day ?? 0))
    return;
  raw.formats ??= {};
  raw.formats.format ??= [];
  if (!Array.isArray(raw.formats.format))
    raw.formats.format = [raw.formats.format];

  const formats = raw.formats.format
    .filter((x) => x["@name"] != null)
    .map((x) => {
      let des: string[] | string | undefined = (x.descriptions ?? {})
        .description as any;
      if (des == null) des = [];
      if (!Array.isArray(des)) des = [des];
      return {
        name: x["@name"] ?? "",
        descriptions: des.filter(notEmpty),
      };
    });

  const quality = raw.data_quality as DataQuality;
  return {
    id: releaseId,
    master,
    main,
    title: raw.title,
    released: date,
    formats,
    artists: getArtists(raw),
    tracks,
    quality,
  };
}

function getArtists(x: any): {
  id: number;
  name: string;
  role?: string;
}[] {
  x.artists ??= {};
  x.artists.artist ??= [];
  if (!Array.isArray(x.artists.artist)) x.artists.artist = [x.artists.artist];
  x.extraartists ??= {};
  x.extraartists.artist ??= [];
  if (!Array.isArray(x.extraartists.artist))
    x.extraartists.artist = [x.extraartists.artist];

  const artists: { id: number; name: string }[] = (x.artists as any).artist.map(
    (a: { id: string; name: string }) => ({
      id: parseInt(a.id),
      name: a.name as string,
    })
  );
  const extraartists: { id: number; name: string; role: string }[] = (
    x.extraartists as any
  ).artist
    .map((a: any) => ({
      id: parseInt(a.id),
      name: a.name as string,
      role: (a.role ?? "") as string,
    }))
    .filter(
      (a: { id: number; name: string; role: string | null }) =>
        !isNaN(a.id) && a.role != null
    );

  return [...artists, ...extraartists];
}

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}
