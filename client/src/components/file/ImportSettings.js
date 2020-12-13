import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { reduxForm } from 'redux-form'
import Button from '@material-ui/core/Button'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogActions from '@material-ui/core/DialogActions'
import LinearProgress from '@material-ui/core/LinearProgress'
import { actions as shifterActions } from '../../reducers/shifter'
import { shifterShape } from '../../core/shapes'
import Dialog from '../Dialog'
import InvalidSettingsFile from './InvalidSettingsFile'
import ImportSettingsForm from './ImportSettingsForm'

export const ImportSettings = ({
  shifter: { importDialogVisible, invalidSettingsFile, importInProcess },
  showImportDialog,
  submitImportForm,
  acknowledgeInvalidFile,
  pristine,
  invalid,
  submitting,
}) => (
  <>
    <Dialog
      onClose={() => showImportDialog(false)}
      open={importDialogVisible}
    >
      <DialogTitle>Restore Settings</DialogTitle>
      <DialogContent>
        <ImportSettingsForm />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => showImportDialog(false)}
          tag="btnCancel"
        >
          Cancel
        </Button>
        <Button
          color="primary"
          disabled={invalid || submitting || pristine}
          onClick={submitImportForm}
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
        <Button onClick={acknowledgeInvalidFile}>Close</Button>
      </DialogActions>
    </Dialog>

    <InvalidSettingsFile
      acknowledgeInvalidFile={acknowledgeInvalidFile}
      invalidSettingsFile={invalidSettingsFile}
    />
  </>
)

ImportSettings.propTypes = {
  shifter: shifterShape.isRequired,
  showImportDialog: PropTypes.func.isRequired,
  submitImportForm: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  acknowledgeInvalidFile: PropTypes.func.isRequired,
}

const formOptions = {
  form: 'importSettingsForm',
  enableReinitialize: true,
  onSubmit: /* istanbul ignore next */ (
    { importFilename },
    dispatch, //
  ) => dispatch(shifterActions.importSettings(importFilename)),
}
export const mapStateToProps = ({ shifter }) => ({ shifter })
export const mapDispatchToProps = dispatch => bindActionCreators(shifterActions, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(reduxForm(formOptions)(ImportSettings))
