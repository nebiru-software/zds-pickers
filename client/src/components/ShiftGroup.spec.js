import ShiftGroup from './ShiftGroup'

const props = {
  groupId: 0,
  sortOn: 0,
  sortBy: 'SORT_BY_ALL',
  sortDir: 0,
  changeSort: f => f,
  editEntry: f => f,
  removeEntry: f => f,
  selectShiftEntry: f => f,
  entries: [],
  disabled: false,
  selectAllEntries: f => f,
  clearAllSelections: f => f,
  handleEntryClick: f => f,
}

describe('FactoryReset tests', () => {
  it('renders correctly', () => {
    shallowExpect(ShiftGroup)(props).toMatchSnapshot()
  })
})
