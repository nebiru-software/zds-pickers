import PropTypes from 'prop-types'
import { Fragment } from 'react'

const DefaultTooltip = ({ children }) => createElement(Fragment, null, children)

DefaultTooltip.propTypes = { children: PropTypes.element.isRequired }

export default DefaultTooltip
