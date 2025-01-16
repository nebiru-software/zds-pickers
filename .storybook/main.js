module.exports = {
  stories: ['../stories/*.stories.ts'],

  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],

  framework: '@storybook/react-vite',

  core: {
    disableTelemetry: true,
    core: {
      builder: '@storybook/builder-vite',
    },
  },

  docs: {
    autodocs: false,
  },

  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
}
