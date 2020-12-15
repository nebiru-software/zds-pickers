import { compose } from 'redux'
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import props from './props'
import { add, breakpoints } from './utils'
import shadows from './shadows'
import typography, { fonts } from './typography'
import overrides from './overrides'
import mixins from './mixins'
import themePalette from './palette'
import globals from './globals'
import constants from './constants'

export default compose(
  f => ({ ...f }),
  overrides,
  constants,
  typography,
  globals,
  mixins,
  add('name', 'ss'),
  createMuiTheme,
  add('breakpoints', breakpoints),
  add('palette', themePalette),
  add('props', props),
  add('shadows', shadows(themePalette)),
  fonts,
)
