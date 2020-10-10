import React from 'react'
import MappingPicker from './MappingPicker'

const onChange = jest.fn()

const props = {
  value: '2',
  onChange,
  menuSource: [],
}

describe('MappingPicker tests', () => {
  beforeEach(jest.clearAllMocks)

  it('renders correctly', () => {
    shallowExpect(MappingPicker)(props).toMatchSnapshot()
  })

  it('onChange works correctly', () => {
    const value = '32'
    shallow(<MappingPicker {...props} />).simulate('change', { target: { value } })
    expect(onChange).toHaveBeenCalledWith(value)
  })
})
