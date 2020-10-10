import { applyMiddleware, compose, createStore } from 'redux'
import { createLogger } from 'redux-logger'
import setup from 'redux-midi-fork'
import thunk from 'redux-thunk'
import rootReducer from './reducers'
import sysexInputMiddleware from './middleware/sysexInput'
import sysexOutputMiddleware from './middleware/sysexOutput'
import hardwareTestOutputMiddleware from './middleware/hardwareTestOutput'
import fileExport from './middleware/fileExport'
import fileImport from './middleware/fileImport'
import { watchForDeviceChange } from './midi'

const logger = createLogger({
  collapsed: true,
  diff: true,
})
let middlewares = [thunk]

export default function storeFactory(
  initialState,
  /* istanbul ignore next */ debug = __DEV__,
  /* istanbul ignore next */ test = __TEST__,
) {
  /* istanbul ignore if */
  if (!test) {
    const { inputMiddleware, outputMiddleware } = setup({ midiOptions: { sysex: true } })
    middlewares = [
      ...middlewares,
      inputMiddleware,
      outputMiddleware,
      sysexInputMiddleware,
      sysexOutputMiddleware,
      hardwareTestOutputMiddleware,
      fileExport,
      fileImport,
    ]
  }

  /* eslint-disable indent */
  const store = (debug
    ? compose(
        applyMiddleware(...middlewares),
        applyMiddleware(logger),
        window.devToolsExtension ? window.devToolsExtension() : f => f,
      )
    : applyMiddleware(...middlewares))(createStore)(rootReducer, initialState)
  /* eslint-enable indent */

  /* istanbul ignore if */
  if (module.hot) {
    module.hot.accept('./reducers', () => {
      // eslint-disable-next-line
      const nextRootReducer = require('./reducers/index')
      store.replaceReducer(nextRootReducer)
    })
  }

  /* istanbul ignore if */
  if (!test) {
    /*
     * This effectively bootstraps the application.
     *
     * Whenever our device is detected, either initially or due to being
     * plugged in, watchForDeviceChange will dispatch shifterFound().
     * This action is intercepted in /middleware/sysexInput, which then
     * dispatches additional events to request the internal state of the
     * device.
     */
    watchForDeviceChange(store)
  }

  return store
}
