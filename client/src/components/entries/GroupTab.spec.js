import flow from 'lodash/fp/flow'
import set from 'lodash/fp/set'
import WrappedGroupTab, { boxTarget } from './GroupTab'

const GroupTab = WrappedGroupTab.DecoratedComponent

const connectDropTarget = jest.fn()

const props = {
  active: true,
  connectDropTarget,
  canDrop: true,
  isOver: false,
  groupId: 1,
  selected: false,
  controlLabels: [],
}

describe('GroupTab tests', () => {
  beforeEach(jest.clearAllMocks)

  it('renders correctly', () => {
    shallowExpect(GroupTab)(props).toMatchSnapshot()
  })

  it('renders correctly when over', () => {
    shallowExpect(GroupTab)(set('isOver', true)(props)).toMatchSnapshot()
  })

  it('renders correctly when not allowed to drop', () => {
    shallowExpect(GroupTab)(flow(
      set('isOver', true),
      set('canDrop', false),
    )(props)).toMatchSnapshot()
  })

  it('renders correctly when not active', () => {
    shallowExpect(GroupTab)(set('active', false)(props)).toMatchSnapshot()
  })

  describe('boxTarget tests', () => {
    const groupId = 3

    beforeEach(jest.clearAllMocks)

    it('drop should return info on the group', () => {
      expect(boxTarget.drop({ groupId })).toEqual({ name: 'TAB', groupId })
    })

    it('can drop on self', () => {
      const monitor = {
        getItem: () => ({ groupId: 0 }),
      }
      expect(boxTarget.canDrop({ groupId }, monitor)).toBe(true)
    })

    it('cannot drop on self', () => {
      const monitor = {
        getItem: () => ({ groupId }),
      }
      expect(boxTarget.canDrop({ groupId }, monitor)).toBe(false)
    })
  })
})
