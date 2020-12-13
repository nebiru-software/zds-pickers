import { connect } from 'react-redux'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import { versionShape } from '../../core/shapes'
import Dialog from '../Dialog'

const minimumFirmware = 20

const formatted = value => `v${(value / 10).toFixed(1)}`

export const VersionNotSupported = ({ version }) => {
  const { checked, firmware } = version

  const isVisible = () => checked && firmware < minimumFirmware

  return (
    <Dialog open={isVisible()}>
      <DialogTitle>Unsupported Version</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Your ZDS Shifter is running an incompatible firmware revision.
          <br />
          <p>
            <span>
              Your version: <b>{formatted(firmware)}</b>
            </span>
            <br />
            <span>
              Minimum supported: <b>{formatted(minimumFirmware)}</b>
            </span>
          </p>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  )
}

VersionNotSupported.propTypes = {
  version: versionShape.isRequired,
}

export const mapStateToProps = ({ version }) => ({ version })

export default connect(mapStateToProps)(VersionNotSupported)
