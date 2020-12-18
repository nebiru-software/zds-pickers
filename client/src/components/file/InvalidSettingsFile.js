import Button from '@material-ui/core/Button'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogActions from '@material-ui/core/DialogActions'
import { useDispatch, useSelector } from 'react-redux'
import { stateShifter } from 'selectors/index'
import { actions } from 'reducers/shifter'
import Dialog from 'components/Dialog'

const InvalidSettingsFile = () => {
  const dispatch = useDispatch()
  const { invalidSettingsFile } = useSelector(stateShifter)
  const acknowledgeInvalidFile = () => dispatch(actions.acknowledgeInvalidFile())

  return (
    <Dialog
      onClose={acknowledgeInvalidFile}
      open={!!invalidSettingsFile}
    >
      <DialogTitle>Error During Restore</DialogTitle>
      <DialogContent>
        <DialogContentText />
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={acknowledgeInvalidFile}
          variant="contained"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default InvalidSettingsFile
