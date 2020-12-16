import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions as shifterActions } from 'reducers/shifter'
import { fieldFilename, fieldRequired } from 'fp/strings'

export const ExportSettingsForm = ({ error, handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    {/* <Field
      autoFocus
      component={FormInput}
      label="Filename"
      name="exportFilename"
      type="text"
      validate={[fieldRequired, fieldFilename]}
    /> */}

    {Boolean(error) && <strong>{error}</strong>}
  </form>
)

ExportSettingsForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.string,
}
ExportSettingsForm.defaultProps = { error: '' }

export const mapStateToProps = ({ shifter }) => ({
  initialValues: { exportFilename: shifter.exportFilename },
})

export const mapDispatchToProps = dispatch => bindActionCreators(shifterActions, dispatch)
const formOptions = {
  form: 'exportSettingsForm',
  enableReinitialize: true,
  onSubmit: /* istanbul ignore next */ (values, dispatch) => dispatch(shifterActions.exportSettings(values)),
}

/* eslint-disable */
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)((ExportSettingsForm))
