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
    // Merge — replacing whole config sections here wipes out Storybook's own
    // vite settings (e.g. its optimizeDeps include list, without which the
    // dev server hands raw CJS react-dom to the browser: "Can't find
    // variable: require").
    return {
      ...config,
      css: {
        ...config.css,
        postcss: {},
        modules: {
          localsConvention: 'camelCase',
        },
      },
    }
  },
}

export default config
