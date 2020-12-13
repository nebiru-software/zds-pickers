import { all } from 'redux-saga/effects'
import midiSaga from './midi'
import sysexSaga from './sysex'
import userSaga from './user'

export default function* rootSaga() {
  yield all([
    midiSaga(),
    sysexSaga(),
    userSaga(),
  ])
}
