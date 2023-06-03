import { Image } from "./image";

type Name = {
  "@id"?: string;
  "#text"?: string;
};

export interface Artist {
  images?: {
    image?: Image | Image[];
  };
  id?: string;
  name?: string | null;
  realname?: string | null;
  profile?: string | null;
  data_quality?: string;
  urls?: {
    url?: string | null | (string | null)[];
  };
  namevariations?: {
    name?: string | string[];
  };
  aliases?: null | {
    name?: Name | Name[];
  };
  members?: {
    id?: string | string[];
    name?: Name | Name[];
  };
  groups?: null | {
    name?: Name | Name[];
  };
}
