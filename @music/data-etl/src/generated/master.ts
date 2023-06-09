/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface Master {
  main_release?: string;
  images?: {
    image?:
      | {
          "@type"?: string;
          "@uri"?: string;
          "@uri150"?: string;
          "@width"?: string;
          "@height"?: string;
          [k: string]: unknown;
        }
      | {
          "@type"?: string;
          "@uri"?: string;
          "@uri150"?: string;
          "@width"?: string;
          "@height"?: string;
          [k: string]: unknown;
        }[];
    [k: string]: unknown;
  };
  artists?: {
    artist?:
      | {
          id?: string;
          name?: string;
          anv?: null | string;
          join?: null;
          role?: null;
          tracks?: null;
          [k: string]: unknown;
        }
      | {
          id?: string;
          name?: string;
          anv?: null | string;
          join?: string | null;
          role?: null;
          tracks?: null;
          [k: string]: unknown;
        }[];
    [k: string]: unknown;
  };
  genres?: {
    genre?: string | string[];
    [k: string]: unknown;
  };
  styles?: {
    style?: string | string[];
    [k: string]: unknown;
  };
  year?: string;
  title?: string;
  data_quality?: string;
  videos?: {
    video?:
      | {
          "@src"?: string;
          "@duration"?: string;
          "@embed"?: string;
          title?: string | null;
          description?: null | string;
          [k: string]: unknown;
        }
      | {
          "@src"?: string;
          "@duration"?: string;
          "@embed"?: string;
          title?: string | null;
          description?: string | null;
          [k: string]: unknown;
        }[];
    [k: string]: unknown;
  };
  notes?: string | null;
  [k: string]: unknown;
}
