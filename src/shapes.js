import { shape, string, number } from 'prop-types'

export const mappingShape = shape({
  note: number.isRequired,
  name: string.isRequired,
  group: string.isRequired,
})

export default mappingShape
