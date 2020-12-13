import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Button from '@material-ui/core/Button'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import { actions as shifterActions } from '../../reducers/shifter'
import { shifterShape } from '../../core/shapes'
import Dialog from '../Dialog'
import ExportSettingsForm from './ExportSettingsForm'

export const ExportSettings = ({ shifter: { exportDialogVisible }, showExportDialog, submitExportForm }) => (
  <Dialog
    onClose={() => showExportDialog(false)}
    open={exportDialogVisible}
  >
    <DialogTitle>Backup Settings</DialogTitle>
    <DialogContent>
      <ExportSettingsForm />
    </DialogContent>
    <DialogActions>
      <Button
        onClick={() => showExportDialog(false)}
        tag="btnCancel"
      >
        Cancel
      </Button>
      <Button
        color="primary"
        onClick={submitExportForm}
        tag="btnSave"
        variant="contained"
      >
        Save
      </Button>
    </DialogActions>
  </Dialog>
)

ExportSettings.propTypes = {
  shifter: shifterShape.isRequired,
  showExportDialog: PropTypes.func.isRequired,
  submitExportForm: PropTypes.func.isRequired,
}

export const mapStateToProps = ({ shifter }) => ({ shifter })
export const mapDispatchToProps = dispatch => bindActionCreators(shifterActions, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExportSettings)
