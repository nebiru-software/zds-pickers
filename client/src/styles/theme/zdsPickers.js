import { padding } from 'polished'

export default ({ palette }) => ({
  'body .zds-pickers__control': {
    background: palette.accent,
    minWidth: 120,
    minHeight: 20,
    boxShadow: `inset 1px 1px ${palette.primary[400]}`,
    borderColor: palette.accentLight,

    '& div[class$="singleValue"]': {
      color: palette.text.inverted,
    },

    '& .zds-pickers__indicator-separator': {
      display: 'none',
    },

    '& .zds-pickers__dropdown-indicator': {
      ...padding(0, 4),
    },
  },

})
