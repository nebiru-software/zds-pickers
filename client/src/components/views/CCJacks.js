import { createElement } from 'react'
import Inputs from 'components/controls/Inputs'

export default props => createElement(Inputs, {
  from: 3,
  to: 4,
  name: [
    'Expression Jack A',
    'Expression Jack B',
  ],
  details: [
    'Located on the rear of the Shifter.<br />Jack "A" is on the bottom.',
    'Located on the rear of the Shifter.<br />Jack "B" is the topmost.',
  ],
  ...props,
})
