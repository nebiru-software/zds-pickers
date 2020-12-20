import { createElement } from 'react'
import Inputs from 'components/controls/Inputs'

export default props => createElement(Inputs, {
  from: 5,
  to: 8,
  name: [
    'Trigger Jack A<br />"head"',
    'Trigger Jack A<br />"rim"',
    'Trigger Jack B<br />"head"',
    'Trigger Jack B<br />"rim"',
  ],
  details: [
    'Located on the rear of the Shifter.<br />Jack "A" is on the bottom.',
    'This is the "rim" trigger if using a dual-zone pad or splitter cable.',
    'Located on the rear of the Shifter.<br />Jack "A" is the topmost.',
    'This is the "rim" trigger if using a dual-zone pad or splitter cable.',
  ],
  ...props,
})
