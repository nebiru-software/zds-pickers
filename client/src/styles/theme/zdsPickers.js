import { padding } from 'polished'

export default ({ mixins: { absWidth, borderS }, palette }) => ({
  'body .zds-pickers__container': {
    '& > span, > div': {
      display: 'inline-block',
    },
    '& > span': { maxWidth: 100 },
    '& > div': { minWidth: 300 },
  },

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

  'body .zds-pickers__menu': {
    color: palette.text.primary,

    '& .zds-pickers__menu-list': {

    },

    '& .zds-pickers__option': {

    },
  },

  'body .channel-picker': {
    '& .zds-pickers__menu': {
      maxWidth: 280,
      margin: 0,
      '& .zds-pickers__menu-list': {
        display: 'flex',
        flexFlow: 'row wrap',

        padding: 0,
      },

      '& .zds-pickers__option': {
        ...absWidth(40),
        padding: 0,
        ...borderS(palette.border),
        // display: 'flex',
        // alignContent: 'center',
        textAlign: 'center',
      },
    },
  },

})
