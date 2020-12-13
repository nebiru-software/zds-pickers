import { hot } from 'react-hot-loader'
// eslint-disable-next-line @studysync/material-ui/tree-shakeable-imports
import { MuiThemeProvider as ThemeProvider } from '@material-ui/core/styles'
import BrowserDetection from 'react-browser-detection'
import { Titled } from 'react-titled'
import Favicon from 'react-favicon'
import CssBaseline from '@material-ui/core/CssBaseline'
import makeStyles from '@material-ui/core/styles/makeStyles'
import theme from '../styles/theme'
import FavIconUrl from '../images/favicon.ico'
import CssGlobals from '../styles/theme/CssGlobals'
import MainInterface from './views/MainInterface'
import UnsupportedBrowser from './views/UnsupportedBrowser'

const useStyles = makeStyles(() => ({
  root: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexFlow: 'column nowrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
}), { name: 'App' })

const browserHandler = {
  chrome: () => <MainInterface />,
  'android-chrome': () => <MainInterface />,
  opera: () => <MainInterface />,
  android: () => <UnsupportedBrowser />,
  default: () => <UnsupportedBrowser />,
}

const App = () => {
  const classes = useStyles()
  // console.log(theme({}))

  return (
    <ThemeProvider theme={theme({})}>
      <Titled title={() => 'ZDS Shifter Pro'} />
      <Favicon url={FavIconUrl} />
      <CssBaseline />
      <CssGlobals />
      <div className={classes.root}>
        <BrowserDetection>{browserHandler}</BrowserDetection>
      </div>
    </ThemeProvider>
  )
}

export default hot(module)(App)
