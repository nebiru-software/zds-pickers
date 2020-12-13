import { success } from 'sagas/utils'
import { createReducer } from './utils'
import actionTypes from './actionTypes'

const defaultState = {
  serialNumber: '',
  firstName: '',
  lastName: '',
  email: '',
  checkedRegistration: false,
  registered: false,
}

const receivedVersion = (state, { serialNumber }) => ({
  ...state,
  serialNumber,
})

const checkedRegistration = (state, { response: { registrations } }) => {
  const newState = { ...state, checkedRegistration: true }
  const A = registrations.filter(entry => entry.active)

  newState.registered = A.length === 1

  if (newState.registered) {
    const { email, firstName, lastName } = A[0]
    return { ...newState, firstName, lastName, email }
  }
  return newState
}

export default createReducer(defaultState, {
  [actionTypes.RECEIVED_VERSION]: receivedVersion,
  [success(actionTypes.RECEIVED_VERSION)]: checkedRegistration,
  [success(actionTypes.REGISTER_DEVICE)]: checkedRegistration,
})
