import { applyMiddleware, combineReducers, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'
import setup from 'redux-midi-fork'
// import thunk from 'redux-thunk'
import * as reducers from '../reducers'
import sagas from '../sagas'
// import sysexInputMiddleware from '../middleware/sysexInput'
// import sysexOutputMiddleware from '../middleware/sysexOutput'
// import hardwareTestOutputMiddleware from '../middleware/hardwareTestOutput'
// import fileExport from '../middleware/fileExport'
// import fileImport from '../middleware/fileImport'
// import { watchForDeviceChange } from '../midi'
import { isDevEnv } from '../selectors'
import { sortObject } from './fp/objects'

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

// export default function storeFactory(initialState) {
//   const isDev = isDevEnv()
//   /* istanbul ignore if */
//   // if (!test) {
//   const { inputMiddleware, outputMiddleware } = setup({ midiOptions: { sysex: true } })
//   middlewares = [
//     ...middlewares,
//     inputMiddleware,
//     outputMiddleware,
//     sysexInputMiddleware,
//     sysexOutputMiddleware,
//     hardwareTestOutputMiddleware,
//     fileExport,
//     fileImport,
//   ]
//   // }

//   /* eslint-disable indent */
//   const store = (isDev
//     ? compose(
//         applyMiddleware(...middlewares),
//         applyMiddleware(logger),
//         window.devToolsExtension ? window.devToolsExtension() : f => f,
//       )
//     : applyMiddleware(...middlewares))(createStore)(rootReducer, initialState)
//   /* eslint-enable indent */

//   /* istanbul ignore if */
//   // if (module.hot) {
//   //   module.hot.accept('./reducers', () => {
//   //     // eslint-disable-next-line
//   //     const nextRootReducer = require('./reducers/index')
//   //     store.replaceReducer(nextRootReducer)
//   //   })
//   // }

//   /* istanbul ignore if */
//   // if (!test) {
//   /*
//      * This effectively bootstraps the application.
//      *
//      * Whenever our device is detected, either initially or due to being
//      * plugged in, watchForDeviceChange will dispatch shifterFound().
//      * This action is intercepted in /middleware/sysexInput, which then
//      * dispatches additional events to request the internal state of the
//      * device.
//      */
//   watchForDeviceChange(store)
//   // }

//   return store
// }
