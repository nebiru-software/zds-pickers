import React from 'react'
import { DragDropContext, DragDropContextProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import makeStyles from '@material-ui/core/styles/makeStyles'
import NoShifterFound from '../device/NoShifterFound'
import NotResponding from '../device/NotResponding'
import VersionNotSupported from '../device/VersionNotSupported'
import MidiSecurity from '../device/MidiSecurity'
import InfoPanel from '../InfoPanel'
import HardwareTest from '../device/hardwareTest/HardwareTest'
import PrimaryNav from './PrimaryNav'

const useStyles = makeStyles(({ constants, palette }) => ({
  root: {
    maxWidth: constants.viewportWidth,
    minWidth: constants.viewportWidth,
    borderStyle: 'solid',
    borderColor: palette.border,
    borderWidth: '0 1px',

    // @include linearGradient(#ece9e6, white);
  },
}), { name: 'MainInterface' })

const MainInterface = () => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <DragDropContextProvider backend={HTML5Backend}>
        <PrimaryNav />
      </DragDropContextProvider>
      <HardwareTest />
      <MidiSecurity />
      <NotResponding />
      <VersionNotSupported />
      <NoShifterFound />
      <InfoPanel />
    </div>
  )
}

export default DragDropContext(HTML5Backend)(MainInterface)
