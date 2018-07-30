import React, { Component } from 'react'
import { createStore, combineReducers, compose } from 'redux'
import { Provider } from 'react-redux'
import { reducer as notificationsReducer } from 'react-notification-system-redux'

import Home from './Home'
import { recentsTab, logsReducer, blockTimeReducer } from './reducers'
import './App.css'

function createReducer() {
  return combineReducers({
    notifications: notificationsReducer,
    recents: recentsTab,
    logs: logsReducer,
    latestBlock: blockTimeReducer,
  })
}

function configureStore() {
  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers =
    process.env.NODE_ENV !== 'production' &&
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      : compose
  /* eslint-enable */

  return createStore(createReducer(), {}, composeEnhancers())
}
const store = configureStore()

class App extends Component {
  render() {
    return (
      <div className="App">
        <Provider store={store}>
          <Home />
        </Provider>
      </div>
    )
  }
}

export default App
