import { store, user } from '../../../__mocks__'
import actionTypes from '../../reducers/actionTypes'
import { UserInfo, mapDispatchToProps, mapStateToProps } from './UserInfo'

const showDialog = jest.fn()
const hideDialog = jest.fn()
const hidePopover = jest.fn()
const submitRegistrationForm = jest.fn()
const checkedRegistrationAction = jest.fn()

const props = {
  user,
  showDialog,
  hideDialog,
  hidePopover,
  submitRegistrationForm,
  checkedRegistrationAction,
}

describe('UserInfo tests', () => {
  beforeEach(jest.clearAllMocks)

  it('renders correctly', () => {
    shallowExpect(UserInfo)(props).toMatchSnapshot()
  })

  it('should utilize mapStateToProps', () => {
    expect(mapStateToProps(store)).toEqual({ user })
  })

  it('should utilize mapDispatchToProps', () => {
    const dispatch = jest.fn()
    mapDispatchToProps(dispatch).showDialog()
    expect(dispatch.mock.calls[0][0]).toEqual({ type: actionTypes.SHOW_REGISTRATION_DLG })
  })
})
