import { call, select, takeLatest } from 'redux-saga/effects'
import actionTypes from 'reducers/actionTypes'
import { stateUser } from 'selectors/index'
import { PRODUCT_INSTANCE, PRODUCT_REGISTER } from 'core/endpoints'
import { callApi } from './api'

function* handleReceivedVersion(action) {
  const { firmware, serialNumber } = action

  yield call(callApi, {
    action,
    url: `${PRODUCT_INSTANCE}/${serialNumber}?v=${firmware}`,
  })
}

function* handleRegisterDevice(action) {
  const { serialNumber } = yield select(stateUser)
  const { payload } = action

  yield call(callApi, {
    action,
    url: `${PRODUCT_REGISTER}/${serialNumber}`,
    options: {
      method: 'post',
      body: JSON.stringify(payload),
    },
  })
}

export default function* userSaga() {
  yield takeLatest(actionTypes.RECEIVED_VERSION, handleReceivedVersion)
  yield takeLatest(actionTypes.REGISTER_DEVICE, handleRegisterDevice)
}
