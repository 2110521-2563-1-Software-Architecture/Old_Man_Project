import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import 'normalize.css/normalize.css';
import './assets/index.css';
import AppRouter from "./common/router/router";
import store from "./common/store.js";
import initHttp from "./common/http.js";
import { setAuth } from "./common/actions/auth";
import * as serviceWorker from './serviceWorker';
import { removeCurrentClient, removeAuthToken } from 'common/auth';
import { getCurrentClient } from './common/auth';
import Axios from "axios";
require('dotenv').config();

initHttp();

const token = localStorage.getItem("token");
const refresh = localStorage.getItem("refresh");
if (token) {
	if (!getCurrentClient()) {
		store.dispatch(setAuth(false));
		removeCurrentClient();
		removeAuthToken();
	} else {
		store.dispatch(setAuth(true));
		if (refresh) {
			Axios.post("/auth/jwt/refresh", {
				refresh
			});
		}
	}
} else {
	store.dispatch(setAuth(false));
	removeCurrentClient();
}

ReactDOM.render(
	<Provider store={store}>
		<AppRouter />
	</Provider>,
	document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
