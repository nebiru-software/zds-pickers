import set from 'lodash/fp/set'
import { shifter, store } from '../../../__mocks__'
import actionTypes from '../../reducers/actionTypes'
import { ExportSettingsForm, mapDispatchToProps, mapStateToProps } from './ExportSettingsForm'

const handleSubmit = jest.fn()

const props = {
  shifter,
  handleSubmit,
  error: '',
}

describe('ExportSettingsForm tests', () => {
  beforeEach(jest.clearAllMocks)

  it('renders correctly', () => {
    shallowExpect(ExportSettingsForm)(props).toMatchSnapshot()
  })

  it('renders errors correctly', () => {
    shallowExpect(ExportSettingsForm)(set('error', 'error message')(props)).toMatchSnapshot()
  })

  it('should utilize mapStateToProps', () => {
    expect(mapStateToProps(store)).toEqual({ initialValues: { exportFilename: shifter.exportFilename } })
  })

  it('should utilize mapDispatchToProps', () => {
    const dispatch = jest.fn()
    const exportFilename = 'filename.txt'
    mapDispatchToProps(dispatch).exportSettings({ exportFilename })
    expect(dispatch.mock.calls[0][0]).toEqual({
      exportDialogVisible: false,
      exportFilename,
      type: actionTypes.EXPORT_SETTINGS,
    })
  })
})
