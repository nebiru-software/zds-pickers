/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react'
import PropTypes from 'prop-types'
import { assertRange } from 'zds-pickers'
import { entryGrid } from '../../styles/shiftGroupTable.scss'
import { compareEntry } from '../../reducers/shiftEntry'
import { entryShape, sortShape } from '../../core/shapes'
import { delay } from '../../core/fp/utils'
import GridRow from './GridRow'

const ShiftEntriesGrid = ({
  groupId,
  entries,
  editEntry,
  removeEntry,
  saveEntryEdit,
  selectShiftEntry,
  sortOn,
  sortBy,
  sortDir,
  selectedRows,
  disabled,
  mappings: { channels },
  selectAllEntries,
  clearAllSelections,
  handleEntryClick,
}) => {
  const compare = compareEntry(sortOn, sortBy, sortDir)

  const sortedEntries = entries.sort(compare)

  const sortedIds = sortedEntries.map(({ entryId }) => entryId)

  const handleArrowKey = (dir) => {
    if (!selectedRows.length) {
      if (sortedEntries.length) {
        selectShiftEntry(groupId, sortedEntries[0].entryId)
      }
    } else {
      const currentIndex = sortedEntries.findIndex(({ entryId }) => entryId === selectedRows[0])
      const nextIndex = assertRange(currentIndex + dir, sortedEntries.length - 1, 0)
      if (currentIndex !== nextIndex) {
        selectShiftEntry(groupId, sortedEntries[nextIndex].entryId)
      }
    }
  }

  const handleKeyDown = (event) => {
    const { key, metaKey } = event
    if (key === 'a' && metaKey) {
      selectAllEntries(groupId)
      event.preventDefault()
    }
    if (key === 'Escape') {
      clearAllSelections(groupId)
    }
    if (key === 'Enter' && selectedRows.length) {
      editEntry(groupId, selectedRows[0])
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
      handleEntryClick(groupId, sortedIds, idx, metaKey, shiftKey)
    } else {
      selectShiftEntry(groupId, entryId)
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

ShiftEntriesGrid.propTypes = {
  groupId: PropTypes.number.isRequired,
  editEntry: PropTypes.func.isRequired,
  removeEntry: PropTypes.func.isRequired,
  selectShiftEntry: PropTypes.func.isRequired,
  entries: PropTypes.arrayOf(entryShape).isRequired,
  disabled: PropTypes.bool.isRequired,
  selectAllEntries: PropTypes.func.isRequired,
  clearAllSelections: PropTypes.func.isRequired,
  handleEntryClick: PropTypes.func.isRequired,
  ...sortShape,
}

export default ShiftEntriesGrid
