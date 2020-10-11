import { compose } from 'redux'
import produce from 'immer'
import { border, margin, padding, position, rgba, size as polishedSize, transparentize } from 'polished'
import { isObject } from '../../core/fp/objects'

const gutter = 24
const gridColumns = 12

const rem = size => size ? `${size}rem` : size
const em = size => size ? `${size}em` : size
const px = size => size ? `${size}px` : size
const important = s => `${s} !important`
const percentage = s => `${s}%`
const paddingEm = (...args) => padding(...args.map(em))
const paddingR = (...args) => padding(...args.map(rem))
const marginEm = (...args) => margin(...args.map(em))
const marginR = (...args) => margin(...args.map(rem))
const sizeR = (...args) => polishedSize(...args.map(rem))

const absHeight = height => ({
  height,
  minHeight: height,
  maxHeight: height,
})

const absWidth = width => ({
  width,
  minWidth: width,
  maxWidth: width,
})

const allImportant = (obj, recurse = true) => Object.fromEntries(Object
  .entries(obj)
  .map(([key, value]) => [
    key,
    isObject(value)
      ? recurse
        ? allImportant(value, recurse)
        : value
      : String(value).includes('!important')
        ? value
        : important(value)]))

const borderS = (color, width = 1) => border(width, 'solid', color)

const clearfix = (display = 'block') => ({
  clear: 'both',
  content: '""',
  display,
})

const ellipsis = (lineClamp = 1) => lineClamp === 1 ? {
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
} : {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: lineClamp,
  WebkitBoxOrient: 'vertical',
}

const firefox = content => ({
  '@-moz-document url-prefix()': content,
})

const fontIcon = () => ({
  fontFamily: 'ss-icons',
})

const gridColumn = (cols, display = 'block') => {
  let result = {
    // @include span-columns($cols, $display);
    width: percentage(cols / gridColumns),
    paddingLeft: gutter,
    paddingRight: gutter / 2,
    marginRight: 0,
    '& @media print': {
      float: important('left'),
    },
  }
  if (display === 'table') {
    result = {
      ...result,
      '&:first-child': {
        paddingLeft: 0,
      },
      '&:last-child': {
        paddingRight: 0,
      },
    }
  }
  return result
}

const gridRow = (display = 'block') => {
  let result = {
    // eslint-disable-next-line no-use-before-define
    ...row(),
    display,
    position: 'relative',
    marginLeft: gutter / -2,
    marginRight: gutter / -2,
    '& > *': {
      ...gridColumn(12),
    },
  }

  if (display === 'flex') {
    result = {
      ...result,
      display: 'flex',
      flexFlow: 'row wrap',
    }
  } else if (display === 'table') {
    result = {
      ...result,
      width: percentage(100),
      marginLeft: 0,
      marginRight: 0,
    }
  }
  return result
}

const hideForPrint = () => ({
  '@media print': {
    display: important('none'),
  },
})

const hideForScreen = () => ({
  '@media screen': {
    display: important('none'),
  },
})

const icon = (content, extras = true) => ({
  ...fontIcon(),
  content: `'${content}'`,
  ...extras ? {
    width: 'auto',
    margin: 0,
    fontStyle: 'normal',
    fontWeight: 'normal',
    speak: 'none',
    display: 'inline-block',
    textDecoration: 'inherit',
    lineHeight: em(1),
    textAlign: 'center',
    fontVariant: 'normal',
    textTransform: 'none',
    verticalAlign: 'middle',
    position: 'relative',
    top: -1,
    textRendering: 'optimizeLegibility',
  } : {},
})

const iconAfter = (content, extras = true, more = {}) => ({
  whiteSpace: 'nowrap',
  '&:after': {
    ...icon(content, extras),
    transition: 'all 150ms ease-in-out 0ms',
    marginLeft: rem(0.5),
    ...more,
  },
})

const importantEm = compose(important, em)

const importantRem = compose(important, rem)

const importantMarginR = (...args) => margin(...args.map(importantRem))

const importantPaddingR = (...args) => padding(...args.map(importantRem))

const importantPx = compose(important, px)

const resetList = (clearfixToo = true, marginToo = true) => ({
  ...clearfixToo ? clearfix() : {},
  ...marginToo ? { margin: 0 } : {},
  padding: 0,
  listStyle: 'none',
  '&>li, &>dd': {
    margin: 0,
  },
})

const row = () => clearfix('block')

const safari = content => ({
  '@media not all and (min-resolution:.001dpcm)': {
    '@supports (-webkit-appearance:none)': content,
  },
})

const size = (height, width = height) => ({
  ...absHeight(height),
  ...absWidth(width),
})

export const textSizeR = (fontSize, lineHeight, fontWeight = 400) => ({
  fontSize: rem(fontSize),
  lineHeight: rem(lineHeight),
  fontWeight,
})

const transition = (property = 'all', duration = 300, timing = '', delay = 0) => ({
  transition: `${property} ${duration}ms ${timing} ${delay}ms`,
})

const vertCenter = (pos = 'relative', offset = '-50%') => ({
  transform: `translateY(${offset})`,
  position: pos,
  top: '50%',
})

const vertScrollFade = (bgColor = '#fff') => ({
  position: 'relative',
  '&::after': {
    ...position('absolute', null, null, 0, 0),
    content: "''",
    width: percentage(100),
    height: em(5),
    backgroundImage: `linear-gradient( ${transparentize(1, bgColor)}, ${bgColor})`,
    pointerEvents: 'none',
  },
})

const vertScrollIndicator = (bgColor, shadowColor) => ({
  background: `
    linear-gradient(${bgColor} 30%, ${rgba(bgColor, 0)}),
    linear-gradient(${rgba(bgColor, 0)}, ${bgColor} 70%) 0 100%,
    radial-gradient(farthest-side at 50% 0, ${rgba(shadowColor, 0.2)}, ${rgba(shadowColor, 0)}),
    radial-gradient(farthest-side at 50% 100%, ${rgba(shadowColor, 0.2)}, ${rgba(shadowColor, 0)}) 0 100%`,
  backgroundRepeat: 'no-repeat',
  backgroundColor: bgColor,
  backgroundSize: '100% 40px, 100% 40px, 100% 14px, 100% 14px',
  backgroundAttachment: 'local, local, scroll, scroll',
})

const when = theme => (name, content, altContent = null) => {
  const pass = theme.name === name || name?.includes(theme.name)
  return pass ? content : altContent
}

export default theme => produce(theme, (draft) => {
  draft.mixins = {
    absHeight,
    absWidth,
    allImportant,
    borderS,
    clearfix,
    ellipsis,
    em,
    firefox,
    fontIcon,
    gridColumn,
    gridRow,
    hideForPrint,
    hideForScreen,
    icon,
    iconAfter,
    important,
    importantEm,
    importantMarginR,
    importantPaddingR,
    importantPx,
    importantRem,
    marginEm,
    marginR,
    paddingEm,
    paddingR,
    percentage,
    px,
    rem,
    resetList,
    row,
    safari,
    size,
    sizeR,
    textSizeR,
    transition,
    vertCenter,
    vertScrollFade,
    vertScrollIndicator,
    when: when(theme),
  }
})
