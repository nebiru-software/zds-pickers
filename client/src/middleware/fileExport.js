import actionTypes from '../reducers/actionTypes'
import exportFile, { downloadFile } from '../midi/export'

export default store => next => (action) => {
  const result = next(action)

  switch (action.type) {
    case actionTypes.EXPORT_SETTINGS_PACKET:
      {
        const buffer = store.getState().shifter.exportBuffer
        if (buffer.length === 498) {
          const { exportFilename, output } = exportFile(store)
          downloadFile(output, exportFilename)
        }
      }
      break

    // istanbul ignore next
    default:
      break
  }

  return result
}
