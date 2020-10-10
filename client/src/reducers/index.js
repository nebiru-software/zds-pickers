import { combineReducers } from 'redux'
import { reducer as midi } from 'redux-midi-fork'
import { reducer as form } from 'redux-form'
import hardwareTest from './hardwareTest'
import inputControls from './inputControls'
import mappings from './mappings'
import shifter from './shifter'
import shiftGroups from './shiftGroups'
import user from './user'
import version from './version'

const reducers = {
  form,
  hardwareTest,
  inputControls,
  mappings,
  midi,
  shifter,
  shiftGroups,
  user,
  version,
}

export default combineReducers(reducers)
