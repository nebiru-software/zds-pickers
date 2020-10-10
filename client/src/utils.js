/* --------------------------- Reducers ------------------------------------- */

export function createReducer(initialState, handlers) {
  return function reducer(state = initialState, action) {
    return Object.prototype.hasOwnProperty.call(handlers, action.type) ? handlers[action.type](state, action) : state
  }
}

/* ---------------------------- Arrays -------------------------------------- */

// this just creates and fills a zero-indexed array array; 0, 1, 2, 3, etc
export const arraySequence = numberOfElements => Array.from(Array(numberOfElements).keys())

export const splitAt = index => A => [A.slice(0, index), A.slice(index)]

/* ------------------------ redux-form Validators --------------------------- */

export const fieldRequired = value => (value ? undefined : 'Required')

const maxLength = max => value => (value && value.length > max ? `Must be ${max} characters or less` : undefined)

export const fieldMaxLength64 = maxLength(64)

export const fieldEmail = value => value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? 'Invalid email address' : undefined

export const fieldFilename = value => value && !/^[\w,\s-]+\.[A-Za-z]{3}$/i.test(value) ? 'Invalid filename' : undefined

export const validateFile = (file) => {
  let result = ''
  const fileMinSize = 1024
  const fileMaxSize = 1024 * 5

  if (file) {
    const { name, size } = file
    if (!name.endsWith('.txt')) {
      result = 'Settings files must use .txt extension'
    } else if (size < fileMinSize) {
      result = 'File must be at least 1Kb in size'
    } else if (size > fileMaxSize) {
      result = 'File cannot exceed 5Kb in size'
    }
  } else {
    result = 'Required'
  }

  return result
}

/* -------------------------------- misc ------------------------------------ */

export const delay = async (ms) => {
  const timeout = msec => new Promise(res => setTimeout(res, msec))
  await timeout(ms)
}

export const tap = (data, desc = 'TAP') => {
  console.log(`${desc}> ${JSON.stringify(data, null, 2)}`) // eslint-disable-line
  return data
}

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
