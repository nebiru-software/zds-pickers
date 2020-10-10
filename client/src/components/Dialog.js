import React from 'react'
import MuiDialog from '@material-ui/core/Dialog'
import Slide from '@material-ui/core/Slide'

/* istanbul ignore next */
const Transition = props => (
  <Slide
    direction="up"
    {...props}
  />
)

const Dialog = props => (
  <MuiDialog
    TransitionComponent={Transition}
    {...props}
  />
)

Dialog.propTypes = {}

export default Dialog
