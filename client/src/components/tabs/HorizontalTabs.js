import Tabs from '@material-ui/core/Tabs'
import styled from '@material-ui/core/styles/styled'
import { lighten } from 'polished'

export default styled(Tabs)(({ theme: { mixins: { absWidth, transition }, palette } }) => ({
  marginTop: 5,
  '& .MuiTabs-flexContainer': {
    justifyContent: 'center',
  },

  '& .MuiTab-root': {
    color: palette.text.inverted,
    ...transition(),

    backgroundColor: palette.grey[400],
    ...absWidth(120),
    borderRadius: '8px 8px 0 0',
    marginRight: 5,
  },

  '& .Mui-selected': {
    backgroundColor: lighten(0.05, palette.accent),
  },

  '& .MuiTabs-indicator': {
    display: 'none',
  },
}), { name: 'HorizontalTabs' })
