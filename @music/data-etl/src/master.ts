import { Image } from "./image";

interface Artist {
  id?: string;
  name?: string;
  anv?: null | string;
  join?: null;
  role?: null;
  tracks?: null;
}

interface Video {
  "@src"?: string;
  "@duration"?: string;
  "@embed"?: string;
  title?: string | null;
  description?: null | string;
}

export interface Master {
  main_release?: string;
  images?: {
    image?: Image | Image[];
  };
  artists?: {
    artist?: Artist | Artist[];
  };
  genres?: {
    genre?: string | string[];
  };
  styles?: {
    style?: string | string[];
  };
  year?: string;
  title?: string;
  data_quality?: string;
  videos?: {
    video?: Video | Video[];
  };
  notes?: string | null;
}
