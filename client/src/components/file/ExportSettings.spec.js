import React from 'react'
import { shifter, store } from '../../../__mocks__'
import actionTypes from '../../reducers/actionTypes'
import { ExportSettings, mapDispatchToProps, mapStateToProps } from './ExportSettings'

const showExportDialog = jest.fn()
const submitExportForm = jest.fn()

const props = {
  shifter,
  showExportDialog,
  submitExportForm,
}

describe('ExportSettings tests', () => {
  beforeEach(jest.clearAllMocks)

  it('renders correctly', () => {
    shallowExpect(ExportSettings)(props).toMatchSnapshot()
  })

  it('hides dialog when cancel is clicked', () => {
    shallow(<ExportSettings {...props} />)
      .find('WithStyles(Button)')
      .filter('[tag="btnCancel"]')
      .simulate('click')
    expect(showExportDialog).toHaveBeenLastCalledWith(false)
  })

  it('hides dialog when clicked outside dialog', () => {
    mount(<ExportSettings {...props} />)
      .find('Dialog')
      .at(0)
      .props()
      .onClose()
    expect(showExportDialog).toHaveBeenLastCalledWith(false)
  })

  it('should utilize mapStateToProps', () => {
    expect(mapStateToProps(store)).toEqual({ shifter })
  })

  it('should utilize mapDispatchToProps', () => {
    const dispatch = jest.fn()
    mapDispatchToProps(dispatch).showExportDialog(true)
    expect(dispatch.mock.calls[0][0]).toEqual({ exportDialogVisible: true, type: actionTypes.SHOW_EXPORT_DIALOG })
  })
})
