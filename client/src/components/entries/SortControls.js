/* eslint-disable jsx-a11y/anchor-is-valid */

import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import cl from 'classnames'
import SortDown from '@material-ui/icons/KeyboardArrowDown'
import SortUp from '@material-ui/icons/KeyboardArrowUp'
import { useDispatch } from 'react-redux'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { SORT_ASC, SORT_ON_INPUT, SORT_ON_OUTPUT } from '../../core/consts'
import { sortShape } from '../../core/shapes'
import { actions } from '../../reducers/shiftGroups'

const useStyles = makeStyles(({ palette }) => ({
  sortControl: {
    whiteSpace: 'nowrap',
    '& i': {
      visibility: 'hidden',
      verticalAlign: 'middle',
    },
  },

  active: {
    '& i': {
      visibility: 'visible',
      color: palette.primary[500],
    },
  },
}), { name: 'SortControls' })

const SortControls = ({ groupId, isInput, field, sortOn, sortBy, sortDir, children }) => {
  const dispatch = useDispatch()
  const classes = useStyles()

  const handleClick = useCallback((event) => {
    event.preventDefault()
    dispatch(actions.changeSort(groupId, isInput ? SORT_ON_INPUT : SORT_ON_OUTPUT, field))
  }, [dispatch, field, groupId, isInput])

  const icon = () => (sortDir === SORT_ASC
    ? <SortDown />
    : <SortUp />
  )

  const current = () => field === sortBy //
    && ((isInput && sortOn === SORT_ON_INPUT) || (!isInput && sortOn === SORT_ON_OUTPUT))

  return (
    <a
      className={cl({ [classes.sortControl]: true, [classes.active]: current() })}
      href="#"
      onClick={handleClick}
    >
      {children}
      <i>{icon()}</i>
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
