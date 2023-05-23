import { Preview } from "storybook-solidjs";
const preview: Preview = {
  globalTypes: {
    mode: {
      name: "Mode",
      description: "Color mode",
      defaultValue: "light",
      toolbar: {
        dynamicTitle: true,
        icon: "mirror",
        items: [
          { value: "light", left: "🌞", title: "Light mode" },
          { value: "dark", left: "🌛", title: "Dark mode" },
        ],
      },
    },
  },
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
  },
  decorators: [
    (Story, context) => {
      if (context.globals.mode === "light") {
        return (
          <div style="padding: 2em">
            <Story />
          </div>
        );
      } else {
        return (
          <div style="background-color: black; padding: 2em" class="dark">
            <Story />
          </div>
        );
      }
    },
  ],
};

import "../src/index.css";

export default preview;
