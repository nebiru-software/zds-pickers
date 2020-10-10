import React from 'react'
import { mappings } from '../../../__mocks__'
import MappingsDialog from './MappingsDialog'

const hideMappingsDialog = jest.fn()
const changeMapping = jest.fn()
const showUserMappingsDialog = jest.fn()

const props = {
  dialogVisible: true,
  ...mappings,
  hideMappingsDialog,
  changeMapping,
  showUserMappingsDialog,
}

describe('MappingsDialog tests', () => {
  beforeEach(jest.clearAllMocks)

  it('renders correctly', () => {
    shallowExpect(MappingsDialog)(props).toMatchSnapshot()
  })

  it('changes mapping', () => {
    const wrapper = shallow(<MappingsDialog {...props} />)
    const idx = 3
    const name = 'mapping name'

    wrapper
      .find('MappingPicker')
      .at(idx)
      .props()
      .onChange(name)
    expect(changeMapping).toHaveBeenCalledWith(idx, name)
  })
})
