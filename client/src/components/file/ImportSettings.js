import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogActions from '@material-ui/core/DialogActions'
import LinearProgress from '@material-ui/core/LinearProgress'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { stateShifter } from 'selectors/index'
import Dialog from 'components/Dialog'
import FileInput from 'components/FileInput'
import { actions } from 'reducers/shifter'
import InvalidSettingsFile from './InvalidSettingsFile'

export const ImportSettings = ({ hideDialog }) => {
  const dispatch = useDispatch()
  const { importInProcess } = useSelector(stateShifter)
  const [selectedFile, setSelectedFile] = useState(undefined)

  return (
    <>
      <Dialog
        onClose={hideDialog}
        open
      >
        <DialogTitle>Restore Settings</DialogTitle>

        <DialogContent>
          <FileInput
            label="Filename"
            name="importFilename"
            onReady={setSelectedFile}
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={hideDialog}
            tag="btnCancel"
          >
            Cancel
          </Button>
          <Button
            color="primary"
            disabled={!selectedFile || importInProcess}
            onClick={() => dispatch(actions.importSettings(selectedFile, hideDialog))}
            variant="contained"
          >
            Restore
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={importInProcess}>
        <DialogTitle>Restore In Progress</DialogTitle>
        <DialogContent>
          <DialogContentText>Please wait. This will take a few moments...</DialogContentText>
          <LinearProgress />
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={acknowledgeInvalidFile}>Close</Button> */}
        </DialogActions>
      </Dialog>

      <InvalidSettingsFile />
    </>
  )
}

ImportSettings.propTypes = {
  hideDialog: PropTypes.func.isRequired,
}

export default ImportSettings
