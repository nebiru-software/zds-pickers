import { shifter } from '../../__mocks__'
import actionTypes from '../reducers/actionTypes'
import { MainMenu, mapDispatchToProps, mapStateToProps } from './MainMenu'

describe('MainMenu tests', () => {
  const showDialog = jest.fn()
  const confirmFactoryReset = jest.fn()
  const performFactoryReset = jest.fn()
  const showImportDialog = jest.fn()
  const showExportDialog = jest.fn()

  const props = {
    shifter,
    showDialog,
    confirmFactoryReset,
    performFactoryReset,
    showImportDialog,
    showExportDialog,
  }

  beforeEach(jest.resetAllMocks)

  it('renders correctly', () => {
    shallowExpect(MainMenu)(props).toMatchSnapshot()
  })

  it('clicking should open the menu', () => {
    const wrapper = shallow(<MainMenu {...props} />)
    wrapper.instance().handleClick({ currentTarget: 'target' })
    expect(wrapper.state('anchorEl')).toEqual('target')
  })

  it('clicking should hide the menu when closing', () => {
    const wrapper = shallow(<MainMenu {...props} />)
    wrapper.setState({ anchorEl: 'target' })
    wrapper.instance().handleClose()
    expect(wrapper.state('anchorEl')).toBeNull()
  })

  it('should show registration dialog', () => {
    const wrapper = shallow(<MainMenu {...props} />)
    wrapper
      .find('WithStyles(MenuItem)')
      .filter('[tag="miRegistration"]')
      .simulate('click')
    expect(showDialog).toHaveBeenCalled()
  })

  it('should show export dialog', () => {
    const wrapper = shallow(<MainMenu {...props} />)
    wrapper
      .find('WithStyles(MenuItem)')
      .filter('[tag="miExport"]')
      .simulate('click')
    expect(showExportDialog).toHaveBeenCalledWith(true)
  })

  it('should show import dialog', () => {
    const wrapper = shallow(<MainMenu {...props} />)
    wrapper
      .find('WithStyles(MenuItem)')
      .filter('[tag="miImport"]')
      .simulate('click')
    expect(showImportDialog).toHaveBeenCalledWith(true)
  })

  it('should show reset dialog', () => {
    const wrapper = shallow(<MainMenu {...props} />)
    wrapper
      .find('WithStyles(MenuItem)')
      .filter('[tag="miReset"]')
      .simulate('click')
    expect(confirmFactoryReset).toHaveBeenCalledWith(true)
  })

  it('should utilize mapStateToProps', () => {
    const state = { shifter }
    expect(mapStateToProps(state)).toEqual(state)
  })

  it('should utilize mapDispatchToProps', () => {
    const dispatch = jest.fn()
    mapDispatchToProps(dispatch).showDialog()
    expect(dispatch.mock.calls[0][0]).toEqual({ type: actionTypes.SHOW_REGISTRATION_DLG })
  })
})
