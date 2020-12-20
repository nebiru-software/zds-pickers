import { useSelector } from 'react-redux'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { stateInputControls } from 'selectors/index'
import InputControl from 'components/controls/InputControl'

const useStyles = makeStyles(({ mixins: { rem }, palette }) => ({
  root: {
  },
}), { name: 'CCJacks' })

const CCJacks = () => {
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

export default CCJacks
