import { Match, Show, Switch, createSignal } from "solid-js";

type Size = "expanded" | "enlarged" | "collapsed";

export interface LibraryItem {
  pinned: boolean;
  name: string;
  type: "Playlist" | "Album" | "Artist";
  added: Date | null;
  played: Date | null;
}

export const YourLibrary = ({ items }: { items: LibraryItem[] }) => {
  const [size, setSize] = createSignal<Size>("expanded");
  const sizes = {
    expanded:
      "h-full bg-zinc-950 fill-zinc-400 text-zinc-400 flex flex-col min-w-fit max-w-xs",
    enlarged:
      "h-full bg-zinc-950 fill-zinc-400 text-zinc-400 flex flex-col min-w-fit max-w-lg",
    collapsed:
      "h-full bg-zinc-950 fill-zinc-400 text-zinc-400 flex flex-col max-w-fit",
  };
  return (
    <div class={sizes[size()]}>
      <div class="bg-neutral-900 flex flex-col text-lg font-bold px-4 pt-3 m-2 rounded-md">
        <button class="flex h-10">
          <IconHome />
          <Show when={size() !== "collapsed"}>
            <span class="px-2">Home</span>
          </Show>
        </button>
        <button class="flex h-10">
          <IconSearch />
          <Show when={size() !== "collapsed"}>
            <span class="px-2">Search</span>
          </Show>
        </button>
      </div>

      <div class="flex grow flex-col bg-neutral-900 mt-1 mx-2 rounded-md overflow-y-scroll">
        <div class="sticky bg-neutral-900 top-0 pt-4">
          <div class="flex text-lg font-bold h-10 px-4">
            <Show when={size() !== "collapsed"}>
              <button class="grow flex" onClick={[setSize, "collapsed"]}>
                <LibraryIcon />
                <span class="grow text-left px-2">Your Library</span>
              </button>
              <button class="px-4 h-7">
                <AddIcon />
              </button>
            </Show>
            <Show when={size() === "collapsed"}>
              <button class="grow flex" onClick={[setSize, "expanded"]}>
                <LibraryIcon />
                <span class="grow text-left"></span>
              </button>
            </Show>
            <Switch>
              <Match when={size() === "expanded"}>
                <button class="h-7" onClick={[setSize, "enlarged"]}>
                  <RightIcon />
                </button>
              </Match>
              <Match when={size() === "enlarged"}>
                <button class="h-7" onClick={[setSize, "expanded"]}>
                  <LeftIcon />
                </button>
              </Match>
            </Switch>
          </div>
        </div>
        <div class="px-3">
          <Switch>
            <Match when={size() === "expanded"}>
              <ExpandedList items={items} />
            </Match>
            <Match when={size() === "enlarged"}>
              <EnlargedList items={items} />
            </Match>
            <Match when={size() === "collapsed"}>
              <CollapsedList items={items} />
            </Match>
          </Switch>
        </div>
      </div>
    </div>
  );
};

function CollapsedList({ items }: { items: LibraryItem[] }) {
  return (
    <div class="grow flex flex-col space-y-3 overflow-y-scroll">
      {items.map((item) => (
        <span class="leading-8">{Box(item)}</span>
      ))}
    </div>
  );
}

function Box(_item: LibraryItem) {
  return <div class="rounded-md w-9 h-9 bg-red-100"></div>;
}

function ExpandedList({ items }: { items: LibraryItem[] }) {
  return (
    <div class="grow flex flex-col overflow-y-scroll">
      {items.map((item) => (
        <span class="leading-8">{Row(item)}</span>
      ))}
    </div>
  );
}

function EnlargedList({ items }: { items: LibraryItem[] }) {
  return (
    <div class="grow border-collapse overflow-y-scroll">
      <table class="table-fixed">
        <thead class="table-header-group text-sm">
          <tr>
            <th class="w-full text-left font-normal">Title</th>
            <th class="w-24 px-2 whitespace-nowrap text-left font-normal">
              Date Added
            </th>
            <th class="w-24 px-2 text-left font-normal">Played</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr class="leading-8">
              <td class="w-full whitespace-nowrap overflow-hidden">
                {Row(item)}
              </td>
              <td class="w-24 px-2 text-sm">
                {item.added?.toLocaleDateString()}
              </td>
              <td class="w-24 px-2 text-sm">
                {item.played?.toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Row(item: LibraryItem) {
  return (
    <>
      <Show when={item.pinned}>
        <span class="pr-2 fill-green-400">
          <PinIcon />
        </span>
      </Show>
      <span class="text-white">{item.name}</span>
      <span class="px-1 font-bold">•</span>
      <span class="">{item.type}</span>
    </>
  );
}

function PinIcon() {
  return (
    <svg
      class="inline-block"
      role="img"
      height="12"
      width="12"
      aria-hidden="false"
      viewBox="0 0 16 20"
      data-encore-id="icon"
    >
      <title>Pinned</title>
      <path d="M8.822.797a2.72 2.72 0 0 1 3.847 0l2.534 2.533a2.72 2.72 0 0 1 0 3.848l-3.678 3.678-1.337 4.988-4.486-4.486L1.28 15.78a.75.75 0 0 1-1.06-1.06l4.422-4.422L.156 5.812l4.987-1.337L8.822.797z"></path>
    </svg>
  );
}

function LibraryIcon() {
  return (
    <svg
      role="img"
      height="24"
      width="24"
      aria-hidden="true"
      viewBox="0 0 24 24"
      data-encore-id="icon"
      class="Svg-sc-ytk21e-0 ldgdZj"
    >
      <path d="M3 22a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1zM15.5 2.134A1 1 0 0 0 14 3v18a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6.464a1 1 0 0 0-.5-.866l-6-3.464zM9 2a1 1 0 0 0-1 1v18a1 1 0 1 0 2 0V3a1 1 0 0 0-1-1z"></path>
    </svg>
  );
}

function AddIcon() {
  return (
    <svg
      role="img"
      height="16"
      width="16"
      aria-hidden="true"
      viewBox="0 0 16 16"
      data-encore-id="icon"
      class="Svg-sc-ytk21e-0 ldgdZj"
    >
      <path d="M15.25 8a.75.75 0 0 1-.75.75H8.75v5.75a.75.75 0 0 1-1.5 0V8.75H1.5a.75.75 0 0 1 0-1.5h5.75V1.5a.75.75 0 0 1 1.5 0v5.75h5.75a.75.75 0 0 1 .75.75z"></path>
    </svg>
  );
}
function RightIcon() {
  return (
    <svg
      role="img"
      height="16"
      width="16"
      aria-hidden="true"
      viewBox="0 0 16 16"
      data-encore-id="icon"
      class="Svg-sc-ytk21e-0 eNWijz"
    >
      <path d="M7.19 1A.749.749 0 0 1 8.47.47L16 7.99l-7.53 7.521a.75.75 0 0 1-1.234-.815.75.75 0 0 1 .174-.243l5.72-5.714H.75a.75.75 0 1 1 0-1.498h12.38L7.41 1.529a.749.749 0 0 1-.22-.53z"></path>
    </svg>
  );
}
function LeftIcon() {
  return (
    <svg
      role="img"
      height="16"
      width="16"
      aria-hidden="true"
      viewBox="0 0 16 16"
      data-encore-id="icon"
      class="Svg-sc-ytk21e-0 eNWijz"
    >
      <path d="M8.81 1A.749.749 0 0 0 7.53.47L0 7.99l7.53 7.521a.75.75 0 0 0 1.234-.815.75.75 0 0 0-.174-.243L2.87 8.74h12.38a.75.75 0 1 0 0-1.498H2.87l5.72-5.713c.14-.14.22-.331.22-.53z"></path>
    </svg>
  );
}

function IconHome() {
  return (
    <svg
      role="img"
      height="24"
      width="24"
      aria-hidden="true"
      class="Svg-sc-ytk21e-0 ldgdZj home-active-icon"
      viewBox="0 0 24 24"
      data-encore-id="icon"
    >
      <path d="M13.5 1.515a3 3 0 0 0-3 0L3 5.845a2 2 0 0 0-1 1.732V21a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6h4v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V7.577a2 2 0 0 0-1-1.732l-7.5-4.33z"></path>
    </svg>
  );
}

function IconSearch() {
  return (
    <svg
      role="img"
      height="24"
      width="24"
      aria-hidden="true"
      class="Svg-sc-ytk21e-0 ldgdZj search-icon"
      viewBox="0 0 24 24"
      data-encore-id="icon"
    >
      <path d="M10.533 1.279c-5.18 0-9.407 4.14-9.407 9.279s4.226 9.279 9.407 9.279c2.234 0 4.29-.77 5.907-2.058l4.353 4.353a1 1 0 1 0 1.414-1.414l-4.344-4.344a9.157 9.157 0 0 0 2.077-5.816c0-5.14-4.226-9.28-9.407-9.28zm-7.407 9.279c0-4.006 3.302-7.28 7.407-7.28s7.407 3.274 7.407 7.28-3.302 7.279-7.407 7.279-7.407-3.273-7.407-7.28z"></path>
    </svg>
  );
}
