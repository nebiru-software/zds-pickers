import PropTypes from 'prop-types'
import { connect, useSelector } from 'react-redux'
import { bindActionCreators } from 'redux'
import Button from '@material-ui/core/Button'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogActions from '@material-ui/core/DialogActions'
import LinearProgress from '@material-ui/core/LinearProgress'
import { stateShifter } from 'selectors/index'
import { actions as shifterActions } from '../../reducers/shifter'
import { shifterShape } from '../../core/shapes'
import Dialog from '../Dialog'
import InvalidSettingsFile from './InvalidSettingsFile'
import ImportSettingsForm from './ImportSettingsForm'

export const ImportSettings = () => {
  const { importDialogVisible, importInProcess } = useSelector(stateShifter)

  return (
    <>
      <Dialog
        // onClose={() => showImportDialog(false)}
        open={importDialogVisible}
      >
        <DialogTitle>Restore Settings</DialogTitle>
        <DialogContent>
          <ImportSettingsForm />
        </DialogContent>
        <DialogActions>
          <Button
            // onClick={() => showImportDialog(false)}
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

export default ImportSettings
