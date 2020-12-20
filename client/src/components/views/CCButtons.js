import { useSelector } from 'react-redux'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { margin, padding } from 'polished'
import InputControl from 'controls/InputControl'
import { stateInputControls } from 'selectors/index'

const width = 680

const useStyles = makeStyles(({ constants, palette }) => ({
  root: {
    // height: constants.inputControlsHeight,
    // ...margin(0, 50),
    // display: 'flex',
    // flexFlow: 'row nowrap',
    // justifyContent: 'center',
    // alignItems: 'center',
    // color: palette.text.inverted,

    minWidth: width,
    maxWidth: width,
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'center',
    borderRadius: 15,
    ...padding(15, 10),
    backgroundColor: palette.accentLight,

    '& > section': {
      display: 'flex',
      flexFlow: 'row nowrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      minWidth: width,
    },

  },
}), { name: 'InputControls' })

const CCButtons = () => {
  const inputControls = useSelector(stateInputControls)

  const classes = useStyles()

  const visibleControls = inputControls.filter((control, idx) => idx < 3)

  return (
    <div className={classes.root}>
      <section>
        {visibleControls.map((control, idx) => (
          <InputControl
            key={idx}
            {...control}
            layout={idx === 1 ? 'right' : 'left'}
          />
        ))}
      </section>
    </div>
  )
}

export default CCButtons
