import React, { forwardRef } from 'react'
import Slide from '@material-ui/core/Slide'

export default /* istanbul ignore next */ forwardRef((props, ref) => (
  <Slide
    direction="down"
    ref={ref}
    {...props}
    timeout={{ enter: 300, exit: 300 }}
  />
))
