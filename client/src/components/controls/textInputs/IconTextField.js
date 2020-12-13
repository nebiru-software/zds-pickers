import PropTypes from 'prop-types'
import classNames from 'classnames'
import makeStyles from '@material-ui/core/styles/makeStyles'
import TextField from './TextField'

const useStyles = makeStyles(({ palette, mixins: { rem } }) => ({
  root: {
    '&::before': {
      position: 'absolute',
      top: 'calc(50%)',
      transform: 'translateY(-50%)',
      left: rem(1.5),
      fontSize: 17,
    },
  },
  input: {
    paddingLeft: rem(4.5),
    '&::placeholder': {
      fontSize: rem(2),
      color: palette.text.hint,
    },
  },
}), { name: 'IconTextField' })

const IconTextField = (props) => {
  const { Constructor, className, icon, inputProps: newInputProps, ...rest } = props
  const classes = useStyles()
  const inputProps = {
    className: classes.input,
    ...newInputProps,
  }
  return (
    <Constructor
      className={classNames(classes.root, className, icon)}
      inputProps={inputProps}
      {...rest}
    />
  )
}

IconTextField.propTypes = {
  Constructor: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  className: PropTypes.string,
  icon: PropTypes.string.isRequired,
  inputProps: PropTypes.object,
}
IconTextField.defaultProps = {
  Constructor: TextField,
  className: null,
  inputProps: null,
}

export default IconTextField
