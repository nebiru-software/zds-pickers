module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
   // "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],

  "addons": [
    "@storybook/addon-knobs",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-mdx-gfm"
  ],

  framework: {
    name: "@storybook/react-webpack5",
    options: {}
  },

  core:{
    disableTelemetry: true,
  },

  docs: {
    autodocs: true
  }
}
