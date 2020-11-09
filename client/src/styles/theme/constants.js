import produce from 'immer'

export default theme => produce(theme, (draft) => {
  draft.constants = {
    headerHeight: 77,
    inputControlsHeight: 280,
    viewportWidth: 800,
    footerHeight: 30,
    gridControlsHeight: 62,
    tabBorderWidth: 4,
    tabsHeight: 48,
    viewportMargin: 30,
  }

  draft.constants.gridHeight = draft.constants.heightHeader
  + draft.constants.inputControlsHeight
  + draft.constants.heightTabs
  + draft.constants.heightGridControls
  + draft.constants.heightFooter
  + draft.constants.viewportMargin
  + (draft.constants.tabBorderWidth * 2 + 42)
})
