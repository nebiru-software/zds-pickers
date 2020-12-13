import actionTypes from 'reducers/actionTypes'

export const success = actionType => `${actionType}_SUCCESS`
export const failure = actionType => `${actionType}_FAILURE`

export const PRODUCT_INSTANCE = '/Shifter Pro/productInstance'
export const PRODUCT_REGISTER = '/productInstance'

export const apiCall = payload => ({
  type: actionTypes.CALL_API,
  ...payload,
})
