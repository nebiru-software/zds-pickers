import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { padding } from 'polished'
import { compose } from 'redux'
import InputControl from 'controls/InputControl'
import { stateInputControls } from 'selectors/index'
import { curryRight, takeSecond } from 'fp/utils'
import { fallsWithin } from 'fp/numbers'

const useStyles = makeStyles(({ palette }) => ({
  root: {
    ...padding(15, 10),

    '& > div': {
      backgroundColor: palette.accentLight,
      marginBottom: 10,
    },
  },
}), { name: 'Inputs' })

const Inputs = ({ from, to, ...rest }) => {
  const inputControls = useSelector(stateInputControls)

  const classes = useStyles()

  const visibleControls = inputControls.filter(compose(
    curryRight(fallsWithin, from, to),
    takeSecond,
  ))

  return (
    <div className={classes.root}>
      {visibleControls.map((control, idx) => (
        <InputControl
          index={idx}
          key={idx}
          {...control}
          {...rest}
        />
      ))}
    </div>
  )
}

Inputs.propTypes = {
  from: PropTypes.number.isRequired,
  to: PropTypes.number.isRequired,
}

export default Inputs
