import React, { Component } from 'react'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import Button from '@material-ui/core/Button'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogActions from '@material-ui/core/DialogActions'
import SvgIcon from '@material-ui/core/SvgIcon'
import GravatarIcon from '../../images/Gravatar.svg'
import Dialog from '../Dialog'
import UserRegistrationForm from './UserRegistrationForm'

const styles = {
  icon: {
    width: 36,
    height: 36,
    marginRight: 7,
  },
  link: {
    color: 'black',
  },
  gravatarNotice: {
    display: 'flex',
    maxWidth: 330,
  },
}

export const GravatarLink = ({ content }) => (
  <a
    href="https://en.gravatar.com/"
    rel="noopener noreferrer"
    target="_blank"
  >
    {content}
  </a>
)
GravatarLink.propTypes = { content: PropTypes.node.isRequired }

export class UserRegistration extends Component {
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown, false)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown, false)
  }

  handleKeyDown = (event) => {
    const { ctrlKey, key, metaKey } = event
    const { hideDialog } = this.props

    // Press CTRL+CMD+U to dismiss registration form
    if (key === 'u' && ctrlKey && metaKey) {
      event.preventDefault()
      event.stopImmediatePropagation()
      const productInstance = {
        registrations: [
          {
            active: true,
            firstName: 'Test',
            lastName: 'User',
            email: 'no_one@email.com',
          },
        ],
      }
      // checkedRegistrationAction(productInstance)
      hideDialog()
    }
  }

  render() {
    const { active, classes, hideDialog, registered, serialNumber, submitRegistrationForm } = this.props
    return (
      <Dialog
        disableBackdropClick={!registered}
        disableEscapeKeyDown={!registered}
        onClose={hideDialog}
        open={active}
      >
        <DialogTitle>ZDS Shifter Registration</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Register yourself as the owner of this Shifter
            <br />
            Serial number:
            <strong> {serialNumber}</strong>
          </DialogContentText>

          <UserRegistrationForm />

          <div className={classes.gravatarNotice}>
            <GravatarLink
              content={(
                <SvgIcon className={classes.icon}>
                  <GravatarIcon />
                </SvgIcon>
)}
            />
            <GravatarLink
              className={classes.link}
              content="We use Gravatar for displaying profile images, based on your email address"
            />
          </div>
        </DialogContent>
        <DialogActions>
          {Boolean(registered) && (
            <Button
              onClick={hideDialog}
              tag="btnCancel"
            >
              Cancel
            </Button>
          )}
          <Button
            autoFocus
            color="primary"
            onClick={submitRegistrationForm}
            tag="btnRegister"
            variant="contained"
          >
            Register
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

UserRegistration.propTypes = {
  active: PropTypes.bool.isRequired,
  hideDialog: PropTypes.func.isRequired,
  submitRegistrationForm: PropTypes.func.isRequired,
  serialNumber: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  registered: PropTypes.bool.isRequired,
}

export default withStyles(styles)(UserRegistration)
