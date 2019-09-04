import { createBrowserHistory } from 'history'
import { applyMiddleware, compose, createStore } from 'redux'
import { routerMiddleware } from 'connected-react-router'
import createRootReducer from './redux/reducers'
import thunk from 'redux-thunk';

export const history = createBrowserHistory()

export function configureStore(preloadedState) {
  const store = createStore(
    createRootReducer(history), // root reducer with router state
    //预先加载的state
    preloadedState,
    compose(
      applyMiddleware(
        routerMiddleware(history), // for dispatching history actions
        // ... other middlewares ...
        thunk
      ),
    ),
  )

  return store
}
