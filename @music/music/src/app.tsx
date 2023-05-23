import { Player } from "./player";
import { theme } from "./theme";
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

  return (
    <div class={`h-full flex flex-col items-stretch ${theme.body}`}>
      <div class="grow flex">
        <YourLibrary items={items} />
        <div class={`grow rounded-lg mt-2 p-4 ${theme.panel}`}>
          <h1 class="text-3xl font-bold font-title">Good morning</h1>
        </div>
      </div>
      <div class="grow-0 flex justify-center p-6">
        <Player />
      </div>
    </div>
  );
};
