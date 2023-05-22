import type { Meta, StoryObj } from "storybook-solidjs";
import { Player } from "./player";

const meta: Meta<typeof Player> = {
  title: "Music/Player",
  component: Player,
};

export default meta;

type Story = StoryObj<typeof Player>;

export const Default: Story = {
  render: () => <Player />,
};
