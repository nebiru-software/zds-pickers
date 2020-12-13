import { createElement } from 'react'
import PropTypes from 'prop-types'
import MuiTextField from '@material-ui/core/TextField'
import { assertId } from 'fp/internet'

const TextField = ({ id, ...rest }) => createElement(MuiTextField, { ...rest, id: assertId(id) })

TextField.propTypes = { id: PropTypes.string }
TextField.defaultProps = { id: undefined }

export default TextField
