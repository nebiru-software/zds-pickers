import actionTypes from '../reducers/actionTypes'

export const success = actionType => `${actionType}_SUCCESS`
export const failure = actionType => `${actionType}_FAILURE`

export const apiCall = payload => ({
  type: actionTypes.CALL_API,
  ...payload,
})
