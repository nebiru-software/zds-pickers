import FileSaver from 'file-saver'
import Hash from 'object-hash'

export const downloadFile = (data, filename) => {
  const blob = new Blob(data, { type: 'text/plain;charset=utf-8' })
  FileSaver.saveAs(blob, filename)
}

export default (store) => {
  const {
    shifter: { exportFilename, exportBuffer },
    version: { firmware, proModel },
  } = store.getState()

  let output = [
    firmware, //
    proModel,
    ...exportBuffer,
  ].map(Number)

  output = [Hash(output), ...output].map(value => `${value} `)

  return { output, exportFilename }
}
