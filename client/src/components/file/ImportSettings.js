import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogActions from '@material-ui/core/DialogActions'
import LinearProgress from '@material-ui/core/LinearProgress'
import { useSelector } from 'react-redux'
import { stateShifter } from 'selectors/index'
import Dialog from 'components/Dialog'
import InvalidSettingsFile from './InvalidSettingsFile'
import ImportSettingsForm from './ImportSettingsForm'

export const ImportSettings = ({ hideDialog }) => {
  const { importInProcess } = useSelector(stateShifter)

  return (
    <>
      <Dialog
        onClose={hideDialog}
        open
      >
        <DialogTitle>Restore Settings</DialogTitle>
        <DialogContent>
          <ImportSettingsForm />
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
            // disabled={invalid || submitting || pristine}
            // onClick={submitImportForm}
            tag="btnLoad"
            variant="contained"
          >
            Load
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

      {/* <InvalidSettingsFile
        acknowledgeInvalidFile={acknowledgeInvalidFile}
        invalidSettingsFile={invalidSettingsFile}
      /> */}
    </>
  )
}

// const formOptions = {
//   form: 'importSettingsForm',
//   enableReinitialize: true,
//   onSubmit: /* istanbul ignore next */ (
//     { importFilename },
//     dispatch, //
//   ) => dispatch(shifterActions.importSettings(importFilename)),
// }

ImportSettings.propTypes = {
  hideDialog: PropTypes.func.isRequired,
}

export default ImportSettings
