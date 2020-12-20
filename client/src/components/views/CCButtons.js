import { createElement } from 'react'
import Inputs from 'components/controls/Inputs'

export default props => createElement(Inputs, {
  from: 0,
  to: 2,
  name: [
    'Button 1',
    'Button 2',
    'Button 3',
  ],
  details: [
    'Located on the face of the Shifter.<br />Button 1 is in the center.',
    'Located on the face of the Shifter.<br />Button 2 is on the left.',
    'Located on the face of the Shifter.<br />Button 3 is on the right.',
  ],
  ...props,
})
