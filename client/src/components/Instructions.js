import styled from '@material-ui/core/styles/styled'
import { margin } from 'polished'

export default styled('div')(({ theme: { mixins: { borderS }, palette } }) => ({
  color: palette.text.secondary,
  ...borderS(palette.text.secondary),
  borderRadius: 3,
  padding: 20,
  ...margin(0, 20),
}), { name: 'Instructions' })
