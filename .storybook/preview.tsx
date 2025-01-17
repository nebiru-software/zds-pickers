// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from 'react'
import { useState } from 'react'
import type { Preview, StoryFn, StoryContext } from '@storybook/react'
import '../stories/assets/sampleStyles.css'

const preview: Preview = {
  decorators: [
    (Story: StoryFn, context: StoryContext) => {
      const [value, setValue] = useState(context.args.value || 0)
      return (
        <div>
          <Story
            args={{
              ...context.args,
              value,
              onChange: setValue,
            }}
          />
        </div>
      )
    },
  ],
}

export default preview
