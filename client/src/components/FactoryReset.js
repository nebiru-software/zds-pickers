import Button from '@material-ui/core/Button'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogActions from '@material-ui/core/DialogActions'
import LinearProgress from '@material-ui/core/LinearProgress'
import { useDispatch, useSelector } from 'react-redux'
import { actions } from 'reducers/shifter'
import { stateShifter } from 'selectors/index'
import Dialog from './Dialog'

const FactoryReset = () => {
  const dispatch = useDispatch()
  const { resetInProcess, showResetDialog } = useSelector(stateShifter)
  // const { confirmFactoryReset, performFactoryReset, shifter } = props
  // const { resetInProcess, showResetDialog } = shifter

  return (
    <>
      <Dialog
        maxWidth="xs"
        onClose={/* istanbul ignore next */ () => dispatch(actions.confirmFactoryReset(false))}
        open={showResetDialog}
      >
        <DialogTitle>Confirm Factory Reset</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <b>Sure to perform reset?</b>
            <br />
            <br />
            {/* eslint-disable-next-line max-len */}
            This will remove all shift groups and return the CC jacks, trigger jacks and CC buttons to their factory defaults.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => dispatch(actions.confirmFactoryReset(false))}
            tag="btnCancel"
          >
            Cancel
          </Button>
          <Button
            autoFocus
            color="primary"
            onClick={() => dispatch(actions.performFactoryReset(true))}
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

export default FactoryReset
