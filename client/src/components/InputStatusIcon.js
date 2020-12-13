import PropTypes from 'prop-types'
import { STATUS_NOTE_OFF } from 'zds-pickers'

const InputStatusIcon = (props) => {
  const { status } = props

  return (
    <i
      className="material-icons"
      style={{ color: '#555' }}
    >
      {status === STATUS_NOTE_OFF ? 'library_add' : 'forward'}
    </i>
  )
}

InputStatusIcon.propTypes = {
  status: PropTypes.number.isRequired,
}

export default InputStatusIcon
