import { Nav } from "./nav";
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
    <>
      <YourLibrary items={items} />
    </>
  );
};
