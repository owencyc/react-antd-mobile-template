import 'babel-polyfill';
import 'url-search-params-polyfill'
import React from 'react';
import ReactDOM from 'react-dom';
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { history,configureStore } from './configureStore'
import { ConnectedRouter } from 'connected-react-router'
import AppRouter from './routers'
import './index.css';
import App from './components/app/App';
import * as serviceWorker from './serviceWorker';

//ReactDOM.render(<App />, document.getElementById('root'));


const store = configureStore()


render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
        <AppRouter></AppRouter>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
)


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
