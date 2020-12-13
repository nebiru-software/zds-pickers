import { connect } from 'react-redux'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import { shifterShape } from '../../core/shapes'
import Dialog from '../Dialog'

export const NotResponding = ({ shifter: { responding } }) => (
  <Dialog open={!responding}>
    <DialogTitle>Shifter Not Responding</DialogTitle>
    <DialogContent>
      <DialogContentText>
        There appears to be an available ZDS Shifter attached to your computer, however it is not responding to
        requests.
        <br />
        <br />
        <b>Troubleshooting</b>
      </DialogContentText>
      <ul>
        <li>Check that no other software is utilizing your Shifter</li>
        <li>Plug directly into a USB port, if using a HUB or other USB host device</li>
        <li>Try a different USB port</li>
        <li>Power down the ZDS Shifter, plug it back in, wait 5 seconds and then refresh this page</li>
      </ul>
    </DialogContent>
  </Dialog>
)

NotResponding.propTypes = {
  shifter: shifterShape.isRequired,
}

export const mapStateToProps = ({ shifter }) => ({ shifter })

export default connect(mapStateToProps)(NotResponding)
