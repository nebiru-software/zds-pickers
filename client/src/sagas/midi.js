import { call, cancel, delay, fork, put, select, take, takeLatest } from 'redux-saga/effects'
import isPast from 'date-fns/isPast'
import subSeconds from 'date-fns/subSeconds'
import { setListeningDevices } from 'redux-midi-fork'
import { getInputDeviceId, getOutputDeviceId } from 'selectors/midi'
import { actions, actions as shifterActions } from 'reducers/shifter'
import { actions as versionActions } from 'reducers/version'
import actionTypes from 'reducers/actionTypes'
import { doesShifterExist } from 'selectors/shifter'

function* handleReceiveDeviceList() {
  const shifterInput = yield select(getInputDeviceId)
  const shifterOutput = yield select(getOutputDeviceId)
  const shifterWasThere = yield select(doesShifterExist)

  const shifterIsThere = Boolean(shifterInput && shifterOutput)

  if (shifterWasThere && !shifterIsThere) {
    yield put(shifterActions.shifterMissing())
  }

  if (!shifterWasThere && shifterIsThere) {
    yield put(shifterActions.shifterFound())
  }
}

function* handleShifterFound() {
  const shifterInput = yield select(getInputDeviceId)
  yield put(setListeningDevices([shifterInput.id]))

  yield put(versionActions.checkVersion())
}

function* timeoutMissingShifter() {
  const { endsAt, sessionActive, warningThresholdSeconds, warningVisible } = yield select(stateSession)
  const showWarningAt = yield call(subSeconds, endsAt, warningThresholdSeconds)
  let alive = true
  while (sessionActive && alive) {
    yield delay(1000) // just to keep isPast() from chugging the cpu
    alive = !isPast(showWarningAt)
  }

  if (sessionActive && !warningVisible) {
    yield put(actions.showWarning())
  }
}

function* deviceCheckFlow() {
  while (true) {
    const missingShifterTask = yield fork(timeoutMissingShifter)
    // const timeoutTask = yield fork(timeoutSession)

    yield take(/* istanbul ignore next */({ type }) => type === actionTypes.SHIFTER_FOUND)

    yield cancel(missingShifterTask)
    // yield cancel(timeoutTask)
  }
}

export default function* midiSaga() {
  yield takeLatest('redux-midi/midi/RECEIVE_DEVICE_LIST', handleReceiveDeviceList)
  yield takeLatest(actionTypes.SHIFTER_FOUND, handleShifterFound)

  // yield fork(deviceCheckFlow)
}
