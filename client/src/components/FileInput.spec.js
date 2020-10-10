import React from 'react'
import flow from 'lodash/fp/flow'
import set from 'lodash/fp/set'
import FileInput from './FileInput'

const onChange = jest.fn()
const onBlur = jest.fn()

const input = { value: '', onChange, onBlur }
const meta = { touched: false, error: '', warning: '' }

const props = {
  input,
  meta,
}

describe('FileInput tests', () => {
  it('renders correctly', () => {
    shallowExpect(FileInput)(props).toMatchSnapshot()
  })

  it('should render an error when touched', () => {
    const localProps = flow(
      set('meta.error', 'error'),
      set('meta.touched', true),
    )(props)
    shallowExpect(FileInput)(localProps).toMatchSnapshot()
  })

  it('should render a warning when touched', () => {
    const localProps = flow(
      set('meta.warning', 'warning'),
      set('meta.touched', true),
    )(props)
    shallowExpect(FileInput)(localProps).toMatchSnapshot()
  })

  it('should fire onChange', () => {
    const filename = '/a/path'
    const wrapper = shallow(<FileInput {...props} />)
    wrapper.find('input').simulate('change', { target: { files: [filename] } })
    expect(onChange).toHaveBeenCalledWith(filename)
  })

  it('should fire onBlur', () => {
    const filename = '/a/path'
    const wrapper = shallow(<FileInput {...props} />)
    wrapper.find('input').simulate('blur', { target: { files: [filename] } })
    expect(onBlur).toHaveBeenCalledWith(filename)
  })
})
