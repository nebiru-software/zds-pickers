import './hotLoaderConfig'
import React from 'react'
import { render } from 'react-dom'
import ReactModal from 'react-modal'
import { Provider } from 'react-redux'
import storeFactory from './core/store'
import App from './components/App'

ReactModal.setAppElement('#react-container')

const renderApp = async () => {
  const store = await storeFactory({})

  render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('react-container'),
  )
}

renderApp()
