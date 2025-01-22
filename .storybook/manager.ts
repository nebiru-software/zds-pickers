import { addons } from '@storybook/manager-api'

addons.setConfig({
  sidebar: {
    renderLabel: (item: { name: string }) => {
      return item.name
        .replace(/([A-Z])/g, ' $1')
        .trim()
        .replaceAll('Story', '')
    },
  },
})
