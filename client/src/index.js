import React from 'react'
import ReactDOM from 'react-dom'
import ReactModal from 'react-modal'
import { Provider } from 'react-redux'
import configureStore from './core/store'
import App from './components/App'

const store = configureStore({})

ReactModal.setAppElement('#react-container')

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('react-container'),
)

export default store
