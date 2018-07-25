/* eslint-disable no-console, no-underscore-dangle, import/no-extraneous-dependencies */
import { configure, shallow, render, mount } from 'enzyme'
// import toJson from 'enzyme-to-json'
import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })

// Make Enzyme functions available in all test files without importing
global.shallow = shallow
global.render = render
global.mount = mount
// global.toJson = toJson
global.__static = ''

// Fail tests on any warning
/* console.error = (err) => {
  console.log(err)

  // throw typeof err === 'string' ? new Error(err) : err
  // throw err
} */

/**
 * Material-ui has an issue with tooltips that affects enzyme:
 * https://github.com/airbnb/enzyme/issues/1626
 */
if (global.document) {
  document.createRange = () => ({
    setStart: () => {},
    setEnd: () => {},
    commonAncestorContainer: {
      nodeName: 'BODY',
      ownerDocument: document,
    },
  })
}

jest.mock('lodash/debounce', () => jest.fn(fn => fn))
