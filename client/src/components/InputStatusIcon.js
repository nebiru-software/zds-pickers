import LibraryAdd from '@material-ui/icons/LibraryAdd'
import Forward from '@material-ui/icons/Forward'
import PropTypes from 'prop-types'
import { STATUS_NOTE_OFF } from 'zds-pickers'

const InputStatusIcon = ({ status }) => (
  status === STATUS_NOTE_OFF
    ? <LibraryAdd />
    : <Forward />
)

InputStatusIcon.propTypes = {
  status: PropTypes.number.isRequired,
}

export default InputStatusIcon
