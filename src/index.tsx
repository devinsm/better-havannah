import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ServiceContext } from 'services/ServiceContainer';
import GameController from 'services/GameController';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <ServiceContext.Provider value={{ gameController: new GameController() }}>
    <App />
  </ServiceContext.Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
