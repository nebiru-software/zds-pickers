import PropTypes from 'prop-types'
import cl from 'classnames'
import InputAdornment from '@material-ui/core/InputAdornment'
import makeStyles from '@material-ui/core/styles/makeStyles'
import HiddenLabel from '../HiddenLabel'
import DebouncedTextField from './DebouncedTextField'

const SearchAdornment = (
  <InputAdornment position="end">
    <span className="icon-search" />
  </InputAdornment>
)

const useStyles = makeStyles(({ mixins: { rem, percentage } }) => ({
  textField: {
    paddingLeft: 0,
    width: 150,
    '& .MuiInputBase-input, .MuiInputBase-input::placeholder': {
      fontSize: rem(1.9),
      lineHeight: rem(3.5),
    },
    '& .MuiInputAdornment-root': {
      fontSize: percentage(90),
      marginLeft: 2,
      marginRight: 4,
      '& span::before': { marginLeft: 0 },
    },
    fontSize: rem(1.9),
    padding: rem(0.3),
  },
}), { name: 'SearchInput' })

const SearchInput = ({ onChange, className, id: originalId, InputProps, label, value, ...rest }) => {
  const classes = useStyles()
  const handleChange = ({ target }) => onChange(target.value)

  return (
    <HiddenLabel>
      <HiddenLabel.Label>{label}</HiddenLabel.Label>
      <HiddenLabel.Content>
        <DebouncedTextField
          className={cl(className, classes.textField)}
          InputProps={{ startAdornment: SearchAdornment, ...InputProps }}
          onChange={handleChange}
          placeholder="Search"
          value={value}
          variant="outlined"
          {...rest}
        />
      </HiddenLabel.Content>
    </HiddenLabel>
  )
}

SearchInput.propTypes = {
  id: PropTypes.string,
  InputProps: PropTypes.object,
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
}

SearchInput.defaultProps = {
  id: null,
  InputProps: null,
  label: 'Search',
  value: '',
}

export default SearchInput
