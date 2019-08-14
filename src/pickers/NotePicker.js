import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { mappingShape } from '../shapes'
import { assertRange } from '../utils'

const formattedMapEntry = ({ note, name }) => `${note} ${name.length ? '-' : ''} ${name}`
const formattedListEntry = (label, idx) => ({ label, value: idx + 1 })

class NotePicker extends React.Component {
  static propTypes = {
    mapping: PropTypes.arrayOf(mappingShape).isRequired,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    value: PropTypes.number,
    inputRef: PropTypes.any,
    channel: PropTypes.number.isRequired,
    status: PropTypes.number.isRequired,
  }

  static defaultProps = {
    disabled: false,
    value: undefined,
    inputRef: null,
  }

  constructor(props) {
    super(props)
    this.state = {
      value: props.value,
    }
  }

  handleChange = (event) => {
    const { value } = event
    const { onChange } = this.props
    const possibleNoteNumber = assertRange(value, 128, 0)

    if (possibleNoteNumber > 0) {
      onChange(possibleNoteNumber)
    }
    this.setState({
      value,
    })
  }

  storeInputReference = (element) => {
    this.textInput = element
    const { inputRef } = this.props
    if (inputRef) {
      inputRef.current = element
    }
  }

  render() {
    const { mapping, onChange, inputRef, disabled, channel, status, value: propValue, ...rest } = this.props
    const { value } = this.state
    const options = mapping.map(formattedMapEntry).map(formattedListEntry)

    return (
      <Select
        ref={this.storeInputReference}
        isDisabled={disabled}
        options={options}
        defaultValue={options[value - 1]}
        onChange={this.handleChange}
        {...rest}
      />
    )
  }
}

export default NotePicker
