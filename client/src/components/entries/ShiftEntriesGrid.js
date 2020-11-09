/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { assertRange } from 'zds-pickers'
import { useDispatch, useSelector } from 'react-redux'
import { entryGrid } from '../../styles/shiftGroupTable.scss'
import { compareEntry } from '../../reducers/shiftEntry'
import { delay } from '../../core/fp/utils'
import { actions } from '../../reducers/shiftGroups'
import useParamSelector from '../../hooks/useParamSelector'
import { getShiftGroup } from '../../selectors/shiftGroups'
import { isDisabled } from '../../selectors/shifter'
import { stateMappings } from '../../selectors'
import GridRow from './GridRow'

const ShiftEntriesGrid = ({ groupId }) => {
  const dispatch = useDispatch()
  const shiftGroup = useParamSelector(getShiftGroup, groupId) || {}
  const disabled = useSelector(isDisabled)
  const { channels } = useSelector(stateMappings)

  const { entries, selectedRows, sortBy, sortDir, sortOn } = shiftGroup

  const compare = compareEntry(sortOn, sortBy, sortDir)

  const sortedEntries = entries?.sort(compare) || []

  const sortedIds = sortedEntries.map(({ entryId }) => entryId)

  const selectShiftEntry = useCallback((entryId) => {
    dispatch(actions.selectShiftEntry(groupId, entryId))
  }, [dispatch, groupId])

  const selectAllEntries = useCallback(() => {
    dispatch(actions.selectAllEntries(groupId))
  }, [dispatch, groupId])

  const clearAllSelections = useCallback(() => {
    dispatch(actions.clearAllSelections(groupId))
  }, [dispatch, groupId])

  const editEntry = useCallback((editEntryIdx) => {
    dispatch(actions.editEntry(groupId, editEntryIdx))
  }, [dispatch, groupId])

  const handleEntryClick = useCallback((idx, metaKey, shiftKey) => {
    dispatch(actions.handleEntryClick(groupId, sortedIds, idx, metaKey, shiftKey))
  }, [dispatch, groupId, sortedIds])

  const saveEntryEdit = useCallback((destGroupId, editQueue) => {
    dispatch(actions.saveEntryEdit(destGroupId, editQueue))
  }, [dispatch])

  const removeEntry = useCallback((sourceGroupId, entryId) => {
    dispatch(actions.removeEntry(sourceGroupId, entryId))
  }, [dispatch])

  const handleArrowKey = (dir) => {
    if (!selectedRows.length) {
      if (sortedEntries.length) {
        selectShiftEntry(sortedEntries[0].entryId)
      }
    } else {
      const currentIndex = sortedEntries.findIndex(({ entryId }) => entryId === selectedRows[0])
      const nextIndex = assertRange(currentIndex + dir, sortedEntries.length - 1, 0)
      if (currentIndex !== nextIndex) {
        selectShiftEntry(sortedEntries[nextIndex].entryId)
      }
    }
  }

  const handleKeyDown = (event) => {
    const { key, metaKey } = event
    if (key === 'a' && metaKey) {
      selectAllEntries()
      event.preventDefault()
    }
    if (key === 'Escape') {
      clearAllSelections()
    }
    if (key === 'Enter' && selectedRows.length) {
      editEntry(selectedRows[0])
    }
    if (key === 'ArrowUp') {
      handleArrowKey(-1)
    }
    if (key === 'ArrowDown') {
      handleArrowKey(1)
    }
  }

  const handleClick = (event, idx, entryId) => {
    const { metaKey, shiftKey } = event
    if (metaKey || shiftKey) {
      event.stopPropagation()
      handleEntryClick()
    } else {
      selectShiftEntry(entryId)
    }
  }

  const handleDraggedFrom = ({ sourceGroupId, destGroupId, selectedRows: selected, copy }) => {
    const affected = entries.filter(({ entryId }) => selected.includes(entryId))

    affected.forEach(({ entryId, input, output }) => {
      saveEntryEdit(destGroupId, { input, output, entryId: -1 })
      delay(100)
      if (!copy) {
        removeEntry(sourceGroupId, entryId)
        delay(100)
      }
    })
  }

  return (
    <div
      className={entryGrid}
      onKeyDown={handleKeyDown}
      role="menuitem"
      tabIndex={0}
    >
      <div>
        {' '}
        {sortedEntries.map((entry, idx) => (
          <GridRow
            channels={channels}
            clickHandler={handleClick}
            disabled={disabled}
            editEntry={editEntry}
            entry={entry}
            groupId={groupId}
            handleDraggedFrom={handleDraggedFrom}
            idx={idx}
            key={idx}
            removeEntry={removeEntry}
            selected={selectedRows.includes(entry.entryId)}
            selectedRows={selectedRows}
          />
        ))}
      </div>
    </div>
  )
}

ShiftEntriesGrid.propTypes = { groupId: PropTypes.number.isRequired }

export default ShiftEntriesGrid
