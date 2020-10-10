// import React from 'react'
// import path from 'path'
// import fs from 'fs'
// import set from 'lodash/fp/set'
// import UserMappingsDialog from './UserMappingsDialog'
// import { mappings } from '../../../__mocks__'

// const hideUserMappingsDialog = jest.fn()
// const reportError = jest.fn()
// const importMapping = jest.fn()
// const deleteMapping = jest.fn()

// const props = {
//   userDialogVisible: true,
//   ...mappings,
//   hideUserMappingsDialog,
//   reportError,
//   importMapping,
//   deleteMapping,
// }

// describe('UserMappingsDialog tests', () => {
//   beforeEach(jest.clearAllMocks)

//   it('renders correctly', () => {
//     shallowExpect(UserMappingsDialog)(props).toMatchSnapshot()
//   })

//   it('renders correctly when there are no user mappings', () => {
//     shallowExpect(UserMappingsDialog)(set('userMappings', [])(props)).toMatchSnapshot()
//   })

//   it('deletes user mappings', () => {
//     shallow(<UserMappingsDialog {...props} />)
//       .find('WithStyles(Tooltip)')
//       .at(0)
//       .find('i')
//       .simulate('click')
//     expect(deleteMapping).toHaveBeenCalledWith(mappings.userMappings[0])
//   })

//   describe('file uploading', () => {
//     const wrapper = shallow(<UserMappingsDialog {...props} />)
//     const fileContents = 'contents'
//     const readAsText = jest.fn()
//     // const onload = f => f()
//     // const onerror = f => f()
//     const dummyFileReader = { /* onload, onerror, */ readAsText, result: fileContents }
//     window.FileReader = jest.fn(() => dummyFileReader)

//     it('reads the file', () => {
//       const file = new Blob([fileContents], { type: 'text/plain' })
//       wrapper
//         .find('t')
//         .props()
//         .onChange(file)
//       expect(readAsText).toHaveBeenCalledWith(file)
//     })

//     it('responds to general errors', () => {
//       const file = new Blob([fileContents], { type: 'text/plain' })
//       const code = 3

//       const reader = wrapper
//         .find('t')
//         .props()
//         .onChange(file)

//       const error = { target: { error: { code } } }
//       reader.onerror(error)
//       expect(reportError).toHaveBeenCalledWith(`File could not be read! Code ${code}`)
//     })

//     it('reports an error if wrong file format', () => {
//       const file = new Blob([fileContents], { type: 'text/plain' })
//       const input = { target: { result: 'gibberish' } }

//       const reader = wrapper
//         .find('t')
//         .props()
//         .onChange(file)

//       reader.onload(input)
//       expect(reportError).toHaveBeenCalledWith('Not a valid ZenEdit mapping file.')
//     })

//     it('imports correctly', () => {
//       const filePath = path.join(__dirname, '../../../__mocks__/userMapping.txt')
//       const result = fs.readFileSync(filePath, 'utf8')
//       const file = new Blob([result], { type: 'text/plain' })
//       const input = { target: { result } }
//       const name = 'filename.txt'

//       const reader = wrapper
//         .find('t')
//         .props()
//         .onChange({ ...file, name })

//       reader.onload(input)
//       expect(importMapping).toHaveBeenCalledWith('filename', result)
//     })
//   })
// })
