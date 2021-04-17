import { number, shape, string } from 'prop-types'

export const mappingShape = shape({
  note: number.isRequired,
  name: string.isRequired,
  group: string.isRequired,
})

export default mappingShape
