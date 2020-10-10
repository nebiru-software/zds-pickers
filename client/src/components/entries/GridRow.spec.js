import React from 'react'
import flow from 'lodash/fp/flow'
import set from 'lodash/fp/set'
import { STATUS_AFTER_TOUCH, STATUS_CONTROL_CHANGE, STATUS_NOTE_OFF, STATUS_NOTE_ON } from 'zds-pickers'
import WrappedGridRow, { entrySource } from './GridRow'

const GridRow = WrappedGridRow.DecoratedComponent

const idx = 2
const groupId = 0
const entryId = 0
const editEntry = jest.fn()
const removeEntry = jest.fn()
const clickHandler = jest.fn()
const connectDragSource = f => f
const connectDragPreview = f => f

const props = {
  groupId,
  idx,
  editEntry,
  removeEntry,
  entry: {
    entryId,
    input: { channel: 9, status: STATUS_NOTE_ON, value: 1 },
    output: { channel: 9, status: STATUS_NOTE_OFF, value: 2 },
  },
  selected: false,
  disabled: false,
  channels: [],
  selectedRows: [],
  clickHandler,
  connectDragSource,
  connectDragPreview,
}

describe('GridRow tests', () => {
  beforeEach(jest.clearAllMocks)

  it('renders correctly', () => {
    shallowExpect(GridRow)(props).toMatchSnapshot()
  })

  it('renders correctly when selected', () => {
    shallowExpect(GridRow)(flow(
      set('selected', true),
      set('selectedRows', [0]),
    )(props)).toMatchSnapshot()
  })

  it('renders correctly when there is a note value', () => {
    shallowExpect(GridRow)(flow(
      set('entry.input.status', STATUS_NOTE_ON),
      set('entry.input.value', 24),
      set('entry.input.channel', 0),
      set('channels', ['BFD3']),
    )(props)).toMatchSnapshot()
  })

  it('renders correctly for CCs', () => {
    shallowExpect(GridRow)(set('entry.input.status', STATUS_CONTROL_CHANGE)(props)).toMatchSnapshot()
  })

  it('renders correctly for other statuses', () => {
    shallowExpect(GridRow)(set('entry.input.status', STATUS_AFTER_TOUCH)(props)).toMatchSnapshot()
  })

  it('drag preview should update when selected rows changes', () => {
    const wrapper = shallow(<GridRow {...props} />)
    const instance = wrapper.instance()
    instance.dragPreview = null
    expect(instance.dragPreview).toBeNull()
    wrapper.setProps(set('selectedRows', [2, 3])(props))
    expect(instance.dragPreview).not.toBeNull()
  })

  it('clicking should fire the callback', () => {
    const wrapper = shallow(<GridRow {...props} />)
    const event = { type: 'whatever' }
    wrapper.simulate('click', event)
    expect(clickHandler).toHaveBeenCalledWith(event, idx, entryId)
  })

  it('double clicking should make it go into edit mode if not disabled', () => {
    const wrapper = shallow(<GridRow {...props} />)
    wrapper.simulate('doubleclick')
    expect(editEntry).toHaveBeenCalledWith(groupId, entryId)
  })

  it('double clicking should not make it go into edit mode if disabled', () => {
    const wrapper = shallow(<GridRow {...set('disabled', true)(props)} />)
    wrapper.simulate('doubleclick')
    expect(editEntry).not.toHaveBeenCalled()
  })

  it('should be able to delete the row if not disabled', () => {
    const wrapper = shallow(<GridRow {...props} />)
    wrapper
      .find('i')
      .filter('[tag="iDelete"]')
      .simulate('click', { stopPropagation: f => f })
    expect(removeEntry).toHaveBeenCalledWith(groupId, entryId)
  })

  it('should not be able to delete the row if disabled', () => {
    const wrapper = shallow(<GridRow {...set('disabled', true)(props)} />)
    wrapper
      .find('i')
      .filter('[tag="iDelete"]')
      .simulate('click', { stopPropagation: f => f })
    expect(removeEntry).not.toHaveBeenCalled()
  })

  it('should pass the list of selected rows when deleting', () => {
    const selectedRows = [2, 3]
    const wrapper = shallow(<GridRow
      {...flow(
        set('selectedRows', selectedRows),
        set('selected', true),
      )(props)}
    />)
    wrapper
      .find('i')
      .filter('[tag="iDelete"]')
      .simulate('click', { stopPropagation: f => f })
    expect(removeEntry).toHaveBeenCalledWith(groupId, selectedRows)
  })

  describe('entrySource tests', () => {
    beforeEach(jest.clearAllMocks)
    const sourceGroupId = 2
    const destGroupId = 2
    const copy = true
    const selectedRows = [1]
    const handleDraggedFrom = jest.fn()

    it('canDrop should be true if there are selected rows', () => {
      expect(entrySource.canDrag(props)).toBe(false)

      expect(entrySource.canDrag(set('selectedRows', selectedRows)(props))).toBe(true)
    })

    it('beginDrag should return info on the group', () => {
      expect(entrySource.beginDrag(props)).toEqual({ groupId })
    })

    it('endDrag should do nothing if there was no drop result', () => {
      const monitor = {
        getDropResult: () => null,
      }
      const localProps = { groupId: sourceGroupId, selectedRows, handleDraggedFrom }
      entrySource.endDrag(localProps, monitor)
      expect(handleDraggedFrom).not.toHaveBeenCalled()
    })

    it('endDrag should call handleDraggedFrom with the drop result', () => {
      const monitor = {
        getDropResult: () => ({ groupId: sourceGroupId, dropEffect: 'copy' }),
      }
      const localProps = { groupId: sourceGroupId, selectedRows, handleDraggedFrom }
      entrySource.endDrag(localProps, monitor)
      expect(handleDraggedFrom).toHaveBeenCalledWith({
        sourceGroupId,
        destGroupId,
        selectedRows,
        copy,
      })
    })
  })
})
