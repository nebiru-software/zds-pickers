import PropTypes from 'prop-types'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import { hardwareTestShape } from '../../../core/shapes'

const ActionButtons = (props) => {
  const {
    hardwareTest: { step, busy, passed },
    hideHardwareTestDialog,
    nextStep,
    performFactoryReset,
    sendEntries,
    sendMessages,
  } = props

  const nextLabel = () => (step === 4 ? 'Finish' : 'Next')
  const nextEnabled = () => !busy && passed
  const nextClicked = () => {
    switch (step) {
    case 0:
      performFactoryReset(false)
      break
    case 1:
      sendEntries(true)
      break
    case 2:
      sendMessages()
      break
    case 3:
      performFactoryReset(true)
      break
    default:
      break
    }
    nextStep()
  }

  return (
    <DialogActions>
      <Button onClick={hideHardwareTestDialog}>Abort</Button>

      <Button
        color="primary"
        disabled={!nextEnabled()}
        onClick={nextClicked}
        variant="contained"
      >
        {nextLabel()}
      </Button>
    </DialogActions>
  )
}

ActionButtons.propTypes = {
  hardwareTest: hardwareTestShape.isRequired,
  hideHardwareTestDialog: PropTypes.func.isRequired,
  nextStep: PropTypes.func.isRequired,
  performFactoryReset: PropTypes.func.isRequired,
  sendEntries: PropTypes.func.isRequired,
  sendMessages: PropTypes.func.isRequired,
}

export default ActionButtons
