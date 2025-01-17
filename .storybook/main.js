module.exports = {
  stories: ['../stories/other.stories.ts', '../stories/picker.stories.tsx'],

  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  core: {
    disableTelemetry: true,
    builder: '@storybook/builder-vite',
  },

  docs: {
    autodocs: false,
  },

  parameters: {
    options: {
      storySort: {
        method: 'alphabetical',
      },
      // Converts camelCase to Title Case with spaces
      storyNameFormatter: name => name.replace(/([A-Z])/g, ' $1').trim(),
    },
  },

  typescript: {
    // reactDocgen: 'react-docgen-typescript',
  },

  viteFinal(config) {
    return {
      ...config,
      css: {
        postcss: {},
        modules: {
          localsConvention: 'camelCase',
        },
      },
    }
  },
}
