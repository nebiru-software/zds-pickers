import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import deepFreeze from 'deep-freeze'
import { groupData, groups } from '../../__mocks__/shiftGroups'
import shiftGroups, { actions } from './shiftGroups'
import actionTypes from './actionTypes'
import { SORT_ASC, SORT_BY_ALL, SORT_ON_INPUT } from './shiftGroup'

const defaultState = {
  selectedGroupIdx: 0,
  maxEntries: 112,
  totalEntries: 0,
  groups: [],
}

describe('shiftGroups reducer', () => {
  const initialState = []
  deepFreeze(initialState)

  it('changeSelectedGroup success', () => {
    const action = {
      type: actionTypes.CHANGE_SELECTED_GROUP,
      groupId: 1,
    }
    const initial = {
      ...defaultState,
      groups: [
        {
          channel: 9,
          entries: [],
          groupId: 0,
          label: 'Group A',
          value: 110,
        },
        {
          channel: 9,
          entries: [],
          groupId: 1,
          label: 'Group B',
          value: 110,
        },
      ],
    }

    expect(shiftGroups(initial, action)).toEqual({
      ...initial,
      selectedGroupIdx: 1,
    })
  })

  it('removeEntry success', () => {
    const selectedState = {
      ...defaultState,
      totalEntries: 3,
      selectedGroupIdx: 0,
      groups: [
        {
          ...defaultState.groups[0],
          groupId: 0,
          entries: [{ entryId: 7 }, { entryId: 1 }, { entryId: 2 }],
          sortOn: SORT_ON_INPUT,
          sortBy: SORT_BY_ALL,
          sortDir: SORT_ASC,
        },
      ],
    }

    expect(shiftGroups(selectedState, {
      type: actionTypes.REMOVE_ENTRY,
      groupId: 0,
      entryId: 1,
    })).toEqual({
      ...defaultState,
      totalEntries: 2,
      groups: [
        {
          groupId: 0,
          entries: [{ entryId: 0 }, { entryId: 1 }],
          sortOn: SORT_ON_INPUT,
          sortBy: SORT_BY_ALL,
          sortDir: SORT_ASC,
          selectedEntryId: NaN,
          selectedRows: [],
        },
      ],
    })
  })

  it('handleShifterUnplugged', () => {
    expect(shiftGroups({ what: 'ever' }, { type: actionTypes.SHIFTER_MISSING })).toEqual(defaultState)
  })

  it('receivedGroups', () => {
    expect(shiftGroups(defaultState, { type: actionTypes.RECEIVED_GROUPS, groupData })).toEqual(groups)

    expect(shiftGroups(
      { ...defaultState, ...groups }, //
      { type: actionTypes.RECEIVED_GROUPS, groupData },
    )).toEqual(groups)
  })

  it('receivedInternalState', () => {
    const packet = [1, 0, 0, 1, 0, 0, 0]
    const withGroups = { ...defaultState, groups: [...groups.groups] }

    const postState = { ...withGroups }
    postState.groups[0].active = true

    expect(shiftGroups(withGroups, { type: actionTypes.RECEIVED_STATE, packet })).toEqual(postState)
  })

  it('modifyGroup should work when group is out of range', () => {
    const withGroups = { ...defaultState, groups: [...groups.groups] }

    expect(shiftGroups(withGroups, { type: actionTypes.CHANGE_GROUP_CHANNEL, groupId: 4, channel: 2 })) //
      .toEqual(withGroups)
  })

  describe('actions', () => {
    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)

    const store = mockStore({})

    beforeEach(() => store.clearActions())

    it('askForGroups success', () => {
      store.dispatch(actions.askForGroups())

      expect(store.getActions()).toEqual([{ type: actionTypes.GET_SYSEX_GROUPS }])
    })

    it('receivedGroups success', () => {
      const localGroupData = [1, 2, 3]
      store.dispatch(actions.receivedGroups(localGroupData))

      expect(store.getActions()).toEqual([{ type: actionTypes.RECEIVED_GROUPS, groupData: localGroupData }])
    })

    it('changeSelectedGroup success', () => {
      const groupId = 1
      store.dispatch(actions.changeSelectedGroup(groupId))

      expect(store.getActions()).toEqual([{ type: actionTypes.CHANGE_SELECTED_GROUP, groupId }])
    })

    it('changeGroupChannel success', () => {
      const groupId = 1
      const channel = 3
      store.dispatch(actions.changeGroupChannel(groupId, channel))

      expect(store.getActions()).toEqual([{ type: actionTypes.CHANGE_GROUP_CHANNEL, groupId, channel }])
    })

    it('changeGroupValue success', () => {
      const groupId = 1
      const value = 3
      store.dispatch(actions.changeGroupValue(groupId, value))

      expect(store.getActions()).toEqual([{ type: actionTypes.CHANGE_GROUP_VALUE, groupId, value }])
    })

    it('editEntry success', () => {
      const groupId = 1
      const editEntryIdx = 3
      store.dispatch(actions.editEntry(groupId, editEntryIdx))

      expect(store.getActions()).toEqual([{ type: actionTypes.EDIT_ENTRY, groupId, editEntryIdx }])
    })

    it('addEntry success', () => {
      const groupId = 1
      store.dispatch(actions.addEntry(groupId))

      expect(store.getActions()).toEqual([{ type: actionTypes.ADD_ENTRY, groupId }])
    })

    it('saveEntryEdit success', () => {
      const groupId = 1
      store.dispatch(actions.saveEntryEdit(groupId))

      expect(store.getActions()).toEqual([{ type: actionTypes.SAVE_ENTRY_EDIT, groupId }])
    })

    it('cancelEntryEdit success', () => {
      const groupId = 1
      store.dispatch(actions.cancelEntryEdit(groupId))

      expect(store.getActions()).toEqual([{ type: actionTypes.CANCEL_ENTRY_EDIT, groupId }])
    })

    it('removeEntry success', () => {
      const groupId = 1
      const entryId = 3
      store.dispatch(actions.removeEntry(groupId, entryId))

      expect(store.getActions()).toEqual([{ type: actionTypes.REMOVE_ENTRY, groupId, entryId }])
    })

    it('changeSort success', () => {
      const groupId = 1
      const sortOn = SORT_ON_INPUT
      const sortBy = SORT_BY_ALL
      store.dispatch(actions.changeSort(groupId, sortOn, sortBy))

      expect(store.getActions()).toEqual([{ type: actionTypes.SORT_GROUP, groupId, sortOn, sortBy }])
    })

    it('selectShiftEntry success', () => {
      const groupId = 1
      const selectedEntryId = 3
      store.dispatch(actions.selectShiftEntry(groupId, selectedEntryId))

      expect(store.getActions()).toEqual([{ type: actionTypes.SELECT_SHIFT_ENTRY, groupId, selectedEntryId }])
    })

    it('selectAllEntries', () => {
      const groupId = 23
      expect(actions.selectAllEntries(groupId)).toEqual({ type: actionTypes.SELECT_ALL_ENTRIES, groupId })
    })

    it('clearAllSelections', () => {
      const groupId = 23
      expect(actions.clearAllSelections(groupId)).toEqual({ type: actionTypes.CLEAR_ALL_SELECTIONS, groupId })
    })

    it('handleEntryClick', () => {
      const groupId = 23
      const sortedIds = [4, 2, 3, 1]
      const idx = 23
      const meta = true
      const shift = false
      expect(actions.handleEntryClick(groupId, sortedIds, idx, meta, shift)).toEqual({
        type: actionTypes.ENTRY_META_CLICKED,
        groupId,
        sortedIds,
        idx,
        meta,
        shift,
      })
    })
  })
})
