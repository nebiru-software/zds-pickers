/* eslint-disable no-param-reassign */
import produce from 'immer'
import { border } from 'polished'
import { merge } from '../../core/fp/objects'
import { curryRight } from '../../core/fp/utils'
import { textSizeR } from './mixins'
// import { links } from '.'

export const fontFamily = ['"ProximaNova"', '-apple-system', 'sans-serif'].join(', ')

export const fonts = theme => produce(theme, (draft) => {
  draft.typography = draft.typography || {}
  draft.typography.htmlFontSize = 10
  draft.typography.fontFamily = fontFamily
})

const textSizeH = curryRight(textSizeR, 300)

const text = ({ palette, mixins: { rem } }) => ({
  '&[class*="-text--xsmall"]': { fontSize: rem(1.3) },
  '&[class*="-text--small"]': { fontSize: rem(1.5) },
  '&[class*="-text--medium"]': { fontSize: rem(1.7) },
  '&[class*="-text--large"]': { fontSize: rem(1.9) },

  '&[class*="--caps"]': { textTransform: 'uppercase' },
  '&[class*="--bold"]': { fontWeight: 600 },
  '&[class*="--gutterTop"]': { marginTop: rem(1.5) },
  '&[class*="--short"]': { marginBottom: rem(1) },
  '&[class*="--tall"]': { paddingBottom: rem(1.2) },

  '&[class*="-text--accent"]': { color: palette.accent },
  '&[class*="-text--accentDark"]': { color: palette.accentDark },
  '&[class*="-text--capitalize"]': { textTransform: 'capitalize' },
  '&[class*="-text--condensed"]': { display: 'block', lineHeight: 1.3 },
  '&[class*="-text--disclaimer"]': { fontSize: rem(1.5), color: palette.ribbon },
  '&[class*="-text--failure"]': { color: palette.common.red },
  '&[class*="-text--light"]': { color: palette.ribbon },
  '&[class*="-text--lower"]': { textTransform: 'lowercase' },
  '&[class*="-text--success"]': { color: palette.common.green },
  '&[class*="-text--upper"]': { textTransform: 'uppercase' },
  '&[class*="-text--white"]': { color: palette.common.white },

  '&[class*="--weight-100"]': { fontWeight: 100 },
  '&[class*="--weight-200"]': { fontWeight: 200 },
  '&[class*="--weight-300"]': { fontWeight: 300 },
  '&[class*="--weight-400"]': { fontWeight: 400 },
  '&[class*="--weight-500"]': { fontWeight: 500 },
  '&[class*="--weight-600"]': { fontWeight: 600 },
  '&[class*="--weight-700"]': { fontWeight: 700 },
})

const headlines = ({
  breakpoints,
  palette,
  mixins: { em, marginR, paddingEm, percentage, rem, resetList, transition, when },
}) => ({
  '&[class*="-headline--xxsmall"]': textSizeH(1.3, 1.6),
  '&[class*="-headline--xsmall"]': textSizeH(1.4, 1.8),
  '&[class*="-headline--small"]': textSizeH(1.7, 1.8),
  '&[class*="-headline--medium"]': textSizeH(1.9, 2.2),
  '&[class*="-headline--large"]': textSizeH(2.4, 2.7),
  '&[class*="-headline--xlarge"]': textSizeH(2.6, 3.1),
  '&[class*="-headline--xxlarge"]': textSizeH(2.8, 3.2),
  '&[class*="-headline--xxxlarge"]': {
    fontSize: rem(4),
    lineHeight: 1,
    [breakpoints.up('md')]: {
      fontSize: rem(6),
    },
  },

  '&[class*="-headline--details"]': {
    ...resetList(true, false),
    '& li': {
      fontSize: rem(1.5),
      color: palette.common.grey,
    },
  },
  '&[class*="-headline--description"]': {
    fontSize: 'initial',
    fontStyle: 'italic',
  },
  '&[class*="-headline--equalSpacing"]': marginR(2, null),
  '&[class*="--extq"]': {
    marginBottom: rem(0.5),
    '& p': {
      display: 'inline-block',
      margin: 0,
    },
  },
  '&[class*="-headline--flex"]': {
    display: 'flex',
    alignItems: 'center',
    '& *': {
      '&:first-child': {
        flex: 1,
      },
    },
    '& .switch__body': {
      fontSize: rem(1.7),
    },
  },
  '&[class*="-headline--headline"]': { marginBottom: rem(3) },
  '&[class*="-headline--hr"]': {
    ...border('bottom', 1, 'solid', palette.border),
    marginBottom: rem(2),
    paddingBottom: rem(1.2),
  },
  '&[class*="-headline--label"]': { marginBottom: rem(4) },
  '&[class*="-headline--noHr"]': { marginBottom: em(2) },
  '&[class*="-headline--shortHr"]': {
    ...border('bottom', 1, 'solid', palette.borderLight),
    marginBottom: 0,
    paddingBottom: rem(1.2),
  },
  '&[class*="-headline--strikethrough"]': {
    position: 'relative',
    whiteSpace: 'nowrap',
    textAlign: 'center',
    '&:before': {
      background: when(
        'usa',
        `linear-gradient(
        to right,
        ${palette.common.lightGrey} 0,
        ${palette.grey[150]} 25%,
        ${palette.grey[150]} 75%,
        ${palette.common.lightGrey} 100%
      )`,
        `linear-gradient(
          to right,
          ${palette.common.lightGrey} 0,
          ${palette.border} 25%,
          ${palette.border} 75%,
          ${palette.common.lightGrey} 100%
        )`,
      ),
      position: 'absolute',
      left: 0,
      top: em(0.5),
      width: percentage(100),
      height: 1,
      content: "''",
    },
    '& h1,h2,h3,h4,h5,span': {
      display: 'inline-block',
      ...paddingEm(0, 1),
      fontSize: 'inherit',
      fontWeight: 300,
      background: palette.common.white,
      margin: 0,
      position: 'relative',
      top: -1,
    },
    '& span': {
      fontSize: percentage(100),
      '&.no-header': {
        display: 'inline-block',
        ...paddingEm(0, 1),
        fontWeight: 300,
        background: palette.common.white,
        position: 'relative',
        top: -1,
      },
    },
  },
  '&[class*="-headline--assignmentName"]': {
    ...textSizeH(1.9, 2.2),
    ...transition('all', 150, 'ease-in-out'),

    margin: 0,
    width: percentage(80),

    [breakpoints.up('md')]: {
      ...textSizeH(2.4, 2.7),
      width: percentage(87),
    },

    [breakpoints.up('lg')]: textSizeH(2.6, 3.1),
  },
})

export default theme => produce(theme, ({ typography, globals }) => {
  const {
    mixins: { rem, important },
    // name,
    palette,
  } = theme

  const textSizeM = (size, height, weight = 300) => merge(textSizeR(size, height, weight))

  globals['.ss-typography'] = {
    ...text(theme),
    ...headlines(theme),
  }

  typography.body1 = produce(typography.body1, merge({
    fontSize: rem(1.7),
    lineHeight: 1.625,
    fontWeight: 400,
    color: palette.text.dimmer,
    textRendering: important('optimizeLegibility'),
    overflow: 'hidden',
    '-webkit-font-smoothing': 'antialiased',
    '-moz-osx-font-smoothing': 'grayscale',
  }))
  // typography.body1 = produce(typography.body1, merge(links({ name, palette })))

  typography.body2 = produce(typography.body2, merge({
    fontSize: rem(1.5),
    lineHeight: 1.625,
  }))

  typography.h1 = produce(typography.h1, textSizeM(2.8, 3.2))
  typography.h2 = produce(typography.h2, textSizeM(2.6, 3.1))
  typography.h3 = produce(typography.h3, textSizeM(1.9, 2.2, 600))
  typography.h4 = produce(typography.h4, textSizeM(1.7, 1.8, 700))
  typography.h5 = produce(typography.h5, textSizeM(1.4, 1.8))
  typography.h6 = produce(typography.h6, textSizeM(1.3, 1.7))

  globals.h1 = textSizeM(2.8, 3.2)
  globals.h2 = textSizeM(2.6, 3.1)
  globals.h3 = textSizeM(1.9, 2.2, 600)
  globals.h4 = textSizeM(1.7, 1.8, 700)
  globals.h5 = textSizeM(1.4, 1.8)
  globals.h6 = textSizeM(1.3, 1.7)
})
