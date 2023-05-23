import { Meta, StoryObj } from "storybook-solidjs";
import { Track, TrackListing } from "./track-listing";

const meta: Meta = {
  title: "Music/TrackListing",
  component: TrackListing,
};

export default meta;

type Story = StoryObj<typeof TrackListing>;

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
];

export const Default: Story = {
  render: () => <TrackListing tracks={tracks} />,
};
