import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../stories/*.stories.tsx'],

  addons: ['@storybook/addon-links'],

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  core: {
    disableTelemetry: true,
    builder: '@storybook/builder-vite',
  },

  typescript: {
    // reactDocgen: 'react-docgen-typescript',
  },

  viteFinal(config) {
    return {
      ...config,
      optimizeDeps: {
        exclude: ['storybook-dark-mode'],
      },
      css: {
        postcss: {},
        modules: {
          localsConvention: 'camelCase',
        },
      },
    }
  },
}

export default config
