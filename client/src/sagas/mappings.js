import { call, put, takeLatest } from 'redux-saga/effects'
import { removeMapping, storeMapping } from 'zds-mappings'
import actionTypes from 'reducers/actionTypes'
import { success } from './utils'

const actionSuccess = action => ({
  ...action,
  type: success(action.type),
})

function* handleDeleteMapping(action) {
  yield call(removeMapping, action.name)
  yield put(actionSuccess(action))
}

function* handleImportMapping(action) {
  try {
    yield call(storeMapping, action.name, action.contents)
    yield put(actionSuccess(action))
  } catch (E) {
    yield put({
      type: actionTypes.ERROR_OCCURRED,
      message: 'Unable to import.  Not a valid ZenEdit map file.',
    })
  }
}

export default function* mappingsSaga() {
  yield takeLatest(actionTypes.DELETE_MAPPING, handleDeleteMapping)
  yield takeLatest(actionTypes.IMPORT_MAPPING, handleImportMapping)
}
