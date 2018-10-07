import React, { Component } from 'react'
import PropTypes from 'prop-types'
import omit from 'lodash/omit'
import Input from '@material-ui/core/Input'

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

  focus = () => {
    this.inputRef.focus()
  }

  render() {
    const { onChange } = this.props
    const passedProps = omit(this.props, ['onChange'])
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

    return (
      <Input
        {...inputProps}
        {...passedProps}
        inputRef={(input) => {
          this.inputRef = input
        }}
      />
    )
  }
}

export default ValuePicker
