import React from 'react'
import PropTypes from 'prop-types'
import omit from 'lodash/omit'
import Input from 'material-ui/Input'

const ValuePicker = (props) => {
  const { onChange } = props
  const passedProps = omit(props, [onChange])
  const inputProps = {
    disableUnderline: true,
    type: 'number',
    onChange: ({ target }) => {
      onChange(target.value)
    },
    onFocus: ({ target }) => {
      target.select()
    },
  }

  return <Input {...inputProps} {...passedProps} />
}

ValuePicker.propTypes = {
  className: PropTypes.string,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  autoFocus: PropTypes.bool,
}

ValuePicker.defaultProps = {
  className: '',
  autoFocus: false,
}

export default ValuePicker
