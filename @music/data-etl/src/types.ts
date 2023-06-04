export type DataQuality =
  | "Needs Vote"
  | "Correct"
  | "Needs Major Changes"
  | "Complete and Correct"
  | "Needs Minor Changes"
  | "Entirely Incorrect";

export type Artist = {
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

export type Video = {
  src: string;
  embed: boolean | null;
  title: string;
  description: string;
  duration: number;
};

export type Master = {
  id: number;
  year: number | null;
  title: string;
  release: number;
  quality: DataQuality;
  genres: string[];
  styles: string[];
  videos: Video[];
};

export type Release = {
  id: number;
  title: string;
  released: { year: number; month?: number; day?: number };
  quality: DataQuality;
  master: number;
  main: boolean;
  formats: { name: string; descriptions: string[] }[];
  artists: {
    id: number;
    name: string;
    role?: string;
  }[];
  tracks: {
    position: string | null;
    title: string;
    duration: number | null;
    artists: {
      id: number;
      name: string;
      role?: string;
    }[];
  }[];
};
