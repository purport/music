import { theme } from "./theme";

export interface Track {
  title: string;
  artist: string;
  album: string;
  date: Date;
  duration: string;
}

export const TrackListing = ({ tracks }: { tracks: Track[] }) => {
  return (
    <table class={`w-full table-fixed ${theme.text.secondary}`}>
      <thead>
        <tr class="text-sm text-left">
          <th
            class={`pr-4 pb-2 w-12 text-right font-normal ${theme.border.bottom}`}
          >
            #
          </th>
          <th class={`pr-2 pb-2 font-normal ${theme.border.bottom}`}>Title</th>
          <th class={`pr-2 pb-2 font-normal ${theme.border.bottom}`}>Album</th>
          <th class={`pr-2 pb-2 w-32 font-normal ${theme.border.bottom}`}>
            Date added
          </th>
          <th
            class={`pr-12 pb-2 w-24 text-right font-normal ${theme.border.bottom}`}
          >
            <span class={`${theme.icon.default}`}>
              <DurationIcon />
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        {tracks.map((t, i) => (
          <tr class="text-sm">
            <td class="pr-4 pt-4 text-right">{i + 1}</td>
            <td class="pr-2 pt-4">
              <div class="">
                <div class="">
                  <div
                    class={`whitespace-nowrap text-ellipsis overflow-hidden text-base ${theme.text.default}`}
                  >
                    {t.title}
                  </div>
                  <div
                    class={`whitespace-nowrap text-ellipsis overflow-hidden ${theme.text.secondary}`}
                  >
                    {t.artist}
                  </div>
                </div>
              </div>
            </td>
            <td class="pr-2 pt-4 whitespace-nowrap text-ellipsis overflow-hidden">
              {t.album}
            </td>
            <td class="pr-2 pt-4">{t.date.toLocaleDateString()}</td>
            <td class="pr-12 pt-4 text-right">{t.duration}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

function DurationIcon() {
  return (
    <svg
      class="ml-auto"
      role="img"
      height="16"
      width="16"
      aria-hidden="true"
      viewBox="0 0 16 16"
      data-encore-id="icon"
    >
      <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z"></path>
      <path d="M8 3.25a.75.75 0 0 1 .75.75v3.25H11a.75.75 0 0 1 0 1.5H7.25V4A.75.75 0 0 1 8 3.25z"></path>
    </svg>
  );
}
