import { all } from 'redux-saga/effects'
import midiSaga from './midi'
import sysexSaga from './sysex'
import userSaga from './user'

export const PRODUCT_INSTANCE = '/Shifter Pro/productInstance'
export const PRODUCT_REGISTER = '/productInstance'

export default function* rootSaga() {
  yield all([
    midiSaga(),
    sysexSaga(),
    userSaga(),
  ])
}
