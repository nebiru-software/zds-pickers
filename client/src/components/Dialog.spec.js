import React from 'react'
import Dialog from './Dialog'

const props = { open: true }

describe('Dialog tests', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<Dialog {...props}>content</Dialog>)
    expect(wrapper).toMatchSnapshot()
  })
})
