import PropTypes from 'prop-types'

const adaptFileEventToValue = delegate => e => delegate(e.target.files[0])

const FileInput = ({
  input: { value: omitValue, onChange, onBlur, ...inputProps },
  meta: { touched, error, warning },
  ...props
}) => (
  <div>
    <input
      accept="text/plain"
      onBlur={adaptFileEventToValue(onBlur)}
      onChange={adaptFileEventToValue(onChange)}
      type="file"
      {...inputProps}
      {...props}
    />
    <p>{touched ? error || warning : ''}</p>
  </div>
)

FileInput.propTypes = {
  input: PropTypes.object.isRequired, // eslint-disable-line
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string,
    warning: PropTypes.string,
  }).isRequired,
}

export default FileInput
