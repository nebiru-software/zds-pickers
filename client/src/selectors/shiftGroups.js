import { createSelector } from 'reselect'
import { takeSecond } from '../core/fp/utils'
import { findObj } from '../core/fp/arrays'
import { isDisabled } from './shifter'
import { stateInputControls, stateMappings, stateShiftGroups, stateShifter, stateUser } from '.'

export const getShiftGroups = createSelector(
  stateShiftGroups,
  stateInputControls,
  (shiftGroups, inputControls) => {
    const groups = shiftGroups?.groups || []
    const decoratedGroups = groups.map((group) => {
      const assignedControls = inputControls
        .filter(({ channel, value }) => channel === group.channel && value === group.value)
        .map(({ controlId }) => controlId + 1)
        .map(controlNumber => `FS${controlNumber}`)
      return { ...group, controlLabels: assignedControls }
    })

    return {
      ...shiftGroups,
      groups: decoratedGroups,
    }
  },
)

export const getShiftGroup = createSelector(
  getShiftGroups,
  takeSecond,
  ({ groups }, groupId) => findObj('groupId', groupId)(groups),
)

export const canAddEntryToShiftGroup = createSelector(
  getShiftGroup,
  stateMappings,
  stateShifter,
  stateShiftGroups,
  stateUser,
  isDisabled,
  (shiftGroup, mappings, shifter, shiftGroups, user, disabled) => {
    const {
      errorVisible,
      exportDialogVisible,
      found,
      importDialogVisible,
      importInProcess,
      responding,
    } = shifter

    const { dialogVisible } = user

    const { editing } = shiftGroup || {}

    const {
      maxEntries,
      totalEntries,
    } = shiftGroups

    const {
      userDialogVisible,
      userImportDialogVisible,
    } = mappings

    return responding
    && found
    && !disabled
    && !editing
    && !dialogVisible
    && !importDialogVisible
    && !importInProcess
    && !userDialogVisible
    && !userImportDialogVisible
    && !exportDialogVisible
    && !errorVisible
    // && !registrationDialogVisible // TODO:
    && totalEntries < maxEntries
  },
)

export default undefined
