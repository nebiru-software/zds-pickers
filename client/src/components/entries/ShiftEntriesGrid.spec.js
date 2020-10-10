import React from 'react'
// import flow from 'lodash/fp/flow'
import set from 'lodash/fp/set'
import { SORT_ASC, SORT_BY_CHANNEL, SORT_ON_INPUT } from '../../reducers/shiftGroup'
import { group } from '../../../__mocks__/shiftGroups'
import ShiftEntriesGrid from './ShiftEntriesGrid'

const { entries } = group
const groupId = 3
const editEntry = jest.fn()
const removeEntry = jest.fn()
const selectShiftEntry = jest.fn()
const selectAllEntries = jest.fn()
const clearAllSelections = jest.fn()
const handleEntryClick = jest.fn()
const saveEntryEdit = jest.fn()

const props = {
  groupId,
  editEntry,
  removeEntry,
  selectShiftEntry,
  entries,
  disabled: false,
  selectAllEntries,
  clearAllSelections,
  handleEntryClick,
  saveEntryEdit,
  sortOn: SORT_ON_INPUT,
  sortBy: SORT_BY_CHANNEL,
  sortDir: SORT_ASC,
  mappings: { channels: [] },
  selectedRows: [],
}

describe('ShiftEntriesGrid tests', () => {
  const stopPropagation = jest.fn()
  const preventDefault = jest.fn()
  const idx = 2
  const entryId = 3

  beforeEach(jest.clearAllMocks)

  it('renders correctly', () => {
    shallowExpect(ShiftEntriesGrid)(props).toMatchSnapshot()
  })

  it('clicking a row should handle register', () => {
    const event = { metaKey: false, shiftKey: true, stopPropagation }
    mount(<ShiftEntriesGrid {...props} />)
      .find('DragSource(GridRow)')
      .filter('[idx=2]')
      .instance()
      .props.clickHandler(event, idx, entryId)

    expect(stopPropagation).toHaveBeenCalled()
    expect(handleEntryClick).toHaveBeenCalledWith(groupId, [0, 1, 2, 3], idx, false, true)
  })

  it('clicking a row should handle selection', () => {
    const event = { metaKey: false, shiftKey: true, stopPropagation }
    mount(<ShiftEntriesGrid {...props} />)
      .find('DragSource(GridRow)')
      .filter('[idx=2]')
      .instance()
      .props.clickHandler(set('shiftKey', false)(event), idx, entryId)

    expect(stopPropagation).not.toHaveBeenCalled()
    expect(selectShiftEntry).toHaveBeenCalledWith(groupId, entryId)
  })

  it('pressing escape should clear all selections', () => {
    const event = {
      preventDefault,
      key: 'Escape',
      metaKey: false,
    }
    shallow(<ShiftEntriesGrid {...props} />).simulate('keydown', event)
    expect(preventDefault).not.toHaveBeenCalled()
    expect(clearAllSelections).toHaveBeenCalledWith(groupId)
  })

  it('CMD+A should select all rows', () => {
    const event = {
      preventDefault,
      key: 'a',
      metaKey: true,
    }
    shallow(<ShiftEntriesGrid {...props} />).simulate('keydown', event)
    expect(preventDefault).toHaveBeenCalled()
    expect(selectAllEntries).toHaveBeenCalledWith(groupId)
  })

  it('pressing up arrow should select the next row up', () => {
    const event = {
      preventDefault,
      key: 'ArrowUp',
      metaKey: false,
    }
    shallow(<ShiftEntriesGrid {...props} />).simulate('keydown', event)
    expect(preventDefault).not.toHaveBeenCalled()
    expect(selectShiftEntry).toHaveBeenCalledWith(groupId, 0)
  })

  it('pressing down arrow should select the next row up', () => {
    const event = {
      preventDefault,
      key: 'ArrowDown',
      metaKey: false,
    }
    shallow(<ShiftEntriesGrid {...props} />).simulate('keydown', event)
    expect(preventDefault).not.toHaveBeenCalled()
    expect(selectShiftEntry).toHaveBeenCalledWith(groupId, 0)
  })

  it('pressing enter when there are no selections should do nothing', () => {
    const event = {
      preventDefault,
      key: 'Enter',
      metaKey: true,
    }
    shallow(<ShiftEntriesGrid {...props} />).simulate('keydown', event)
    expect(editEntry).not.toHaveBeenCalled()
  })

  it('pressing enter when there is a selection should edit it', () => {
    const event = {
      preventDefault,
      key: 'Enter',
      metaKey: true,
    }
    shallow(<ShiftEntriesGrid
      {...props}
      selectedRows={[1]}
    />).simulate('keydown', event)
    expect(editEntry).toHaveBeenCalledWith(groupId, 1)
  })

  it('handleArrowKey should select the first row if none are selected', () => {
    const event = {
      preventDefault,
      key: 'ArrowUp',
      metaKey: true,
    }
    shallow(<ShiftEntriesGrid
      {...props}
      selectedRows={[]}
    />).simulate('keydown', event)
    expect(selectShiftEntry).toHaveBeenCalledWith(groupId, 0)
  })

  it('handleArrowKey should do nothing if none are selected and there are no rows', () => {
    const event = {
      preventDefault,
      key: 'ArrowUp',
      metaKey: true,
    }
    shallow(<ShiftEntriesGrid
      {...props}
      entries={[]}
      selectedRows={[]}
    />).simulate('keydown', event)
    expect(selectShiftEntry).not.toHaveBeenCalled()
  })

  it('handleArrowKey should select the next row if one is already selected', () => {
    const event = {
      preventDefault,
      key: 'ArrowDown',
      metaKey: true,
    }
    shallow(<ShiftEntriesGrid
      {...props}
      selectedRows={[1]}
    />).simulate('keydown', event)
    expect(selectShiftEntry).toHaveBeenCalledWith(groupId, 2)
  })

  it('handleArrowKey should do nothing if the next row is already the selected one', () => {
    const event = {
      preventDefault,
      key: 'ArrowUp',
      metaKey: true,
    }
    shallow(<ShiftEntriesGrid
      {...props}
      selectedRows={[0]}
    />).simulate('keydown', event)
    expect(selectShiftEntry).not.toHaveBeenCalled()
  })

  it('handleDraggedFrom should work', () => {
    const sourceGroupId = groupId
    const destGroupId = 3
    const callProps = {
      sourceGroupId,
      destGroupId,
      selectedRows: [0],
      copy: true,
    }
    mount(<ShiftEntriesGrid {...props} />)
      .find('DragSource(GridRow)')
      .filter('[idx=2]')
      .instance()
      .props.handleDraggedFrom(callProps)

    expect(saveEntryEdit).toHaveBeenCalledWith(destGroupId, {
      entryId: -1,
      input: entries[0].input,
      output: entries[0].output,
    })
    expect(removeEntry).not.toHaveBeenCalled()

    jest.resetAllMocks()

    mount(<ShiftEntriesGrid {...props} />)
      .find('DragSource(GridRow)')
      .filter('[idx=2]')
      .instance()
      .props.handleDraggedFrom(set('copy', false)(callProps))

    expect(saveEntryEdit).toHaveBeenCalledWith(destGroupId, {
      entryId: -1,
      input: entries[0].input,
      output: entries[0].output,
    })
    expect(removeEntry).toHaveBeenCalledWith(sourceGroupId, entries[0].entryId)
  })
})
