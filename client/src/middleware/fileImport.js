import actionTypes from '../reducers/actionTypes'
import importFile from '../midi/import'

export default store => next => (action) => {
  const result = next(action)

  switch (action.type) {
  case actionTypes.IMPORT_SETTINGS:
    importFile(store, action)
    break

    // istanbul ignore next
  default:
    break
  }

  return result
}
