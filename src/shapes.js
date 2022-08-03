import { number, oneOfType, shape, string } from 'prop-types'

export const numberOrString = oneOfType([number, string])

export const mappingShape = shape({
  note: number.isRequired,
  name: string.isRequired,
  group: string.isRequired,
})

export default mappingShape
