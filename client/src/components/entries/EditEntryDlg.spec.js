import set from 'lodash/fp/set'
import { mappings, shiftGroups } from '../../../__mocks__'
import { EditEntryDlg, mapDispatchToProps, mapStateToProps } from './EditEntryDlg'

describe('EditEntryDlg tests', () => {
  const saveEntryEdit = jest.fn()
  const cancelEntryEdit = jest.fn()
  const changeStatus = jest.fn()
  const changeChannel = jest.fn()
  const changeValue = jest.fn()

  const groupId = 0
  const editQueue = {
    entryId: -1,
    input: { channel: 9, status: 9, value: 0 },
    output: { channel: 9, status: 9, value: 0 },
  }

  const props = {
    shiftGroups,
    mappings,
    saveEntryEdit,
    cancelEntryEdit,
    changeStatus,
    changeChannel,
    changeValue,
  }

  beforeEach(jest.clearAllMocks)

  it('renders correctly', () => {
    shallowExpect(EditEntryDlg)(props).toMatchSnapshot()
  })

  it('renders correctly when there is no group', () => {
    shallowExpect(EditEntryDlg)(set('shiftGroups.selectedGroupIdx', -1)(props)).toMatchSnapshot()
  })

  it('should cancel when button is clicked', () => {
    const wrapper = shallow(<EditEntryDlg {...props} />)
    wrapper
      .find('WithStyles(Button)')
      .filter('[tag="btnCancel"]')
      .simulate('click')
    expect(cancelEntryEdit).toHaveBeenCalledWith(groupId)
  })

  it('should submit when button is clicked', () => {
    const wrapper = shallow(<EditEntryDlg {...props} />)
    wrapper
      .find('WithStyles(Button)')
      .filter('[tag="btnApply"]')
      .simulate('click')
    expect(saveEntryEdit).toHaveBeenCalledWith(groupId, editQueue)
  })

  it('should utilize mapStateToProps', () => {
    const state = { shiftGroups, mappings }
    expect(mapStateToProps(state)).toEqual(state)
  })

  it('should utilize mapDispatchToProps', () => {
    const dispatch = jest.fn()
    mapDispatchToProps(dispatch).cancelEntryEdit(groupId)
    expect(dispatch.mock.calls[0][0]).toEqual({ groupId, type: 'CANCEL_ENTRY_EDIT' })
  })
})
