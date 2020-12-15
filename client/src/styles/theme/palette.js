const primary = {
  50: '#f0e0e3',
  100: '#d8b3ba',
  200: '#bf808c',
  300: '#a54d5d',
  400: '#91263b',
  500: '#7e0018',
  600: '#760015',
  700: '#6b0011',
  800: '#61000e',
  900: '#4e0008',
  A100: '#ff8185',
  A200: '#ff4e54',
  A400: '#ff1b23',
  A700: '#ff020a',
  contrastDefaultColor: 'light',
  contrastDarkColors: ['50', '100', '200', 'A100', 'A200'],
  contrastLightColors: ['300', '400', '500', '600', '700', '800', '900', 'A400', 'A700'],
}

const accentLight = primary[500]
const accent = primary[600]
const accentDark = primary[900]

const secondaryLight = '#e4f5fc'
const secondary = '#00abe6'
const secondaryDark = '#1992c6'

const greyLight = '#f5f5f5'
const grey = '#e1e1e1'
const greyDark = '#939598'
const greyDarkest = '#4b4a4b'

const paperSecondary = greyLight

const common = {
  black: '#1c1c1c',
  blue: secondary,
  darkRed: '#dc1f41',
  green: '#92af2b',
  grey: greyDark,
  lightGrey: greyLight,
  orange: primary[700],
  purple: '#9a488e',
  red: '#da5450',
  yellow: '#ffdc19',
}

export default {
  accentLight,
  accent,
  accentDark,
  background: { default: '#ddd', paperSecondary },
  border: grey,
  borderDark: '#1C1C1C',
  borderLight: '#eee',
  checked: '#94ac3c',
  common,
  focused: '#4D90FE',
  grey: {
    100: greyLight,
    150: greyLight,
    200: grey,
    300: greyDark,
  },
  greyed: '#babbbd',
  important: common.darkRed,
  led: '#8dbdf1',
  primary,
  ribbon: greyDark,
  secondary: {
    dark: secondaryDark,
    light: secondaryLight,
    main: secondary,
  },
  selected: '#eee',
  selection: '#96d6f0',
  shadow: '#111',
  switched: '#53d76a',
  text: {
    alt: greyDark,
    dimmer: '#1c1c1c',
    greyed: '#5b616b',
    hover: primary[500],
    inverted: '#fff',
    primary: greyDarkest,
    secondary: greyDark,
    selected: greyDarkest,
  },
}
