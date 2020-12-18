import { get } from '../core/fp/objects'

export const isDevEnv = () => process.env.NODE_ENV === 'development'

export const stateErrorLog = get('errorLog')
export const stateInputControls = get('inputControls')
export const stateMappings = get('mappings')
export const stateMidi = get('midi')
export const stateShifter = get('shifter')
export const stateShiftGroups = get('shiftGroups')
export const stateUser = get('user')
export const stateVersion = get('version')

export default undefined
