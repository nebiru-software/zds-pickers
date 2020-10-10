// import fs from 'fs'
// import configureStore from 'redux-mock-store'
// import importFile from './import'

// const middlewares = []

// const mockStore = configureStore(middlewares)
// const store = mockStore({
//   inputControls: {},
//   shiftGroups: {},
// })

// describe('midi import', () => {
//   let fileContent
//   const rawFile = `${__dirname}/../../__assets__/zds-shifter-backup.txt`
//   beforeAll(() => {
//     fileContent = fs.readFileSync(rawFile, 'utf8')
//   })

//   it('should succeed', (done) => {
//     const File = new Blob([fileContent], { type: 'text/plain' })

//     importFile(store, { File }).then(() => {
//       const actions = store.getActions()
//       expect(actions.length).toBe(3)

//       done()
//     })
//   })

//   it('should fail for invalid files [EMPTY]', () => {
//     expect(() => {
//       importFile(store, { File: {} })
//     }).toThrow()
//   })

//   it('should fail for invalid files [checksum, no data]', (done) => {
//     const File = new Blob(['gibberish'], { type: 'text/plain' })

//     importFile(store, { File }).then(() => {
//       expect(store.getActions()).toEqual(expect.arrayContaining([
//         {
//           type: 'INVALID_SETTINGS_FILE',
//           invalidSettingsFile: 'Invalid settings file',
//         },
//       ]))

//       done()
//     })
//   })

//   it('should fail for invalid files [bad data]', (done) => {
//     const File = new Blob(['gibberish 10 0 127'], { type: 'text/plain' })
//     importFile(store, { File }).then(() => {
//       expect(store.getActions()).toEqual(expect.arrayContaining([
//         {
//           type: 'INVALID_SETTINGS_FILE',
//           invalidSettingsFile: 'Invalid settings file',
//         },
//       ]))
//       done()
//     })
//     // .catch(err => console.log('ERROR', err))
//   })
// })
