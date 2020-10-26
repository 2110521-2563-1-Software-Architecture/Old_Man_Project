import { SET_AUTH } from "../action-types";
import { setAuthToken, 
	setRefreshToken, 
	removeAuthToken, 
	setCurrentClient, 
	removeCurrentClient,
	getCurrentClient
} from "../auth";
import Axios from "axios";
import moment from "moment";

export const signIn = (credentials, history) => async dispatch => {
	try {
		removeAuthToken();
		removeCurrentClient();
		Axios.post("/auth/jwt/create", credentials)
		.then(res => {
			const { access, refresh } = res.data;
			setAuthToken(access);
			setRefreshToken(refresh);
			Axios.get("/api/users/" + credentials.username)
			.then(res1 => {
				const userType = res1.data.user_type;
				setCurrentClient(credentials.username, userType);
				dispatch(setAuth(true));
				history.push("/");
			})
		})
	} catch (error) {
		console.log(error);
		dispatch(setAuth(null));
	}
};

export const signOut = history => dispatch => {
	dispatch(setAuth(null));
	removeAuthToken();
	removeCurrentClient();
	history.push("/");
};

export const setAuth = user => {
	if (user) {
		const currentClient = getCurrentClient()
		if (currentClient.type === 1) {
			Axios.patch("/api/photographers/" + currentClient.username + "/", {
				photographer_last_online_time: moment(new Date())
			})
		}
		return {
			type: SET_AUTH,
			payload: {
				isAuth: true
			}
		};
	}
	return {
		type: SET_AUTH,
		payload: {
			isAuth: false
		}
	};
};