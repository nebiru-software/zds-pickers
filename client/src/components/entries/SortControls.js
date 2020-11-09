/* eslint-disable jsx-a11y/anchor-is-valid */

import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'
import { useDispatch } from 'react-redux'
import { SORT_ASC, SORT_ON_INPUT, SORT_ON_OUTPUT } from '../../core/consts'
import * as styles from '../../styles/shiftGroupTable.scss'
import { sortShape } from '../../core/shapes'
import { actions } from '../../reducers/shiftGroups'

const cx = classNames.bind(styles)

const SortControls = ({ groupId, isInput, field, sortOn, sortBy, sortDir, children }) => {
  const dispatch = useDispatch()

  const handleClick = useCallback((event) => {
    event.preventDefault()
    dispatch(actions.changeSort(groupId, isInput ? SORT_ON_INPUT : SORT_ON_OUTPUT, field))
  }, [dispatch, field, groupId, isInput])

  const icon = () => (sortDir === SORT_ASC ? 'keyboard_arrow_down' : 'keyboard_arrow_up')

  const current = () => field === sortBy //
    && ((isInput && sortOn === SORT_ON_INPUT) || (!isInput && sortOn === SORT_ON_OUTPUT))

  return (
    <a
      className={cx({ sortControl: true, active: current() })}
      href="#"
      onClick={handleClick}
    >
      {children}
      <i className="material-icons">{icon()}</i>
    </a>
  )
}

SortControls.propTypes = {
  groupId: PropTypes.number.isRequired,
  isInput: PropTypes.bool,
  field: sortShape.sortBy, // eslint-disable-line
  ...sortShape,
  children: PropTypes.node.isRequired,
}

SortControls.defaultProps = {
  isInput: false,
}

export default SortControls
