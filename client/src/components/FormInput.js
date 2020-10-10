import React from 'react'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'
import withStyles from '@material-ui/core/styles/withStyles'

// istanbul ignore next
const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit,
    width: 200,
  },
})

export const FormInput = (props) => {
  const {
    classes,
    input,
    label,
    meta: { touched, error, warning },
    type,
  } = props
  const errored = touched && (error || warning)

  return (
    <TextField
      {...input}
      className={classes.textField}
      error={!!errored}
      helperText={touched ? error || warning : null}
      label={label}
      type={type}
    />
  )
}
FormInput.propTypes = {
  input: PropTypes.object.isRequired, // eslint-disable-line
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string,
    warning: PropTypes.string,
  }).isRequired,
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(FormInput)
