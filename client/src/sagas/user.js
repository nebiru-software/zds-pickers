import { call, takeLatest } from 'redux-saga/effects'
import actionTypes from 'reducers/actionTypes'
import { callApi } from './api'
import { PRODUCT_INSTANCE } from './utils'

function* handleReceivedVersion(action) {
  const { firmware, serialNumber } = action

  yield call(callApi, {
    action,
    url: `${PRODUCT_INSTANCE}/${serialNumber}?v=${firmware}`,
  })
}

export default function* userSaga() {
  yield takeLatest(actionTypes.RECEIVED_VERSION, handleReceivedVersion)
}
