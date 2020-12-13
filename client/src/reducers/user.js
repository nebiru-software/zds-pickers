import { submit } from 'redux-form'
import { PRODUCT_REGISTER, success } from 'sagas/utils'
import { createReducer } from './utils'
import actionTypes from './actionTypes'

const deviceRegistered = productInstance => ({
  type: actionTypes.DEVICE_REGISTERED,
  productInstance,
})

const hideDialog = () => ({
  type: actionTypes.HIDE_REGISTRATION_DLG,
})

export const actions = {
  deviceRegistered,

  showDialog: () => ({
    type: actionTypes.SHOW_REGISTRATION_DLG,
  }),

  hideDialog,

  submitRegistrationForm: () => (dispatch) => {
    dispatch(submit('userRegistrationForm'))
  },

  submitRegistration: form => (dispatch) => {
    const { email, firstName, lastName, serialNumber } = form
    const registration = { firstName, lastName, email }

    return fetch(`${PRODUCT_REGISTER}/${serialNumber}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registration),
    })
      .then(response => response.json())
      .then(newRegistration => dispatch(deviceRegistered(newRegistration)))
      .then(() => dispatch(hideDialog()))
  },
}

const defaultState = {
  serialNumber: '',
  firstName: '',
  lastName: '',
  email: '',
  checkedRegistration: false,
  registered: false,
  dialogVisible: false,
}

const receivedVersion = (state, { serialNumber }) => ({
  ...state,
  serialNumber,
})

const toggleDialog = dialogVisible => state => ({
  ...state,
  dialogVisible,
})

const checkedRegistration = (state, { response: { registrations } }) => {
  const newState = { ...state, checkedRegistration: true }
  const A = registrations.filter(entry => entry.active)

  newState.registered = A.length === 1

  if (newState.registered) {
    const { email, firstName, lastName } = A[0]
    return { ...newState, firstName, lastName, email }
  }
  return { ...newState, dialogVisible: true }
}

const handleShifterUnplugged = state => ({
  ...state,
  dialogVisible: false,
})

export default createReducer(defaultState, {
  [actionTypes.RECEIVED_VERSION]: receivedVersion,
  [success(actionTypes.RECEIVED_VERSION)]: checkedRegistration,
  [actionTypes.DEVICE_REGISTERED]: checkedRegistration,
  [actionTypes.SHOW_REGISTRATION_DLG]: toggleDialog(true),
  [actionTypes.HIDE_REGISTRATION_DLG]: toggleDialog(false),
  [actionTypes.SHIFTER_MISSING]: handleShifterUnplugged,
})
