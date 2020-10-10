import React from 'react'
import flow from 'lodash/fp/flow'
import set from 'lodash/fp/set'
import { SORT_ASC, SORT_BY_CHANNEL, SORT_DESC, SORT_ON_INPUT, SORT_ON_OUTPUT } from '../../reducers/shiftGroup'
import SortControls from './SortControls'

const changeSort = jest.fn()

const groupId = 0
const field = SORT_BY_CHANNEL

const props = {
  groupId,
  isInput: true,
  field,
  changeSort,
  children: <div>content</div>,
  sortOn: SORT_ON_INPUT,
  sortBy: SORT_BY_CHANNEL,
  sortDir: SORT_ASC,
}

describe('SortControls tests', () => {
  beforeEach(jest.clearAllMocks)

  it('renders correctly', () => {
    shallowExpect(SortControls)(props).toMatchSnapshot()
  })

  it('renders correctly when sorting desc', () => {
    shallowExpect(SortControls)(set('sortDir', SORT_DESC)(props)).toMatchSnapshot()
  })

  it('should also sort on output', () => {
    shallowExpect(SortControls)(flow(
      set('isInput', false),
      set('sortOn', SORT_ON_OUTPUT),
    )(props)).toMatchSnapshot()
  })

  it('changes sort on click', () => {
    const wrapper = shallow(<SortControls {...props} />)
    const preventDefault = jest.fn()
    const event = { preventDefault }
    wrapper.simulate('click', event)
    expect(preventDefault).toHaveBeenCalled()
    expect(changeSort).toHaveBeenCalledWith(groupId, SORT_ON_INPUT, field)
  })

  it('changes output sort on click', () => {
    const wrapper = shallow(<SortControls {...set('isInput', false)(props)} />)
    const preventDefault = jest.fn()
    const event = { preventDefault }
    wrapper.simulate('click', event)
    expect(preventDefault).toHaveBeenCalled()
    expect(changeSort).toHaveBeenCalledWith(groupId, SORT_ON_OUTPUT, field)
  })
})
