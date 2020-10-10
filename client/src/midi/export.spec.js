// import fs from 'fs'
// import configureStore from 'redux-mock-store'
// import exportFile, { downloadFile } from './export'

// jest.mock('file-saver')
// const FileSaver = require('file-saver')

// const textFile = `${__dirname}/../../__assets__/zds-shifter-backup.txt`
// const jsonFile = `${__dirname}/../../__assets__/zds-shifter-backup.json`

// const initialState = JSON.parse(fs.readFileSync(jsonFile, 'utf8'))
// const middlewares = []

// const mockStore = configureStore(middlewares)
// const store = mockStore(initialState)

// describe('midi export', () => {
//   let fileContent

//   beforeAll(() => {
//     fileContent = fs.readFileSync(textFile, 'utf8').trim()
//   })

//   beforeEach(jest.resetAllMocks)

//   it('should succeed', () => {
//     const result = exportFile(store)
//     result.output = result.output.join('').trim()

//     expect(result).toEqual({
//       exportFilename: 'filename',
//       output: fileContent,
//     })
//   })

//   it('downloading file should succeed', () => {
//     const data = [1, 2, 3]
//     const blob = new Blob(data, { type: 'text/plain;charset=utf-8' })
//     const filename = 'exported.txt'
//     FileSaver.saveAs = jest.fn()
//     downloadFile(data, filename)
//     expect(FileSaver.saveAs).toHaveBeenCalledWith(blob, filename)
//   })
// })
