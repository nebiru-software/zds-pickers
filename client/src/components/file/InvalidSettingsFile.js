import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogActions from '@material-ui/core/DialogActions'
import Dialog from '../Dialog'

const InvalidSettingsFile = ({ acknowledgeInvalidFile, invalidSettingsFile }) => (
  <Dialog
    onRequestClose={acknowledgeInvalidFile}
    open={!!invalidSettingsFile}
  >
    <DialogTitle>Error During Restore</DialogTitle>
    <DialogContent>
      <DialogContentText />
    </DialogContent>
    <DialogActions>
      <Button onClick={acknowledgeInvalidFile}>Close</Button>
    </DialogActions>
  </Dialog>
)

InvalidSettingsFile.propTypes = {
  acknowledgeInvalidFile: PropTypes.func,
  invalidSettingsFile: PropTypes.string,
}

InvalidSettingsFile.defaultProps = {
  acknowledgeInvalidFile: null,
  invalidSettingsFile: null,
}

export default InvalidSettingsFile
