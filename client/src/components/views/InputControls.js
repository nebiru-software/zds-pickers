import { useSelector } from 'react-redux'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { margin, padding } from 'polished'
import InputControl from 'controls/InputControl'
import WaitingOnShifter from 'components/WaitingOnShifter'
import { stateInputControls, stateShifter } from 'selectors/index'

const width = 680

const useStyles = makeStyles(({ constants, palette }) => ({
  root: {
    height: constants.inputControlsHeight,
    ...margin(0, 50),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    color: palette.text.inverted,

    '& > div': {
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
  },
}), { name: 'InputControls' })

export const InputControls = () => {
  const inputControls = useSelector(stateInputControls)
  const {
    found,
    ready,
    responding,
  } = useSelector(stateShifter)

  const classes = useStyles()

  const visibleControls = inputControls.filter((control, idx) => idx < 3)

  return (
    <div className={classes.root}>
      <div>
        {ready ? (
          <section>
            {visibleControls.map((control, idx) => (
              <InputControl
                key={idx}
                {...control}
                layout={idx === 1 ? 'right' : 'left'}
              />
            ))}
          </section>
        ) : (
          <section>{Boolean(found && responding) && <WaitingOnShifter />}</section>
        )}
      </div>
    </div>
  )
}

export default InputControls
