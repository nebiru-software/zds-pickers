import { getMapping as zdsGetMapping, getStockNames, getUserMappingNames } from 'zds-mappings'
import { removeMapping, storeMapping } from 'zds-mappings/dist/userMappings'
import { arraySequence } from '../core/fp/arrays'
import { getSetting } from '../core/utils'
import { createReducer } from './utils'
import actionTypes from './actionTypes'

const defaultState = {
  dialogVisible: false,
  userDialogVisible: false,
  userImportDialogVisible: false,
  channels: getSetting(
    'channel_mappings',
    arraySequence(16) //
      .map(idx => (idx === 9 ? 'General MIDI' : null)),
  ),
  stockMappings: getStockNames().sort(),
  userMappings: getUserMappingNames().sort(),
}

export const actions = {
  showMappingsDialog: () => ({
    type: actionTypes.SHOW_MAPPINGS_DLG,
    dialogVisible: true,
  }),

  hideMappingsDialog: () => ({
    type: actionTypes.SHOW_MAPPINGS_DLG,
    dialogVisible: false,
  }),

  changeMapping: (channel, mappingName) => ({
    type: actionTypes.MAPPING_CHANGED,
    channel,
    mappingName,
  }),

  showUserMappingsDialog: () => ({
    type: actionTypes.SHOW_USER_MAPPINGS_DIALOG,
    userDialogVisible: true,
  }),

  hideUserMappingsDialog: () => ({
    type: actionTypes.SHOW_USER_MAPPINGS_DIALOG,
    userDialogVisible: false,
  }),

  importMapping: (name, contents) => (dispatch) => {
    try {
      storeMapping(name, contents)
    } catch (E) {
      dispatch({
        type: actionTypes.REPORT_ERROR,
        errorMessage: 'Unable to import.  Not a valid ZenEdit map file.',
      })
      return
    }

    dispatch({ type: actionTypes.IMPORT_MAPPING, name })
  },

  deleteMapping: name => (dispatch) => {
    removeMapping(name)

    dispatch({ type: actionTypes.DELETE_MAPPING, name })
  },
}

const handleShowDialog = (state, { dialogVisible }) => ({ ...state, dialogVisible })
const handleShowUserDialog = (state, { userDialogVisible }) => ({ ...state, userDialogVisible })

const handleMappingSelected = (state, { channel, mappingName }) => {
  const newState = {
    ...state,
    channels: state.channels.map((mapping, idx) => (idx === channel ? mappingName : mapping)),
  }
  localStorage.setItem('channel_mappings', JSON.stringify(newState.channels))
  return newState
}

/* istanbul ignore next */
const userMappingsChanged = state => ({
  ...state,
  stockMappings: getStockNames(),
  userMappings: getUserMappingNames(),
})

export const getMapping = (channels, channel) => zdsGetMapping(channels[channel])

export const getNoteValue = (channels, channel, value) => {
  const mapping = getMapping(channels, channel)
  return mapping ? mapping[value - 1] : null
}

export default createReducer(defaultState, {
  [actionTypes.SHOW_MAPPINGS_DLG]: handleShowDialog,
  [actionTypes.MAPPING_CHANGED]: handleMappingSelected,
  [actionTypes.SHOW_USER_MAPPINGS_DIALOG]: handleShowUserDialog,
  [actionTypes.IMPORT_MAPPING]: userMappingsChanged,
  [actionTypes.DELETE_MAPPING]: userMappingsChanged,
})
