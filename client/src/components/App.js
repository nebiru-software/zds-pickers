import React from 'react'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import BrowserDetection from 'react-browser-detection'
import { Titled } from 'react-titled'
import { app } from '../styles/app.scss'
import muiTheme from '../styles/muiTheme'
import MainInterface from './views/MainInterface'
import UnsupportedBrowser from './views/UnsupportedBrowser'

const browserHandler = {
  chrome: () => <MainInterface />,
  'android-chrome': () => <MainInterface />,
  opera: () => <MainInterface />,
  android: () => <UnsupportedBrowser />,
  default: () => <UnsupportedBrowser />,
}

const App = () => (
  <MuiThemeProvider theme={muiTheme}>
    <Titled title={() => 'ZDS Shifter - Client Interface'} />
    <div className={app}>
      <BrowserDetection>{browserHandler}</BrowserDetection>
    </div>
  </MuiThemeProvider>
)

export default App
