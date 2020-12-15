import withStyles from '@material-ui/core/styles/withStyles'
import zdsPickers from './zdsPickers'
// import elements from './elements'
// import forms from './forms'
// import a11y from './a11y'
// import misc from './misc'
// import printing from './printing'

export default withStyles((theme) => {
  const {
    breakpoints,
    // globals,
    mixins: { px },
    palette,
    // thirdParty,
  } = theme

  return {
    '@global': {
      html: {
        textRendering: 'optimizeLegibility',
        overflowY: 'scroll',
        fontSize: 8.5,
        lineHeight: px(8.5),
        [breakpoints.up('sm')]: {
          fontSize: 9.5,
          lineHeight: px(9.5),
        },
        [breakpoints.up('md')]: {
          fontSize: 10,
          lineHeight: px(10),
        },
      },
      body: {
        '& *:focus': {
          outlineStyle: 'none',
        },
        background: palette.background.default,
      },
      // section: {
      //   paddingTop: rem(4),
      //   paddingBottom: rem(4),
      // },
      '#react-container': {
        minHeight: '100vh',
      },
      // ...a11y(theme),
      // ...elements(theme),
      // ...forms(theme),
      // ...misc(theme),
      // ...printing(theme),
      // ...globals,
      // ...thirdParty,
      ...zdsPickers(theme),
    },
  }
}, { name: 'CssGlobals' })(() => null)
