import { Player } from "./player";
import { theme } from "./theme";
import { Track, TrackListing } from "./track-listing";
import { LibraryItem, YourLibrary } from "./your-library";

export const App = () => {
  const items: LibraryItem[] = [
    {
      name: "Liked Songs",
      type: "Playlist",
      pinned: true,
      added: null,
      played: null,
    },
    {
      name: "The Cure Greatest Hits",
      type: "Playlist",
      pinned: false,
      added: new Date(),
      played: null,
    },
    {
      name: "Release Radar",
      type: "Playlist",
      pinned: false,
      added: new Date(),
      played: new Date(990999900000),
    },
    {
      name: "Back In Black",
      type: "Album",
      pinned: false,
      added: new Date(996099900000),
      played: null,
    },
  ];

  const tracks: Track[] = [
    {
      title: "Migration",
      artist: "Bonobo",
      album: "Migration",
      date: new Date(),
      duration: "5:27",
    },
    {
      title: "Weightless Part 1",
      artist: "Marconi Union",
      album: "Weightless (Ambient Transmission Vol. 2)",
      date: new Date(),
      duration: "8:06",
    },
    {
      title: "Reblazhenstva",
      artist: "Ricardo Villalobos, Max Loderbauer",
      album: "RE: ECM",
      date: new Date(),
      duration: "7:40",
    },
    {
      title: "Migration",
      artist: "Bonobo",
      album: "Migration",
      date: new Date(),
      duration: "5:27",
    },
    {
      title: "Weightless Part 1",
      artist: "Marconi Union",
      album: "Weightless (Ambient Transmission Vol. 2)",
      date: new Date(),
      duration: "8:06",
    },
    {
      title: "Reblazhenstva",
      artist: "Ricardo Villalobos, Max Loderbauer",
      album: "RE: ECM",
      date: new Date(),
      duration: "7:40",
    },
    {
      title: "Migration",
      artist: "Bonobo",
      album: "Migration",
      date: new Date(),
      duration: "5:27",
    },
    {
      title: "Weightless Part 1",
      artist: "Marconi Union",
      album: "Weightless (Ambient Transmission Vol. 2)",
      date: new Date(),
      duration: "8:06",
    },
    {
      title: "Reblazhenstva",
      artist: "Ricardo Villalobos, Max Loderbauer",
      album: "RE: ECM",
      date: new Date(),
      duration: "7:40",
    },
    {
      title: "Migration",
      artist: "Bonobo",
      album: "Migration",
      date: new Date(),
      duration: "5:27",
    },
    {
      title: "Weightless Part 1",
      artist: "Marconi Union",
      album: "Weightless (Ambient Transmission Vol. 2)",
      date: new Date(),
      duration: "8:06",
    },
    {
      title: "Reblazhenstva",
      artist: "Ricardo Villalobos, Max Loderbauer",
      album: "RE: ECM",
      date: new Date(),
      duration: "7:40",
    },
  ];

  return (
    <div class={`h-full flex flex-col items-stretch ${theme.body}`}>
      <div class={`flex items-stretch ${theme.body} overflow-y-hidden`}>
        <YourLibrary items={items} />
        <div
          class={`flex flex-col rounded-lg mt-2 mr-2 z-10 ${theme.panel} relative overflow-y-auto`}
        >
          <div class="h-[450px] rounded-lg bg-gradient-to-b from-[#d00098] absolute left-0 top-0 right-0 z-0 "></div>
          <div class="flex z-10 mt-[100px] mb-6 items-end">
            <div class="flex mx-6">
              <img
                style="width: auto; height: auto; max-width:232px; max-height:192px"
                aria-hidden="false"
                loading="eager"
                src="https://i.scdn.co/image/ab67706c0000da843b65034a93d055d3d69e9808"
                alt="Pure Flow Coding"
                class="mMx2LUixlnN_Fu45JpFB CmkY1Ag0tJDfnFXbGgju _EShSNaBK1wUIaZQFJJQ Yn2Ei5QZn19gria6LjZj"
                sizes="(min-width: 1280px) 232px, 192px"
              />
            </div>
            <div class="grow">
              <h1 class={`font-extrabold text-6xl text-white `}>
                Pure Flow Coding
              </h1>
            </div>
          </div>
          <div class={`${theme.overlay} p-4 grow z-10`}>
            <div class="h-[100px]"></div>
            <TrackListing tracks={tracks} />
          </div>
        </div>
      </div>
      <div
        class={`flex justify-center z-10 h-[100px] w-full p-4 ${theme.body}`}
      >
        <Player />
      </div>
    </div>
  );
};
