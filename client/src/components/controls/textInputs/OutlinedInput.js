import makeStyles from '@material-ui/core/styles/makeStyles'
import TextField from './TextField'

const useStyles = makeStyles(({ mixins: { important, rem, when }, palette }) => ({
  root: {
    marginBottom: rem(2.5),
    '& fieldset': {
      borderColor: when('usa', palette.text.greyed, palette.border),
    },

    '&:hover': {
      '& fieldset': {
        borderColor: important(when('usa', palette.accent, palette.border)),
      },
    },
  },
  label: {
    position: 'relative',
    transform: 'unset',
  },
}), { name: 'OutlinedInput' })

const OutlinedInput = (props) => {
  const classes = useStyles()

  const baseProps = {
    className: classes.root,
    fullWidth: true,
    InputLabelProps: {
      variant: 'standard',
      classes: {
        root: classes.label,
      },
      shrink: false,
    },
    InputProps: {
      notched: false,
    },
    variant: 'outlined',
  }

  return (
    <TextField
      {...baseProps}
      {...props}
    />
  )
}

export default OutlinedInput
