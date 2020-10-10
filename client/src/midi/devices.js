/*
We can't start with an empty device list because if the computer has no
attached devices, we'll never trigger an initial 'devicesChanged' action.
So we'll start with a non-existent device to compare against.
*/
const initialNullDevice = { id: -1 }

let storeInstance
let prevDevices = [initialNullDevice]

const findDevice = deviceName => (devices, kind) => devices
  .filter(({ type, name, state }) => type === kind && name === deviceName && state === 'connected')
  .reduce((prev, cur) => cur, undefined)

const findShifter = findDevice('ZDS Shifter')
const findTestInterface = findDevice('USB Uno MIDI Interface')

const idHash = devices => JSON.stringify(devices.map(({ id }) => id))

const deviceId = device => (device ? device.id : -1)

export const deviceStore = (store) => {
  storeInstance = store
}

export const devicesChanged = () => {
  const { midi: { devices } } = storeInstance.getState()
  const result = idHash(devices) !== idHash(prevDevices)
  if (result) {
    prevDevices = [...devices]
  }

  return result
}

export const shifterAttached = () => {
  const { midi: { devices } } = storeInstance.getState()
  return findShifter(devices, 'input') && findShifter(devices, 'output')
}
export const shifterInputId = () => deviceId(findShifter(prevDevices, 'input'))
export const shifterOutputId = () => deviceId(findShifter(prevDevices, 'output'))

export const testInterfaceAttached = () => {
  const { midi: { devices } } = storeInstance.getState()
  return findTestInterface(devices, 'input') && findTestInterface(devices, 'output')
}
export const testInterfaceInputId = () => deviceId(findTestInterface(prevDevices, 'input'))
export const testInterfaceOutputId = () => deviceId(findTestInterface(prevDevices, 'output'))
