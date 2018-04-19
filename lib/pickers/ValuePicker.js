/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import omit from 'lodash/omit'
import Input from 'material-ui/Input'

class ValuePicker extends Component {
  static propTypes = {
    className: PropTypes.string,
    value: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    autoFocus: PropTypes.bool,
  }

  static defaultProps = {
    className: '',
    autoFocus: false,
  }

  render() {
    const { onChange } = this.props
    const passedProps = omit(this.props, [onChange])
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
}

export default ValuePicker
