import { ArtistRef } from "./artist-ref";
import { Image } from "./image";
import { Video } from "./video";

export interface Master {
  main_release?: string;
  images?: {
    image?: Image | Image[];
  };
  artists?: {
    artist?: ArtistRef | ArtistRef[];
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
  notes?: string;
}
