import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Autosuggest from 'react-autosuggest'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'
import { mappingShape } from '../shapes'
import { assertRange } from '..'

const renderedName = item => `${item.note} ${item.name.length ? '-' : ''} ${item.name}`

const renderSuggestion = (suggestion, { query }) => {
  const matches = match(suggestion, query)
  const parts = parse(suggestion, matches)

  return (
    <Fragment>
      {parts.map((part, index) => (
        <span key={String(index)}>{part.text}</span>
      ))}
    </Fragment>
  )
}

function getSuggestions(source, value) {
  const inputValue = value.trim().toLowerCase()
  const inputLength = inputValue.length

  return inputLength === 0
    ? source
    : source.filter(suggestion => suggestion.toLowerCase().includes(inputValue))
}

class NotePicker extends React.Component {
  static propTypes = {
    mapping: PropTypes.arrayOf(mappingShape).isRequired,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    value: PropTypes.number,
    autoFocus: PropTypes.bool,
    inputRef: PropTypes.any,
  }

  static defaultProps = {
    disabled: false,
    value: undefined,
    autoFocus: false,
    inputRef: null,
  }

  constructor(props) {
    super(props)
    this.source = props.mapping.map(renderedName)
    this.state = {
      value: String(props.value ? this.source[props.value - 1] : 1),
      suggestions: [],
    }
  }

  handleSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(this.source, value),
    })
  }

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    })
  }

  handleChange = (event, { newValue }) => {
    const { onChange } = this.props
    const possibleNoteNumber = assertRange(newValue, 128, 0)
    if (possibleNoteNumber > 0) {
      onChange(possibleNoteNumber)
    }
    this.setState({
      value: newValue,
    })
  }

  handleSuggestionSelected = (event, { suggestion }) => {
    const { onChange } = this.props
    onChange(this.source.indexOf(suggestion) + 1)
    this.setState({
      value: suggestion,
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
    const { mapping, onChange, value: propValue, inputRef, ...rest } = this.props
    const { suggestions, value } = this.state

    return (
      <Autosuggest
        ref={this.storeInputReference}
        suggestions={suggestions}
        shouldRenderSuggestions={() => true}
        onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
        onSuggestionSelected={this.handleSuggestionSelected}
        getSuggestionValue={f => f}
        renderSuggestion={renderSuggestion}
        inputProps={{
          placeholder: 'Note # or name',
          value,
          onChange: this.handleChange,
          onFocus: ({ target }) => target.select(),
          ...rest,
        }}
      />
    )
  }
}

export default NotePicker
