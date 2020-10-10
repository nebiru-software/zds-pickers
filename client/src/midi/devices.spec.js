import configureMockStore from 'redux-mock-store'
import { deviceStore, devicesChanged, shifterAttached, shifterInputId, shifterOutputId } from './devices'

const mockStore = configureMockStore([])

describe('devices', () => {
  const fakeInputDeviceConnected = {
    type: 'input',
    name: 'Fake Device',
    state: 'connected',
    id: 1,
  }

  const fakeOutputDeviceConnected = {
    type: 'output',
    name: 'Fake Device',
    state: 'connected',
    id: 2,
  }

  const fakeInputDeviceDisconnected = {
    type: 'input',
    name: 'Fake Device',
    state: 'disconnected',
    id: 3,
  }

  const fakeOutputDeviceDisconnected = {
    type: 'output',
    name: 'Fake Device',
    state: 'disconnected',
    id: 4,
  }

  const shifterInputConnected = {
    type: 'input',
    name: 'ZDS Shifter',
    state: 'connected',
    id: 5,
  }

  const shifterOutputConnected = {
    type: 'output',
    name: 'ZDS Shifter',
    state: 'connected',
    id: 6,
  }

  const shifterInputDisconnected = {
    type: 'input',
    name: 'ZDS Shifter',
    state: 'disconnected',
    id: 7,
  }

  const shifterOutputDisconnected = {
    type: 'output',
    name: 'ZDS Shifter',
    state: 'disconnected',
    id: 8,
  }

  describe('shifter ids', () => {
    beforeEach(() => {
      const store = mockStore({
        midi: { devices: [shifterInputConnected, shifterOutputConnected] },
      })
      deviceStore(store)
      devicesChanged()
    })

    it('shifterInputId', () => {
      expect(shifterInputId()).toBe(shifterInputConnected.id)
    })

    it('shifterOutputId', () => {
      expect(shifterOutputId()).toBe(shifterOutputConnected.id)
    })
  })

  it('shifterAttached 1', () => {
    deviceStore(mockStore({
      midi: { devices: [shifterInputConnected, shifterOutputConnected] },
    }))
    devicesChanged()

    expect(shifterAttached()).toBeTruthy()
  })

  it('shifterAttached 2', () => {
    deviceStore(mockStore({
      midi: { devices: [shifterInputConnected, shifterOutputDisconnected] },
    }))
    devicesChanged()

    expect(shifterAttached()).toBeFalsy()
  })

  it('shifterAttached 3', () => {
    deviceStore(mockStore({
      midi: {
        devices: [fakeInputDeviceConnected, shifterInputConnected, fakeOutputDeviceConnected, shifterOutputConnected],
      },
    }))
    devicesChanged()

    expect(shifterAttached()).toBeTruthy()
  })

  it('shifterAttached 4', () => {
    deviceStore(mockStore({
      midi: {
        devices: [
          fakeInputDeviceDisconnected,
          shifterInputConnected,
          fakeOutputDeviceDisconnected,
          shifterOutputConnected,
        ],
      },
    }))
    devicesChanged()

    expect(shifterAttached()).toBeTruthy()
  })

  it('shifterAttached 5', () => {
    deviceStore(mockStore({
      midi: {
        devices: [
          fakeInputDeviceDisconnected,
          shifterInputDisconnected,
          fakeOutputDeviceDisconnected,
          shifterOutputConnected,
        ],
      },
    }))
    devicesChanged()

    expect(shifterAttached()).toBeFalsy()
  })
})
