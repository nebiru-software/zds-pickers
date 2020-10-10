import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogActions from '@material-ui/core/DialogActions'
import { actions as shifterActions } from '../reducers/shifter'
import { shifterShape } from '../core/shapes'
import Dialog from './Dialog'

export const ErrorDialog = ({ shifter: { errorMessage, errorVisible }, dismissError }) => (
  <Dialog
    onClose={dismissError}
    open={errorVisible}
  >
    <DialogTitle>Error</DialogTitle>
    <DialogContent>
      <DialogContentText>{errorMessage}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button
        autoFocus
        color="primary"
        onClick={dismissError}
        variant="contained"
      >
        OK
      </Button>
    </DialogActions>
  </Dialog>
)

ErrorDialog.propTypes = {
  shifter: shifterShape.isRequired,
  dismissError: PropTypes.func.isRequired,
}

export const mapStateToProps = ({ shifter }) => ({ shifter })
export const mapDispatchToProps = dispatch => bindActionCreators(shifterActions, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ErrorDialog)
