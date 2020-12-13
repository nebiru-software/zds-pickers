import PropTypes from 'prop-types'
import KeyboardEventHandler from 'react-keyboard-event-handler'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Button from '@material-ui/core/Button'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogActions from '@material-ui/core/DialogActions'
import SvgIcon from '@material-ui/core/SvgIcon'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import GravatarIcon from 'images/Gravatar.svg'
import Dialog from 'components/Dialog'
import actionTypes from 'reducers/actionTypes'
import UserRegistrationForm from './UserRegistrationForm'

const useStyles = makeStyles(({ mixins: { rem }, palette }) => ({
  icon: {
    width: 36,
    height: 36,
    marginRight: 7,
  },
  link: {
    color: palette.text.secondary,
    textDecoration: 'none',
    fontSize: rem(1.5),
    lineHeight: 1.2,
  },
  gravatarNotice: {
    display: 'flex',
    maxWidth: 330,
  },
}), { name: 'UserRegistration' })

export const GravatarLink = ({ content, ...rest }) => (
  <a
    href="https://en.gravatar.com/"
    rel="noopener noreferrer"
    target="_blank"
    {...rest}
  >
    {content}
  </a>
)
GravatarLink.propTypes = { content: PropTypes.node.isRequired }

const UserRegistration = (props) => {
  const { active, hideDialog, registered, serialNumber, submitRegistrationForm } = props
  const classes = useStyles()
  const dispatch = useDispatch()

  const handleKeyEvent = useCallback(() => {
    // Focus an input and press CTRL+CMD+U to dismiss registration form
    const response = {
      registrations: [
        {
          active: true,
          firstName: 'Test',
          lastName: 'User',
          email: 'dkadrios@gmail.com',
        },
      ],
    }
    dispatch(({ type: actionTypes.DEVICE_REGISTERED, response }))
    hideDialog()
  }, [dispatch, hideDialog])

  return (
    <Dialog
      disableBackdropClick={!registered}
      disableEscapeKeyDown={!registered}
      onClose={hideDialog}
      open={active}
    >
      <DialogTitle>ZDS Shifter Registration</DialogTitle>
      <DialogContent>
        <KeyboardEventHandler
          handleFocusableElements
          handleKeys={['cmd+ctrl+u']}
          onKeyEvent={handleKeyEvent}
        >
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
        </KeyboardEventHandler>
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

UserRegistration.propTypes = {
  active: PropTypes.bool.isRequired,
  hideDialog: PropTypes.func.isRequired,
  submitRegistrationForm: PropTypes.func.isRequired,
  serialNumber: PropTypes.string.isRequired,
  registered: PropTypes.bool.isRequired,
}

export default UserRegistration
