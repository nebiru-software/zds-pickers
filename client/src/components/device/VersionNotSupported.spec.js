import React from 'react'
import set from 'lodash/fp/set'
import flow from 'lodash/fp/flow'
import { version } from '../../../__mocks__'
import { VersionNotSupported, mapStateToProps } from './VersionNotSupported'

const props = {
  version,
}

describe('VersionNotSupported tests', () => {
  beforeEach(jest.resetAllMocks)

  it('renders correctly', () => {
    shallowExpect(VersionNotSupported)(props).toMatchSnapshot()
  })

  it('renders correctly when firmware is not supported', () => {
    const wrapper = shallow(<VersionNotSupported
      {...flow(
        set('version.firmware', 1),
        set('version.checked', true),
      )(props)}
    />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should utilize mapStateToProps', () => {
    const state = { version }
    expect(mapStateToProps(state)).toEqual(state)
  })
})
