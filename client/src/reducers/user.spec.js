import deepFreeze from 'deep-freeze'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import storeFactory from '../store'
import productInstance from '../../__mocks__/productInstance'
import user, { actions } from './user'
import actionTypes from './actionTypes'

describe('version reducer', () => {
  const serialNumber = 'serial_number'
  const firmware = 32
  const initialState = {
    serialNumber: '',
    firstName: '',
    lastName: '',
    email: '',
    checkedRegistration: true,
    registered: false,
    dialogVisible: false,
  }
  deepFreeze(initialState)

  it('checkingVersion success', () => {
    const action = {
      type: actionTypes.GET_SYSEX_VERSION,
    }
    expect(user(initialState, action)).toEqual({
      ...initialState,
    })
  })

  it('checkedRegistration success, not registered', () => {
    const action = {
      type: actionTypes.CHECKED_REGISTRATION,
      productInstance: {
        serial: 'JIBBER_JABBER',
        lastSeen: new Date(),
        product: 'STOMPBLOCK',
        registrations: [],
      },
    }
    expect(user(initialState, action)).toEqual({
      ...initialState,
      firstName: '',
      lastName: '',
      email: '',
      registered: false,
      dialogVisible: true,
    })
  })

  it('checkedRegistration success, single registration', () => {
    const action = {
      type: actionTypes.CHECKED_REGISTRATION,
      productInstance: {
        serial: 'JIBBER_JABBER',
        lastSeen: new Date(),
        product: 'STOMPBLOCK',
        registrations: [
          {
            registered: new Date(),
            firstName: 'Mr.',
            lastName: 'User',
            email: 'email@email.com',
            active: true,
          },
        ],
      },
    }
    expect(user(initialState, action)).toEqual({
      ...initialState,
      firstName: 'Mr.',
      lastName: 'User',
      email: 'email@email.com',
      registered: true,
    })
  })

  it('checkedRegistration success, previously owned', () => {
    const action = {
      type: actionTypes.CHECKED_REGISTRATION,
      productInstance: {
        serial: 'JIBBER_JABBER',
        lastSeen: new Date(),
        product: 'STOMPBLOCK',
        registrations: [
          {
            registered: new Date(),
            firstName: 'Previous',
            lastName: 'Owner',
            email: 'owner@email.com',
            active: false,
          },
          {
            registered: new Date(),
            firstName: 'Mr.',
            lastName: 'User',
            email: 'email@email.com',
            active: true,
          },
        ],
      },
    }
    expect(user(initialState, action)).toEqual({
      ...initialState,
      firstName: 'Mr.',
      lastName: 'User',
      email: 'email@email.com',
      registered: true,
    })
  })

  it('receivedVersion success', () => {
    const action = {
      type: actionTypes.RECEIVED_VERSION,
      anvil: 33,
      serialNumber,
    }
    expect(user(initialState, action)).toEqual({
      ...initialState,
      serialNumber,
      firstName: '',
      lastName: '',
      email: '',
    })
  })

  it('toggleDialog success', () => {
    expect(user(initialState, { type: actionTypes.SHOW_REGISTRATION_DLG })).toEqual({
      ...initialState,
      dialogVisible: true,
    })

    expect(user(initialState, { type: actionTypes.HIDE_REGISTRATION_DLG })).toEqual({
      ...initialState,
      dialogVisible: false,
    })
  })

  it('handleShifterUnplugged success', () => {
    const action = { type: actionTypes.SHIFTER_MISSING }
    expect(user(
      { ...initialState, dialogVisible: true }, //
      action,
    )).toEqual(initialState)
  })

  describe('actions', () => {
    let store

    const createMockedStore = () => {
      const middlewares = [thunk]
      const mockStore = configureMockStore(middlewares)
      return mockStore({})
    }

    beforeEach(() => {
      store = storeFactory({ user }, false, true)
    })

    it('checkRegistration success', () => {
      const mockedStore = createMockedStore()

      fetch.mockResponse(JSON.stringify(productInstance))

      return mockedStore.dispatch(actions.checkRegistration(serialNumber, firmware)).then(() => {
        const expectedActions = mockedStore.getActions()
        expect(expectedActions.length).toBe(1)
        expect(expectedActions[0]).toEqual({ type: actionTypes.CHECKED_REGISTRATION, productInstance })
      })
    })

    it('deviceRegistered should succeed, when not registered to a user', () => {
      store.dispatch(actions.deviceRegistered({ registrations: [] }))

      expect(store.getState().user).toEqual({
        ...user,
        checkedRegistration: true,
        dialogVisible: true,
        registered: false,
      })
    })

    it('deviceRegistered should succeed, when registered to a non-active user', () => {
      store.dispatch(actions.deviceRegistered({
        registrations: [
          {
            firstName: 'Testy',
            lastName: 'McTesterson',
            email: '',
            active: false,
          },
        ],
      }))

      expect(store.getState().user).toEqual({
        ...user,
        checkedRegistration: true,
        dialogVisible: true,
        registered: false,
      })
    })

    it('deviceRegistered should succeed, when registered to a user', () => {
      store.dispatch(actions.deviceRegistered({
        registrations: [
          {
            firstName: 'Testy',
            lastName: 'McTesterson',
            email: '',
            active: true,
          },
        ],
      }))

      expect(store.getState().user).toEqual({
        ...user,
        checkedRegistration: true,
        registered: true,
        firstName: 'Testy',
        lastName: 'McTesterson',
        email: '',
      })
    })

    it('showDialog should succeed', () => {
      store.dispatch(actions.showDialog())

      expect(store.getState().user).toEqual({
        ...user,
        dialogVisible: true,
      })
    })

    it('hideDialog should succeed', () => {
      store.dispatch(actions.showDialog())
      store.dispatch(actions.hideDialog())

      expect(store.getState().user).toEqual({
        ...user,
        dialogVisible: false,
      })
    })

    it('submitRegistrationForm success', () => {
      const mockedStore = createMockedStore()

      mockedStore.dispatch(actions.submitRegistrationForm())

      expect(mockedStore.getActions()).toEqual([
        { meta: { form: 'userRegistrationForm' }, type: '@@redux-form/SUBMIT' },
      ])
    })

    it('calls successfully calls submitRegistration', () => {
      const mockedStore = createMockedStore()
      const form = {
        firstName: 'first',
        lastName: 'last',
        email: 'email@email.com',
      }

      fetch.mockResponse(JSON.stringify(productInstance))

      return mockedStore.dispatch(actions.submitRegistration(form)).then(() => {
        const expectedActions = mockedStore.getActions()
        expect(expectedActions.length).toBe(2)
        expect(expectedActions[0]).toEqual({ type: actionTypes.DEVICE_REGISTERED, productInstance })
        expect(expectedActions[1]).toEqual({ type: actionTypes.HIDE_REGISTRATION_DLG })
      })
    })
  })
})
