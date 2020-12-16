import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import { useDispatch, useSelector } from 'react-redux'
import { useCallback, useEffect, useState } from 'react'
import Dialog from 'components/Dialog'
import { stateShifter } from 'selectors/index'
import TextField from 'components/controls/textInputs/TextField'
import useStateWithDynamicDefault from 'hooks/useStateWithDynamicDefault'
import { fieldFilename, fieldRequired } from 'fp/strings'
import { isDefined } from 'fp/utils'
import { actions } from 'reducers/shifter'

export const ExportSettings = ({ hideDialog }) => {
  const dispatch = useDispatch()
  const { exportFilename } = useSelector(stateShifter)
  const [errorMsg, setErrorMsg] = useState(undefined)
  const [filename, setFilename] = useStateWithDynamicDefault(exportFilename)

  useEffect(() => {
    setErrorMsg(fieldRequired(filename) || fieldFilename(filename))
  }, [filename])

  const handleClick = useCallback(() => {
    dispatch(actions.exportSettings(filename))
    hideDialog()
  }, [dispatch, filename, hideDialog])

  return (
    <Dialog
      onClose={hideDialog}
      open
    >
      <DialogTitle>Backup Settings</DialogTitle>

      <DialogContent>
        <TextField
          error={isDefined(errorMsg)}
          helperText={errorMsg}
          label="Filename"
          onChange={({ target }) => setFilename(target.value)}
          required
          style={{ width: 300, marginBottom: 30 }}
          value={filename}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={hideDialog}>
          Cancel
        </Button>
        <Button
          color="primary"
          disabled={isDefined(errorMsg)}
          onClick={handleClick}
          variant="contained"
        >
          Download
        </Button>
      </DialogActions>
    </Dialog>
  )
}

ExportSettings.propTypes = {
  hideDialog: PropTypes.func.isRequired,
}

export default ExportSettings
