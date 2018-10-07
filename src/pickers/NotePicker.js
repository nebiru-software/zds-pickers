// Adapted from https://material-ui-next.com/demos/autocomplete/

import React from 'react'
import PropTypes from 'prop-types'
import Autosuggest from 'react-autosuggest'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import MenuItem from '@material-ui/core/MenuItem'
import { withStyles } from '@material-ui/core/styles'
import { mappingShape } from '../shapes'

const renderedName = item => `#${item.note} ${item.name.length ? '-' : ''} ${item.name}`

function renderInput(inputProps) {
  const { classes, disabled, autoFocus, value, ref, ...other } = inputProps

  return (
    <TextField
      autoFocus={autoFocus}
      className={classes.textField}
      disabled={disabled}
      value={value}
      inputRef={ref}
      FormHelperTextProps={{ className: classes.whiteLabel }}
      InputProps={{
        ...other,
      }}
    />
  )
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion, query)
  const parts = parse(suggestion, matches)

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map((part, index) => part.highlight ? (
          <span key={String(index)} style={{ fontWeight: 300 }}>
            {part.text}
          </span>
        ) : (
          <strong key={String(index)} style={{ fontWeight: 500 }}>
            {part.text}
          </strong>
        ))}
      </div>
    </MenuItem>
  )
}

function renderSuggestionsContainer(options) {
  const { containerProps, children } = options

  return (
    <Paper {...containerProps} square>
      {children}
    </Paper>
  )
}

function getSuggestionValue(suggestion) {
  // this.props.onChange(suggestion)
  return suggestion
}

function getSuggestions(source, value) {
  const inputValue = value.trim().toLowerCase()
  const inputLength = inputValue.length

  return inputLength === 0
    ? []
    : source.filter(suggestion => suggestion.toLowerCase().includes(inputValue))
}

const styles = theme => ({
  container: {
    // position: 'relative',
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 3,
    left: 0,
    right: 0,
    zIndex: 5,
    maxHeight: 200,
    overflowY: 'scroll',
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  textField: {
    width: '100%',
  },
})

class NotePicker extends React.Component {
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

  render() {
    const { classes, disabled } = this.props
    const { suggestions, value } = this.state

    return (
      <Autosuggest
        theme={{
          container: classes.container,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion,
        }}
        renderInputComponent={renderInput}
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
        onSuggestionSelected={this.handleSuggestionSelected}
        renderSuggestionsContainer={renderSuggestionsContainer}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={{
          autoFocus: false,
          classes,
          placeholder: 'Note # or instrument name',
          value,
          onChange: this.handleChange,
          disabled,
          onFocus: ({ target }) => target.select(),
        }}
      />
    )
  }
}

NotePicker.propTypes = {
  classes: PropTypes.object.isRequired,
  mapping: PropTypes.arrayOf(mappingShape).isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  value: PropTypes.number,
}

NotePicker.defaultProps = {
  disabled: false,
  value: undefined,
}

export default withStyles(styles)(NotePicker)
