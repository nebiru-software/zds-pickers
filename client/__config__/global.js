/* eslint-disable no-console, import/no-extraneous-dependencies */
import { createElement } from 'react'
import curry from 'lodash/curry'
import { compose } from 'redux'
import { configure, mount, render, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })

// Make Enzyme functions available in all test files without importing
global.shallow = shallow
global.render = render
global.mount = mount
// global.toJson = toJson

// Fail tests on any warning
// console.error = (message) => {
//   throw new Error(message)
// }

const noChildrenCreateElement = (Component, props) => createElement(Component, props)
global.createElement = curry(noChildrenCreateElement)

global.shallowExpect = Component => compose(
  expect,
  shallow,
  global.createElement(Component),
)
