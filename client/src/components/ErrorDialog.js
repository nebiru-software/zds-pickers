import Button from '@material-ui/core/Button'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogActions from '@material-ui/core/DialogActions'
import { useDispatch, useSelector } from 'react-redux'
import { actions } from 'reducers/errorLog'
import { stateErrorLog } from 'selectors/index'
import { isDefined } from 'fp/utils'
import Dialog from './Dialog'

export const ErrorDialog = () => {
  const dispatch = useDispatch()
  const { currentMessage } = useSelector(stateErrorLog)
  const clearError = () => dispatch(actions.clearError())

  return (
    <Dialog
      onClose={clearError}
      open={isDefined(currentMessage)}
    >
      <DialogTitle>Error</DialogTitle>
      <DialogContent>
        <DialogContentText>{currentMessage}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          color="primary"
          onClick={clearError}
          variant="contained"
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ErrorDialog
