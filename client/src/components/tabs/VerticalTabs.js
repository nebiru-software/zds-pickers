import Tabs from '@material-ui/core/Tabs'
import styled from '@material-ui/core/styles/styled'
import { lighten } from 'polished'

export default styled(Tabs)(({ theme: { mixins: { transition }, palette } }) => ({
  '& .MuiTab-root': {
    color: palette.text.inverted,
    ...transition(),
  },

  '& .Mui-selected': {
    backgroundColor: lighten(0.05, palette.background.paperSecondary),
  },

  '& .MuiTabs-indicator': {
    backgroundColor: palette.primary.A400,
  },
}), { name: 'VerticalTabs' })
