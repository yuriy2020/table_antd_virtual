//import "typeface-roboto";
//import "./index.css";
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
//import { ConnectedRouter } from "react-router-redux";
//import { createBrowserHistory } from "history";
import configureStore from './store/configureStore'
import App from './App'
import registerServiceWorker from './registerServiceWorker'

import { ThemeProvider } from 'react-jss'
import {theme} from './theme'

// Create browser history to use in the Redux store
//const baseUrl = document.getElementsByTagName("base")[0].getAttribute("href");
//const history = createBrowserHistory({ basename: baseUrl });

// Get the application-wide store instance, prepopulating with state from the server where available.
const initialState = window.initialReduxState
//const store = configureStore(history, initialState);
const store = configureStore(initialState)

const rootElement = document.getElementById('root')

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </Provider>,
  rootElement
)

registerServiceWorker()
