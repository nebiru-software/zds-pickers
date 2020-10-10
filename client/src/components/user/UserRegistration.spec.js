import set from 'lodash/fp/set'
import { GravatarLink, UserRegistration } from './UserRegistration'

const hideDialog = jest.fn()
const submitRegistrationForm = jest.fn()
const checkedRegistrationAction = jest.fn()

const props = {
  active: true,
  hideDialog,
  submitRegistrationForm,
  checkedRegistrationAction,
  serialNumber: 'serial-num',
  classes: {},
  registered: false,
}

describe('UserRegistration tests', () => {
  beforeEach(jest.clearAllMocks)

  it('renders correctly', () => {
    shallowExpect(UserRegistration)(props).toMatchSnapshot()
  })

  it('renders gravatar correctly', () => {
    shallowExpect(GravatarLink)({ content: 'content' }).toMatchSnapshot()
  })

  it('displays cancel button once registered', () => {
    expect(shallow(createElement(UserRegistration)(props))
      .find('WithStyles(Button)')
      .filter('[tag="btnCancel"]')).toHaveLength(0)

    expect(shallow(createElement(UserRegistration)(set('registered', true)(props)))
      .find('WithStyles(Button)')
      .filter('[tag="btnCancel"]')).toHaveLength(1)
  })
})
