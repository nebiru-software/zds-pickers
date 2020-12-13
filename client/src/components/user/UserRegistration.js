import { createElement, useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import KeyboardEventHandler from 'react-keyboard-event-handler'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Button from '@material-ui/core/Button'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogActions from '@material-ui/core/DialogActions'
import SvgIcon from '@material-ui/core/SvgIcon'
import { useDispatch, useSelector } from 'react-redux'
import GravatarIcon from 'images/Gravatar.svg'
import Dialog from 'components/Dialog'
import actionTypes from 'reducers/actionTypes'
import { stateUser } from 'selectors/index'
import { capitalize } from 'fp/strings'
import OutlinedInput from 'components/controls/textInputs/OutlinedInput'
import useReduxPromise from 'hooks/useReduxPromise'
import { when } from 'fp/utils'
import { success } from 'sagas/utils'

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

const UserRegistration = ({ active, hideDialog }) => {
  const { email, firstName, lastName, registered, serialNumber } = useSelector(stateUser)
  const classes = useStyles()
  const sendRegistrationRequest = useReduxPromise(actionTypes.REGISTER_DEVICE)
  const dispatch = useDispatch()
  const [status, setStatus] = useState('ready')
  const { errors, handleSubmit, register } = useForm({ defaultValues: {
    email,
    firstName,
    lastName,
  } })

  const TextField = ({ name, ...more }) => createElement(OutlinedInput, {
    disabled: status === 'waiting',
    inputRef: register({ required: `${capitalize(name)} is required` }),
    name,
    required: true,
    ...more,
  })
  TextField.propTypes = { name: PropTypes.string.isRequired }

  const onSubmit = (data, event) => {
    event.preventDefault()
    setStatus('waiting')
    sendRegistrationRequest({ payload: data })
      .then(() => setStatus('success'))
      .catch(() => setStatus('errored'))
  }

  useEffect(() => {
    when(status === 'success', hideDialog)
  }, [hideDialog, status])

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
    dispatch(({ type: success(actionTypes.REGISTER_DEVICE), response }))
    hideDialog()
  }, [dispatch, hideDialog])

  return (
    <Dialog
      disableBackdropClick={!registered}
      disableEscapeKeyDown={!registered}
      maxWidth="xs"
      onClose={hideDialog}
      open={active}
    >
      <DialogTitle>ZDS Shifter Pro Registration</DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>

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

            <TextField
              label="First Name"
              name="firstName"
            />
            {errors?.firstName?.message}

            <TextField
              label="Last Name"
              name="lastName"
            />
            {errors?.lastName?.message}

            <TextField
              label="Email"
              name="email"
              type="email"
            />
            {errors?.email?.message}

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
            <Button onClick={hideDialog}>
              Cancel
            </Button>
          )}
          <Button
            autoFocus
            color="primary"
            type="submit"
            variant="contained"
          >
            Register
          </Button>
        </DialogActions>

      </form>

    </Dialog>
  )
}

UserRegistration.propTypes = {
  active: PropTypes.bool.isRequired,
  hideDialog: PropTypes.func.isRequired,
}

export default UserRegistration
