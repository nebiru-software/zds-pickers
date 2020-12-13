import { applyMiddleware, combineReducers, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'
import setup from 'redux-midi-fork'
import * as reducers from 'reducers/index'
import sagas from 'sagas/index'
import { isDevEnv } from 'selectors/index'
import { sortObject } from 'fp/objects'

const combinedReducers = combineReducers(sortObject(reducers))
const sagaMiddleware = createSagaMiddleware()

/* istanbul ignore next */
const createLoggerMiddleware = async () => {
  const reduxLogger = await import('redux-logger')
  return reduxLogger.createLogger({
    collapsed: true,
    diff: false,
    duration: true,
    // predicate: (getState, action) => action.type !== success(actionTypes.SESSION_KEEP_ALIVE),
    // titleFormatter: (action, time, took) => {
    //   const { options: { method } = { method: '???' }, type, url } = action
    //   const parts = ['action']
    //   parts.push(type)
    //   parts.push(`@ ${time}`)
    //   parts.push(`(${took.toFixed(2)} ms)`)
    //   if (type === actionTypes.CALL_API) {
    //     parts.push(`[${String(method).toUpperCase()}] ${url}`)
    //   }

    //   return parts.join(' ')
    // },
  })
}

const buildMiddlewares = async (isDev) => {
  const { inputMiddleware, outputMiddleware } = setup({ midiOptions: { sysex: true } })
  const result = [inputMiddleware, outputMiddleware, sagaMiddleware]
  /* istanbul ignore next */
  if (isDev) {
    result.push(await createLoggerMiddleware())
  }
  return result
}

const storeFactory = async (initialState = {}) => {
  const middlewares = await buildMiddlewares(isDevEnv())
  let applied

  /* istanbul ignore if */
  if (isDevEnv()) {
    const { composeWithDevTools } = await import('redux-devtools-extension')
    applied = composeWithDevTools(applyMiddleware(...middlewares))
  } else {
    applied = applyMiddleware(...middlewares)
  }

  const store = applied(createStore)(combinedReducers, initialState)

  sagaMiddleware.run(sagas)

  return store
}

export default storeFactory
