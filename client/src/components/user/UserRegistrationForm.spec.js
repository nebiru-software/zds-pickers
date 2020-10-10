// import set from 'lodash/fp/set'
// import { store, user } from '../../../__mocks__'
// import actionTypes from '../../reducers/actionTypes'
// import { UserRegistrationForm, mapDispatchToProps, mapStateToProps } from './UserRegistrationForm'

// const handleSubmit = jest.fn()

// const props = {
//   user,
//   handleSubmit,
//   error: '',
//   classes: {},
// }

// describe('UserRegistrationForm tests', () => {
//   beforeEach(jest.clearAllMocks)

//   it('renders correctly', () => {
//     shallowExpect(UserRegistrationForm)(props).toMatchSnapshot()
//   })

//   it('renders errors correctly', () => {
//     shallowExpect(UserRegistrationForm)(set('error', 'error message')(props)).toMatchSnapshot()
//   })

//   it('should utilize mapStateToProps', () => {
//     expect(mapStateToProps(store)).toEqual({ initialValues: user })
//   })

//   it('should utilize mapDispatchToProps', () => {
//     const dispatch = jest.fn()
//     mapDispatchToProps(dispatch).showDialog()
//     expect(dispatch.mock.calls[0][0]).toEqual({ type: actionTypes.SHOW_REGISTRATION_DLG })
//   })
// })
