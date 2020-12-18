import { all } from 'redux-saga/effects'
import mappingsSaga from './mappings'
import midiSaga from './midi'
import sysexSaga from './sysex'
import userSaga from './user'

export default function* rootSaga() {
  yield all([
    mappingsSaga(),
    midiSaga(),
    sysexSaga(),
    userSaga(),
  ])
}
