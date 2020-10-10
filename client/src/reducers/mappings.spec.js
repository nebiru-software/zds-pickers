import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import deepFreeze from 'deep-freeze'
import { createUserMapping, getMapping as zdsGetMapping, getStockNames } from 'zds-mappings'
import mappings, { actions, getMapping, getNoteValue } from './mappings'
import actionTypes from './actionTypes'

const userMapping1 = 'user mapping 1'
const userMapping2 = 'user mapping 2'

const userMappings = [userMapping1]
const stockMappings = getStockNames()

// jest.mock('zds-mappings')
// const zdsMappings = require('zds-mappings')

const initialState = {
  dialogVisible: false,
  userDialogVisible: false,
  userImportDialogVisible: false,
  channels: [userMapping1, userMapping2],
  stockMappings: [...stockMappings],
  userMappings: [...userMappings],
}

deepFreeze(initialState)

describe('mappings reducer', () => {
  beforeEach(() => {
    localStorage.clear()
    userMappings.map(createUserMapping)
  })

  it('getMapping', () => {
    expect(getMapping([stockMappings[0]], 0)).toEqual(zdsGetMapping(stockMappings[0]))
  })

  it('should getNoteValue', () => {
    expect(getNoteValue([stockMappings[0]], 0, 12)).toEqual({ group: '', name: '', note: 12 })
    expect(getNoteValue([stockMappings[0]], 16, 12)).toEqual(null)
  })

  it('should showShowDialog', () => {
    const dialogVisible = true
    const action = { type: actionTypes.SHOW_MAPPINGS_DLG, dialogVisible }
    const nextState = mappings(initialState, action)
    expect(nextState).toEqual({ ...initialState, dialogVisible })
  })

  it('should showShowUserDialog', () => {
    const userDialogVisible = true
    const action = { type: actionTypes.SHOW_USER_MAPPINGS_DIALOG, userDialogVisible }
    const nextState = mappings(initialState, action)
    expect(nextState).toEqual({ ...initialState, userDialogVisible })
  })

  it('should handle a mapping being selected', () => {
    const channel = 1
    const mappingName = 'new mapping name'
    const action = { type: actionTypes.MAPPING_CHANGED, channel, mappingName }
    const nextState = mappings(initialState, action)
    expect(nextState).toEqual({ ...initialState, channels: [userMapping1, mappingName] })
  })

  xdescribe('actions', () => {
    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)

    const store = mockStore({})

    beforeEach(() => store.clearActions())

    it('showMappingsDialog', () => {
      expect(actions.showMappingsDialog()).toEqual({ type: actions.SHOW_MAPPINGS_DLG, dialogVisible: true })
    })

    it('hideMappingsDialog', () => {
      expect(actions.hideMappingsDialog()).toEqual({ type: actions.SHOW_MAPPINGS_DLG, dialogVisible: false })
    })

    it('changeMapping', () => {
      const channel = 7
      const mappingName = 'mapping name'
      expect(actions.changeMapping(channel, mappingName)).toEqual({
        type: actions.MAPPING_CHANGED,
        channel,
        mappingName,
      })
    })

    it('showUserMappingsDialog', () => {
      expect(actions.showUserMappingsDialog()).toEqual({
        type: actions.SHOW_USER_MAPPINGS_DIALOG,
        userDialogVisible: true,
      })
    })

    it('hideUserMappingsDialog', () => {
      expect(actions.hideUserMappingsDialog()).toEqual({
        type: actions.SHOW_USER_MAPPINGS_DIALOG,
        userDialogVisible: false,
      })
    })

    xit('importMapping', () => {
      // const name = 'mapping name'
      // const contents = 'contents'
      // store.dispatch(actions.importMapping(name, contents))
      // expect(store.getActions()).toEqual([{ type: actions.IMPORT_MAPPING, name }])
      // store.clearActions()
      // zdsMappings.storeMapping = jest.fn(() => {
      //   throw new Error('mocked exception')
      // })
      // store.dispatch(actions.importMapping(name, contents))
      // expect(store.getActions()).toEqual([
      //   {
      //     type: actions.REPORT_ERROR,
      //     errorMessage: 'Unable to import.  Not a valid ZenEdit map file.',
      //   },
      // ])
    })

    xit('deleteMapping', () => {
      const name = 'mapping name'
      store.dispatch(actions.deleteMapping(name))
      expect(store.getActions()).toEqual([{ type: actions.DELETE_MAPPING, name }])
    })
  })
})
