import React from 'react'
import set from 'lodash/fp/set'
import { shifter } from '../../../__mocks__'
import { MidiSecurity, mapStateToProps } from './MidiSecurity'

const props = {
  shifter,
}

describe('MidiSecurity tests', () => {
  beforeEach(jest.resetAllMocks)

  it('renders correctly', () => {
    shallowExpect(MidiSecurity)(props).toMatchSnapshot()
  })

  it('renders correctly when shifter is available but we can`t access it', () => {
    const wrapper = shallow(<MidiSecurity {...set('shifter.accessGranted', false)(props)} />)
    wrapper.setState({ active: true })
    expect(wrapper).toMatchSnapshot()
  })

  it('should utilize mapStateToProps', () => {
    const state = { shifter }
    expect(mapStateToProps(state)).toEqual(state)
  })
})
