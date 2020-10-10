import React from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import PropTypes from 'prop-types'
import { CCPicker as ZDSPicker } from 'zds-pickers'

const styles = theme => ({
  selectRoot: {},
  selectRootDisabled: {
    borderColor: theme.palette.grey[400],
    backgroundColor: theme.palette.grey[400],
    boxShadow: 'none',
  },
})

const CCPicker = ({ classes, disabled, ...rest }) => (
  <ZDSPicker
    classes={{
      root: disabled ? classes.selectRootDisabled : classes.selectRoot,
    }}
    disabled={disabled}
    {...rest}
  />
)

CCPicker.propTypes = {
  classes: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
}
CCPicker.defaultProps = { disabled: false }

export default withStyles(styles)(CCPicker)
