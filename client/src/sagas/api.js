import { compose } from 'redux'
import { call, put, takeEvery } from 'redux-saga/effects'
import { Either } from 'monet'
import { actions as errorActions } from '../reducers/errorLog'
import { isDefined, promiseToEither } from '../core/fp/utils'
import actionTypes from '../reducers/actionTypes'
import { storage } from '../core/fp/internet'
import { isJSON, isString } from '../core/fp/strings'
import { deepSortObject } from '../core/fp/objects'
import { failure, success } from './utils'

const { Left } = Either

const storable = ['token']

export const unknownErrorMessage = `
An unknown error has occurred.
Please refresh and try again.`

export const storeAuthInfo = data => storable.forEach(key => storage().setItem(key, JSON.stringify(data[key])))

export const removeAuthInfo = () => storable.forEach(key => storage().removeItem(key))

const getDefaultOptions = ({ method }) => ({
  mode: 'cors',
  headers: String(method).toUpperCase() === 'GET'
    ? {
      Accept: 'application/json, text/plain, *.*',
    }
    : {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
})

const getAuthInfo = () => storable.reduce(
  //
  (acc, key) => {
    const item = storage().getItem(key)
    // If undefined is ever put into storage, it always comes back out as a string.
    return isDefined(item) && item !== 'undefined'
      ? {
        ...acc,
        [key]: isJSON(item) ? JSON.parse(item) : /* istanbul ignore next */ item,
      }
      : acc
  },
  {},
)

const addHeader = name => value => options => ({ ...options, headers: { ...options.headers, [name]: value } })
export const getAuthValue = name => getAuthInfo()[name]

const deriveFromDefaults = options => ({ ...getDefaultOptions(options), ...options })
const stringifyItem = name => options => isDefined(options[name]) ? ({
  ...options,
  [name]: isString(options[name]) ? options[name] : JSON.stringify(options[name]),
}) : options

function* processNotifications(either, { status }) {
  const { message } = either.value
  const statusClass = status === 403 ? 403 : Math.trunc(status / 100) * 100
  const variant = { 403: 'error', 200: 'normal', 400: 'warn', 500: 'error' }[statusClass]
  if (message) {
    if (status !== 401) {
      yield put(errorActions.reportError({ message }, variant))
    }
  } else if (statusClass === 500) {
    yield put(errorActions.reportError({ message: unknownErrorMessage }, 'error'))
  }
}

const jsonEither = async (response, options, passThrough) => response.status === 401
  ? Left(new Error('Not authorized to view this resource'))
  : response.ok
    ? promiseToEither(response.status === 204 || options.method === 'delete'
      ? Promise.resolve({ response, passThrough })
      : response.json().then(res => ({ ...res, passThrough })))
    : promiseToEither(response.json
      ? response.json().then(error => Promise.reject(error))
      // We should never get here, but just in case....
      : /* istanbul ignore next */ Promise.reject(new Error('Unknown Error')))

const endpoints = {
  product: process.env.PRODUCT_API_HOST,
  cms: process.env.CMS_API_HOST,
}

function* prepare(payload) {
  const {
    action = {},
    api = 'product',
    options = { method: 'get' },
    passThrough,
    suppressBroadcast = false,
    url,
  } = payload
  const { type } = action
  let either
  let httpResponse

  const composedOptions = compose(
    addHeader('token')(getAuthValue('token')),
    stringifyItem('body'),
    deriveFromDefaults,
  )(options)

  try {
    httpResponse = yield call(fetch, `${endpoints[api]}${url}`, composedOptions)
    either = yield call(jsonEither, httpResponse, composedOptions, passThrough)
  } catch (E) {
    httpResponse = { status: 403 }
    either = Left(E)
  }

  yield call(processNotifications, either, httpResponse)

  // NOTE: Reducers automatically sort their members. This is here to cover direct api calls.
  either = either.map(deepSortObject)

  if (!suppressBroadcast && isDefined(type)) {
    yield either.cata(
      error => put({ type: failure(type), error }),
      response => put({ type: success(type), response }),
    )
  }
  return either
}

export function* callApi({ callback, ...payload }) {
  const result = yield call(prepare, payload)

  /**
   * Callback is here merely as an escape hatch for making calls *outside* of Redux.
   *
   * It should never be used *with* Redux as that is a recipe for non-determinism.
   */
  if (callback) {
    callback(result)
  }
  return result
}

/* istanbul ignore next */
export default function* apiSaga() {
  yield takeEvery(actionTypes.CALL_API, callApi)
}
