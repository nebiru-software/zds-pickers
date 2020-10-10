import { SORT_ASC, SORT_BY_CHANNEL, SORT_ON_INPUT } from '../../reducers/shiftGroup'
import GridHeader from './GridHeader'

const changeSort = jest.fn()
const props = {
  groupId: 1,
  changeSort,
  sortOn: SORT_ON_INPUT,
  sortBy: SORT_BY_CHANNEL,
  sortDir: SORT_ASC,
}

describe('GridHeader tests', () => {
  beforeEach(jest.clearAllMocks)

  it('renders correctly', () => {
    shallowExpect(GridHeader)(props).toMatchSnapshot()
  })
})
