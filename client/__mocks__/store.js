import deepFreeze from 'deep-freeze'
import inputControls from './inputControls'
import mappings from './mappings'
import midi from './midi'
import shiftGroups from './shiftGroups'
import shifter from './shifter'
import user from './user'
import version from './version'

const state = { inputControls, mappings, midi, shiftGroups, shifter, user, version }

deepFreeze(state)
export default state
