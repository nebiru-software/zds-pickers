/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useSelector } from 'react-redux'
import Avatar from '@material-ui/core/Avatar'
import Gravatar from 'react-gravatar'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { padding } from 'polished'
import { useEffect, useState } from 'react'
import { stateUser } from 'selectors/index'
import { when } from 'fp/utils'
import UserRegistration from './UserRegistration'

const useStyles = makeStyles(({ mixins: { important, rem } }) => ({
  root: {
    outline: 'none',
    marginRight: 16,
  },
  layout: {
    lineHeight: 1.2,
    cursor: 'pointer',
    display: 'flex',
    flexFlow: 'row nowrap',

    '& section': {
      display: 'flex',
      flexFlow: important('column nowrap'),
      alignSelf: 'center',
      outline: 'none',
      '& div': {
        fontSize: rem(1.2),
        textDecoration: 'underline',
      },
    },
  },
  name: {
    ...padding(0, 10, 0, 0),
    fontSize: rem(1.3),
  },

}), { name: 'UserInfo' })

const size = 30

export const UserInfo = () => {
  const { checkedRegistration, email, firstName, lastName, registered } = useSelector(stateUser)
  const [dialogVisible, setDialogVisible] = useState(false)
  const classes = useStyles()

  useEffect(() => {
    when(checkedRegistration && !registered, setDialogVisible, true)
  }, [checkedRegistration, registered])

  return (
    <div className={classes.root}>
      {Boolean(registered) && (
        <div className={classes.layout}>
          <section
            onClick={() => setDialogVisible(true)}
            role="button"
            tabIndex="0"
          >
            <div>Registered to:</div>
            <span className={classes.name}>{`${firstName} ${lastName}`}</span>
          </section>

          <Avatar
            onClick={() => setDialogVisible(true)}
            style={{ width: size, height: size, marginLeft: 5 }}
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
        hideDialog={() => setDialogVisible(false)}
      />
    </div>
  )
}

export default UserInfo
