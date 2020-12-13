import { shifter } from '../../../__mocks__'
import { ImportSettings, mapDispatchToProps, mapStateToProps } from './ImportSettings'

const showImportDialog = jest.fn()
const submitImportForm = jest.fn()
const acknowledgeInvalidFile = jest.fn()

const props = {
  shifter,
  showImportDialog,
  submitImportForm,
  pristine: true,
  invalid: false,
  submitting: false,
  acknowledgeInvalidFile,
}

describe('ImportSettings', () => {
  it('should render', () => {
    shallowExpect(ImportSettings)(props).toMatchSnapshot()
  })

  it('hides dialog when cancel is clicked', () => {
    shallow(<ImportSettings {...props} />)
      .find('WithStyles(Button)')
      .filter('[tag="btnCancel"]')
      .simulate('click')
    expect(showImportDialog).toHaveBeenLastCalledWith(false)
  })

  it('hides dialog when clicked outside dialog', () => {
    mount(<ImportSettings {...props} />)
      .find('Dialog')
      .at(0)
      .props()
      .onClose()
    expect(showImportDialog).toHaveBeenLastCalledWith(false)
  })

  it('should utilize mapStateToProps', () => {
    const state = { shifter }
    expect(mapStateToProps(state)).toEqual(state)
  })

  it('should utilize mapDispatchToProps', () => {
    const dispatch = jest.fn()
    mapDispatchToProps(dispatch).showImportDialog()
    expect(dispatch.mock.calls[0][0]).toEqual({ importDialogVisible: undefined, type: 'SHOW_IMPORT_DIALOG' })
  })
})
