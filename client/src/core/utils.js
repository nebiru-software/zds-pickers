// /* --------------------------- Reducers ------------------------------------- */

// export function createReducer(initialState, handlers) {
//   return function reducer(state = initialState, action) {
//     return Object.prototype.hasOwnProperty.call(handlers, action.type) ? handlers[action.type](state, action) : state
//   }
// }

// /* ---------------------------- Arrays -------------------------------------- */

// // this just creates and fills a zero-indexed array array; 0, 1, 2, 3, etc
// export const arraySequence = numberOfElements => Array.from(Array(numberOfElements).keys())

// export const splitAt = index => A => [A.slice(0, index), A.slice(index)]

// /* -------------------------------- misc ------------------------------------ */

// export const delay = async (ms) => {
//   const timeout = msec => new Promise(res => setTimeout(res, msec))
//   await timeout(ms)
// }

// export const tap = (data, desc = 'TAP') => {
//   console.log(`${desc}> ${JSON.stringify(data, null, 2)}`) // eslint-disable-line
//   return data
// }

export const getSetting = (key, defaultValue) => {
  const value = localStorage.getItem(key)
  if (value !== null) {
    switch (typeof defaultValue) {
    case 'boolean':
      return value === 'true'
    case 'number':
      return parseInt(value, 10)
    case 'object':
      return JSON.parse(value)
    default:
      return value
    }
  }
  return defaultValue
}

export default undefined
