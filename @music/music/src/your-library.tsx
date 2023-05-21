import { Match, Show, Switch, createSignal } from "solid-js";
import s from "./your-library.module.scss";

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
  return (
    <div class={s[size()]}>
      <Show
        when={size() !== "collapsed"}
        fallback={
          <>
            <div class={s.header_small}>
              <button onClick={[setSize, "expanded"]}>
                <LibraryIcon />
              </button>
            </div>
            <CollapsedList items={items} />
          </>
        }
      >
        <div class={s.header}>
          <button onClick={[setSize, "collapsed"]}>
            <LibraryIcon />
          </button>
          <button class={s.collapse_btn} onClick={[setSize, "collapsed"]}>
            Your Library
          </button>
          <button class="px-4">
            <AddIcon />
          </button>
          <Switch>
            <Match when={size() === "expanded"}>
              <button onClick={[setSize, "enlarged"]}>
                <RightIcon />
              </button>
            </Match>
            <Match when={size() === "enlarged"}>
              <button onClick={[setSize, "expanded"]}>
                <LeftIcon />
              </button>
            </Match>
          </Switch>
        </div>
        <div class={s.list}>
          <Switch>
            <Match when={size() === "expanded"}>
              <ExpandedList items={items} />
            </Match>
            <Match when={size() === "enlarged"}>
              <EnlargedList items={items} />
            </Match>
          </Switch>
        </div>
      </Show>
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
        <thead class="table-header-group text-zinc-400 text-sm">
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
              <td class="w-24 px-2 text-zinc-400 text-sm">
                {item.added?.toLocaleDateString()}
              </td>
              <td class="w-24 px-2 text-zinc-400 text-sm">
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
        <span class="pr-2">📌</span>
      </Show>
      <span class="text-white">{item.name}</span>
      <span class="text-zinc-400 px-1 font-bold">•</span>
      <span class="text-zinc-400">{item.type}</span>
    </>
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
