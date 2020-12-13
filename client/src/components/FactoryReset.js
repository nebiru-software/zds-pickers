import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogActions from '@material-ui/core/DialogActions'
import LinearProgress from '@material-ui/core/LinearProgress'
import { shifterShape } from '../core/shapes'
import Dialog from './Dialog'

const FactoryReset = (props) => {
  const { confirmFactoryReset, performFactoryReset, shifter } = props
  const { resetInProcess, showResetDialog } = shifter

  return (
    <>
      <Dialog
        onClose={/* istanbul ignore next */ () => confirmFactoryReset(false)}
        open={showResetDialog}
      >
        <DialogTitle>Confirm Factory Reset</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <b>Sure to perform reset?</b>
            <br />
            <br />
            This will remove all shift groups and return the foot switches to their factory defaults.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => confirmFactoryReset(false)}
            tag="btnCancel"
          >
            Cancel
          </Button>
          <Button
            autoFocus
            color="primary"
            onClick={() => performFactoryReset(true)}
            tag="btnOk"
            variant="contained"
          >
            Perform Reset
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={resetInProcess}>
        <DialogTitle>Factory Reset In Progress</DialogTitle>
        <DialogContent>
          <DialogContentText>Please wait...</DialogContentText>
          <LinearProgress />
        </DialogContent>
      </Dialog>
    </>
  )
}

FactoryReset.propTypes = {
  shifter: shifterShape.isRequired,
  confirmFactoryReset: PropTypes.func.isRequired,
  performFactoryReset: PropTypes.func.isRequired,
}

export default FactoryReset
