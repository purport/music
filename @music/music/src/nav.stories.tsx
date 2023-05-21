import type { Meta, StoryObj } from "storybook-solidjs";
import { Nav } from "./nav";

const meta: Meta<typeof Nav> = {
  title: "Music/Nav",
  component: Nav,
};

export default meta;

type Story = StoryObj<typeof Nav>;

export const Default: Story = {
  render: () => <Nav />,
};
