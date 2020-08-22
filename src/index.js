import '@codetrix-studio/capacitor-google-auth';
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import userDataReducer from './store/reducers/userData';
import mindmapReducer from './store/reducers/mindmaps';

import {BrowserRouter} from 'react-router-dom';
// IONIC ASSETS
import '@ionic/react/css/core.css';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import './theme/variables.css';

const rootReducer = combineReducers({
  user: userDataReducer,
  maps: mindmapReducer
})

const store = createStore(rootReducer);


ReactDOM.render(
	<Provider store={store}>
		<BrowserRouter>
     		<App/>
  		</BrowserRouter>
	</Provider>,
  
  	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
