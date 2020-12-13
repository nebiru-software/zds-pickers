import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Field, reduxForm } from 'redux-form'
import withStyles from '@material-ui/core/styles/withStyles'
import FormInput from '../FormInput'
import { actions as userActions } from '../../reducers/user'
import { fieldEmail, fieldMaxLength64, fieldRequired } from '../../core/fp/strings'

const styles = {
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    border: '2px groove #ccc',
    borderRadius: 5,
    backgroundColor: '#f3f3f3',
    maxWidth: 480,
    margin: '15px 0 40px',
    paddingBottom: 20,
  },
}

export const UserRegistrationForm = ({ error, handleSubmit, classes }) => (
  <form
    className={classes.container}
    onSubmit={handleSubmit}
  >
    <Field
      component={FormInput}
      label="First Name"
      name="firstName"
      type="text"
      validate={[fieldRequired, fieldMaxLength64]}
    />

    <Field
      component={FormInput}
      label="Last Name"
      name="lastName"
      type="text"
      validate={[fieldRequired, fieldMaxLength64]}
    />

    <Field
      component={FormInput}
      label="Email"
      name="email"
      type="email"
      validate={[fieldRequired, fieldEmail]}
    />
    {Boolean(error) && <strong>{error}</strong>}
  </form>
)

UserRegistrationForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.string,
  classes: PropTypes.object.isRequired,
}
UserRegistrationForm.defaultProps = { error: '' }

export const mapStateToProps = ({ user }) => ({ initialValues: user })

export const mapDispatchToProps = dispatch => bindActionCreators(userActions, dispatch)
const formOptions = {
  form: 'userRegistrationForm',
  enableReinitialize: true,
  onSubmit: /* istanbul ignore next */ (values, dispatch) => dispatch(userActions.submitRegistration(values)),
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(reduxForm(formOptions)(withStyles(styles)(UserRegistrationForm)))
