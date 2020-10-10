import { setListeningDevices } from 'redux-midi-fork'
import { version } from '../../package.json'
import { actions as shifterActions } from '../reducers/shifter'
import {
  deviceStore,
  devicesChanged,
  shifterAttached,
  shifterInputId,
  testInterfaceAttached,
  testInterfaceInputId,
} from './devices'

export const SHIFTER_DEVICE_ID = 0x6c
export const SHIFTER_CC_MESSAGE = 110

// Takes a version string in the form "4.7.0" and reduces it to 47 (format the hardware uses)
export const CURRENT_CLIENT_VERSION = version
  .split('.')
  .map(s => parseInt(s, 10))
  .slice(0, 2)
  .reverse()
  .map((v, i) => v * 10 ** i) // eslint-disable-line
  .reduce((acc, v) => acc + v, 0)

export const MASK_LATCHING = 1 // 00000001
export const MASK_POLARITY = 2 // 00000010
export const MASK_CURVE = 28 // 00011100

let waitForVersionTimer

export const watchForDeviceChange = (store) => {
  deviceStore(store)
  let initialDeviceCheck = true
  const listeningDevices = []

  store.subscribe(() => {
    if (devicesChanged()) {
      /* istanbul ignore next */
      if (shifterAttached()) {
        clearTimeout(waitForVersionTimer)
        listeningDevices.push(shifterInputId())
        store.dispatch(shifterActions.shifterFound())
      } else {
        waitForVersionTimer = setTimeout(() => {
          if (!shifterAttached()) {
            store.dispatch(shifterActions.shifterMissing())
          }
        }, 2000)
      }

      if (testInterfaceAttached()) {
        listeningDevices.push(testInterfaceInputId())
        store.dispatch(shifterActions.testInterfaceFound())
      } else {
        store.dispatch(shifterActions.testInterfaceMissing())
      }

      if (listeningDevices.length) {
        store.dispatch(setListeningDevices(listeningDevices))
      }

      /* istanbul ignore next */
      if (initialDeviceCheck) {
        initialDeviceCheck = false
        store.dispatch(shifterActions.searchedForShifter())
      }
    }
  })
}
