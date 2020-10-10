import React from 'react'
import { DragDropContext, DragDropContextProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import NoShifterFound from '../device/NoShifterFound'
import NotResponding from '../device/NotResponding'
import VersionNotSupported from '../device/VersionNotSupported'
import MidiSecurity from '../device/MidiSecurity'
import InfoPanel from '../InfoPanel'
import { mainInterface } from '../../styles/app.scss'
import HardwareTest from '../device/hardwareTest/HardwareTest'
import PrimaryNav from './PrimaryNav'

const MainInterface = () => (
  <div className={mainInterface}>
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

export default DragDropContext(HTML5Backend)(MainInterface)
