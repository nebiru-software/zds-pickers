import React from 'react'
import { connect } from 'react-redux'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import { shifterShape } from '../../shapes'
import Dialog from '../Dialog'

export const NoShifterFound = ({ shifter: { searchedForShifter, found } }) => (
  <Dialog open={searchedForShifter && !found}>
    <DialogTitle>Device Not Found</DialogTitle>
    <DialogContent>
      <DialogContentText>
        There does not appear to be an attached ZDS Shifter.
        <br />
        <br />
        <b>Troubleshooting</b>
      </DialogContentText>
      <ul>
        <li>Check that your Shifter is connected via USB</li>
        <li>Check that no other software is utilizing your Shifter</li>
        <li>If connecting through a USB Host device, try connecting directly instead</li>
        <li>Try disconnecting and reconnecting your Shifter</li>
      </ul>
    </DialogContent>
  </Dialog>
)

NoShifterFound.propTypes = {
  shifter: shifterShape.isRequired,
}

export const mapStateToProps = ({ shifter }) => ({ shifter })

export default connect(mapStateToProps)(NoShifterFound)
