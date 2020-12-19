import produce from 'immer'
import { maxContainerWidth } from './utils'

export default theme => produce(theme, (draft) => {
  const constants = {
    footerHeight: 30,
    gridControlsHeight: 62,
    headerHeight: 77,
    inputControlsHeight: 280,
    tabBorderWidth: 4,
    tabsHeight: 48,
    viewportMargin: 30,
    viewportWidth: maxContainerWidth,
  }

  draft.constants = { ...constants }

  draft.constants.gridHeight = constants.gridControlsHeight
    + constants.headerHeight
    + (constants.tabBorderWidth * 2 + 58)
    + constants.tabsHeight
    + constants.viewportMargin
})
