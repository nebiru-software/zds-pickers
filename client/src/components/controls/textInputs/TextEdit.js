import { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import Textarea from 'react-textarea-autosize'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { debounce } from '../../../../core/fp/utils'

const useStyles = makeStyles(({ mixins: { rem } }) => ({
  footer: {
    textAlign: 'right',
    fontSize: rem(1.3),
    lineHeight: 1.625,
    position: 'relative',
    top: rem(-0.75),
  },
}), { name: 'TextEdit' })

const TextEdit = (props) => {
  const {
    editProps,
    maxLength,
    maxRows,
    onChange,
    showCharsLeft,
    value: propValue,
    ...rest
  } = props
  const [charsLeft, setCharsLeft] = useState(maxLength)
  const [value, setValue] = useState(propValue)
  const classes = useStyles()
  const debouncedOnChange = useMemo(() => debounce(250, onChange), [onChange])

  const handleChange = ({ target }) => {
    const { value: val } = target
    setValue(val)
    setCharsLeft(maxLength - val.length)
    debouncedOnChange(val)
  }

  return (
    <Grid
      alignItems="stretch"
      container
      direction="column"
      {...rest}
    >
      <Grid item>
        <Textarea
          maxLength={maxLength}
          maxRows={maxRows}
          onInput={handleChange}
          value={value}
          {...editProps}
        />
      </Grid>
      {Boolean(showCharsLeft) && (
        <Grid
          className={classes.footer}
          data-testid="chars-left-label"
          item
        >
          Characters Left: {charsLeft}
        </Grid>
      )}
    </Grid>
  )
}

TextEdit.propTypes = {
  onChange: PropTypes.func.isRequired,
  maxLength: PropTypes.number,
  showCharsLeft: PropTypes.bool,
  value: PropTypes.string,
  maxRows: PropTypes.number,
  editProps: PropTypes.object,
}

TextEdit.defaultProps = {
  maxLength: 140,
  showCharsLeft: false,
  value: '',
  maxRows: 6,
  editProps: null,
}

export default TextEdit
