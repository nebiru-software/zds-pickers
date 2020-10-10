import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Avatar from '@material-ui/core/Avatar'
import Gravatar from 'react-gravatar'
import styles from '../../styles/registration.scss'
import { actions as userActions } from '../../reducers/user'
import { userShape } from '../../shapes'
import UserRegistration from './UserRegistration'

export const UserInfo = ({ user, showDialog, hideDialog, submitRegistrationForm, checkedRegistrationAction }) => {
  const { dialogVisible, email, firstName, lastName, registered } = user
  const size = 30

  return (
    <div className={styles.userInfo}>
      {registered && (
        <div className={styles.layout}>
          <section
            onClick={showDialog}
            role="button"
            tabIndex="0"
          >
            <div>Registered to:</div>
            <span className={styles.name}>{`${firstName} ${lastName}`}</span>
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
        checkedRegistrationAction={checkedRegistrationAction}
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
  checkedRegistrationAction: PropTypes.func.isRequired,
}

export const mapStateToProps = ({ user }) => ({ user })
export const mapDispatchToProps = dispatch => bindActionCreators(userActions, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserInfo)
