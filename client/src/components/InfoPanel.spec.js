import set from 'lodash/fp/set'
import store from '../../__mocks__/store'
import { InfoPanel, mapStateToProps } from './InfoPanel'

describe('InfoPanel tests', () => {
  it('renders correctly', () => {
    shallowExpect(InfoPanel)(store).toMatchSnapshot()
  })

  it('renders correctly when there is no attached device', () => {
    shallowExpect(InfoPanel)(set('version.firmware', NaN)(store)).toMatchSnapshot()
  })

  it('should utilize mapStateToProps', () => {
    expect(mapStateToProps(store)).toEqual({ version: store.version })
  })
})
