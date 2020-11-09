import React from 'react'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import DialogContentText from '@material-ui/core/DialogContentText'

const styles = theme => ({
  dialogContentText: {
    marginTop: theme.spacing(1),
  },
  subHeader: {
    fontWeight: 700,
    marginTop: theme.spacing(1),
  },
})

const Connected = ({ classes }) => (
  <div>
    <DialogContentText className={classes.subHeader}>Ready to test using the M-Audio USB adaptor</DialogContentText>
    <DialogContentText className={classes.dialogContentText}>
      Attach both DIN IN and OUT connections. The one with the gray marking goes on the inside, nearest the USB
      connector.
    </DialogContentText>
    <h4>Click &apos;Next&apos; to perform a factory reset and begin the process...</h4>
  </div>
)

Connected.propTypes = { classes: PropTypes.object.isRequired }

export default withStyles(styles)(Connected)
