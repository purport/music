import type { StorybookConfig } from "storybook-solidjs-vite";
const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    {
      name: '@storybook/addon-styling',
      options: {
        postCss: true,
      },
    },
  ],
  framework: {
    name: "storybook-solidjs-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
};
export default config;
