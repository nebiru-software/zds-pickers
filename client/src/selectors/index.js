import { get } from '../core/fp/objects'

export const isDevEnv = () => process.env.NODE_ENV === 'development'

export const stateMidi = get('midi')
export const stateShifter = get('shifter')

export default undefined
