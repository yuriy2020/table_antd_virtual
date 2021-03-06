import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import * as Grid from './Grid'
import * as TopPanel from './TopPanel'
import * as Incidents from './Incidents'
//import { routerReducer, routerMiddleware } from 'react-router-redux';

export default function configureStore(/*history, */ initialState) {
  const reducers = {
    grid: Grid.reducer,
    // watchForm: WatchForm.reducer,
    // bottomPanel: BottomPanel.reducer,
    topPanel: TopPanel.reducer,
    // rightPanel: RightPanel.reducer,
    incidents: Incidents.reducer,
    // kanban: Kanban.reducer,
    // passport: Passport.reducer,
  }

  const middleware = [
    thunk,
    //routerMiddleware(history)
  ]

  // In development, use the browser's Redux dev tools extension if installed
  const enhancers = []
  const isDevelopment = process.env.NODE_ENV === 'development'
  if (isDevelopment && typeof window !== 'undefined' && window.devToolsExtension) {
    enhancers.push(window.devToolsExtension())
  }

  const rootReducer = combineReducers({
    ...reducers,
    //routing: routerReducer
  })

  return createStore(rootReducer, initialState, compose(applyMiddleware(...middleware), ...enhancers))
}
