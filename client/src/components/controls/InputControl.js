import PropTypes from 'prop-types'
import CCControl from './CCControl'

const InputControl = (props) => {
  const { controlId } = props
  // For now, only worry about displaying the CC foot switches
  return controlId < 3 ? <CCControl {...props} /> : <div>control #{controlId}</div>
}

InputControl.propTypes = {
  controlId: PropTypes.number.isRequired,
}

export default InputControl
