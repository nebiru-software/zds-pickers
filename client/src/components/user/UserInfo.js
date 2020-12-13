/* eslint-disable jsx-a11y/click-events-have-key-events */
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Avatar from '@material-ui/core/Avatar'
import Gravatar from 'react-gravatar'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { padding } from 'polished'
import { actions as userActions } from '../../reducers/user'
import { userShape } from '../../core/shapes'
import UserRegistration from './UserRegistration'

const useStyles = makeStyles(() => ({
  root: {
    cursor: 'pointer',
    outline: 'none',
    marginRight: 16,
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
  },
  layout: {
    display: 'flex',
    flexFlow: 'row nowrap',

    '& section': {
      display: 'flex',
      flexFlow: 'column nowrap',
      alignSelf: 'center',
      // color: '$color-text-dimmer',
      outline: 'none',
      '& div': {
        fontSize: 13,
        textDecoration: 'underline',
      },
    },
  },
  name: {
    ...padding(0, 10, 0, 0),
    fontSize: 15,
  },

}), { name: 'UserInfo' })

export const UserInfo = ({ user, showDialog, hideDialog, submitRegistrationForm }) => {
  const { dialogVisible, email, firstName, lastName, registered } = user
  const size = 30
  const classes = useStyles()

  return null

  return (
    <div className={classes.root}>
      {Boolean(registered) && (
        <div className={classes.layout}>
          <section
            onClick={showDialog}
            role="button"
            tabIndex="0"
          >
            <div>Registered to:</div>
            <span className={classes.name}>{`${firstName} ${lastName}`}</span>
          </section>

          <Avatar
            onClick={showDialog}
            style={{ width: size, height: size, marginLeft: 10 }}
          >
            <Gravatar
              default="mm"
              email={email}
              rating="x"
              size={size}
            />
          </Avatar>
        </div>
      )}

      <UserRegistration
        active={dialogVisible}
        hideDialog={hideDialog}
        submitRegistrationForm={submitRegistrationForm}
        {...user}
      />
    </div>
  )
}

UserInfo.propTypes = {
  user: userShape.isRequired,
  showDialog: PropTypes.func.isRequired,
  hideDialog: PropTypes.func.isRequired,
  submitRegistrationForm: PropTypes.func.isRequired,
}

export const mapStateToProps = ({ user }) => ({ user })
export const mapDispatchToProps = dispatch => bindActionCreators(userActions, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserInfo)
