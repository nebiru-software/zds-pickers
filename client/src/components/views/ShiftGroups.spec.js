// import React from 'react'
// import set from 'lodash/fp/set'
// import { inputControls, mappings, shiftGroups, shifter, store, user, version } from '../../../__mocks__'
// import { actions as shiftGroupActions } from '../../reducers/shiftGroups'
// import { actions as mappingsActions } from '../../reducers/mappings'
// import { actions as shifterActions } from '../../reducers/shifter'
// import { ShiftGroups, mapDispatchToProps, mapStateToProps } from './ShiftGroups'

// const changeSelectedGroup = jest.fn()

// const props = {
//   shifter,
//   shiftGroups: {
//     ...shiftGroups,
//     groups: shiftGroups.groups.map(group => ({ ...group, entries: [] })),
//   },
//   mappings,
//   user,
//   version,
//   inputControls,
//   changeSelectedGroup,

//   ...shiftGroupActions,
//   ...mappingsActions,
//   ...shifterActions,
// }

// describe('ShiftGroups tests', () => {
//   beforeEach(jest.clearAllMocks)

//   it('renders correctly', () => {
//     shallowExpect(ShiftGroups)(props).toMatchSnapshot()
//   })

//   it('renders correctly while still loading', () => {
//     shallowExpect(ShiftGroups)(set('shiftGroups.groups', [])(props)).toMatchSnapshot()
//   })

//   it('should change groups when tab is clicked', () => {
//     const wrapper = mount(<ShiftGroups {...props} />)

//     wrapper
//       .find('WithStyles(Tabs)')
//       .instance()
//       .props.onChange({}, 2)
//     // expect(changeSelectedGroup).toHaveBeenCalledWith(2)
//   })

//   it('should utilize mapStateToProps', () => {
//     expect(mapStateToProps(store)).toEqual({ shifter, shiftGroups, mappings, user, version, inputControls })
//   })

//   it('should utilize mapDispatchToProps', () => {
//     const dispatch = jest.fn()
//     mapDispatchToProps(dispatch).changeSelectedGroup(3)
//     expect(dispatch.mock.calls[0][0]).toEqual({ groupId: 3, type: 'CHANGE_SELECTED_GROUP' })
//   })
// })
