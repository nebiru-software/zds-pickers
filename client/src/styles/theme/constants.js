import produce from 'immer'

export default theme => produce(theme, (draft) => {
  const constants = {
    footerHeight: 30,
    gridControlsHeight: 62,
    headerHeight: 77,
    inputControlsHeight: 280,
    tabBorderWidth: 4,
    tabsHeight: 48,
    viewportMargin: 30,
    viewportWidth: 800,
  }

  draft.constants = { ...constants }

  draft.constants.gridHeight = constants.footerHeight
    + constants.gridControlsHeight
    + constants.headerHeight
    + constants.inputControlsHeight
    + (constants.tabBorderWidth * 2 + 42)
    + constants.tabsHeight
    + constants.viewportMargin
})
