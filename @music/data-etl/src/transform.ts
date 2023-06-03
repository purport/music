import path from "path";
import { open } from "node:fs/promises";
import { fileURLToPath } from "url";
import { Artist as RawArtist } from "./artist";
import { Master as RawMaster } from "./master";
import { Release as RawRelease } from "./release";
import { readAllLines } from "./helpers";

// console.log("Masters");
// await transform(transformMaster, "20230501-masters.json", "masters.json");
// console.log("");
// console.log("");
console.log("Artists");
await transform(transformArtist, "20230501-artists.json", "artists.json");
console.log("");
console.log("");
console.log("Releases");
await transform(transformRelease, "20230501-releases.json", "releases.json");

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
  id: number;
  quality: DataQuality;
  name: {
    main: string;
    real: string | null;
    variations: string[];
  };
  profile: string;
  urls: string[];
  aliases: {
    id: number;
    name: string;
  }[];
  groups: {
    id: number;
    name: string;
  }[];
  members: {
    id: number;
    name: string;
  }[];
};

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
  release: number;
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
    release,
    quality,
    genres,
    styles,
    videos,
  };
}

type Release = {
  title: string;
  released: { year: number; month?: number; day?: number };
  quality: DataQuality;
  master: number;
  artists: {
    id: number;
    name: string;
    role?: string;
  }[];
  tracks: {
    position: string;
    title: string;
    duration: number;
    artists: {
      id: number;
      name: string;
      role?: string;
    }[];
  }[];
};

function transformRelease(line: string): Release | undefined {
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
  const master =
    raw.master_id["@is_main_release"] === "true"
      ? parseInt(raw.master_id["#text"] ?? "")
      : null;
  if (master == null || isNaN(master)) return;

  raw.tracklist.track ??= [];
  if (!Array.isArray(raw.tracklist.track))
    raw.tracklist.track = [raw.tracklist.track];

  const validTracks = raw.tracklist.track.filter(
    (t) => t.position != null && t.title != null && t.duration != null
  );
  if (
    validTracks.length !== raw.tracklist.track.length ||
    raw.tracklist.track.length === 0
  )
    return;

  let hasInvalidTrack = false;
  const tracks = validTracks.map((x) => {
    const durationSplits = (x.duration ?? "").split(":");
    let duration = NaN;
    if (durationSplits.length == 2) {
      duration = parseInt(durationSplits[0]) * 60 + parseInt(durationSplits[1]);
    }

    if (isNaN(duration)) hasInvalidTrack = true;
    return {
      position: x.position!,
      title: x.title!,
      duration: duration,
      artists: getArtists(x),
    };
  });

  if (hasInvalidTrack) return;

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

  const quality = raw.data_quality as DataQuality;
  return {
    master,
    title: raw.title,
    released: date,
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
