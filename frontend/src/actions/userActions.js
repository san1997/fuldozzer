import axios from 'axios'
import {
	USER_LOGIN_REQUEST,
	USER_LOGIN_SUCCESS,
	USER_LOGIN_FAIL,
	USER_LOGOUT,
	USER_REGISTER_REQUEST,
	USER_REGISTER_SUCCESS,
	USER_REGISTER_FAIL,
	USER_DETAILS_REQUEST,
	USER_DETAILS_SUCCESS,
	USER_DETAILS_FAIL,
} from '../constants/userConstants'

// Actions to login
export const login = (email, password) => async (dispatch) => {
	try {
		dispatch({ type: USER_LOGIN_REQUEST })

		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		}

		// Make post request to login
		const { data } = await axios.post(
			'/api/users/login',
			{ email, password },
			config
		)

		dispatch({
			type: USER_LOGIN_SUCCESS,
			payload: data,
		})
		// Set user to local storage
		localStorage.setItem('userInfo', JSON.stringify(data))
	} catch (error) {
		dispatch({
			type: USER_LOGIN_FAIL,
			payload:
				// Send a custom error message
				// Else send a generic error message
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		})
	}
}
// Actions to logout
export const logout = () => (dispatch) => {
	localStorage.removeItem('userInfo')
	dispatch({ type: USER_LOGOUT })
}
// Actions to register
export const register = (name, email, password) => async (dispatch) => {
	try {
		dispatch({ type: USER_REGISTER_REQUEST })

		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		}

		// Make post request to register
		const { data } = await axios.post(
			'/api/users',
			{ name, email, password },
			config
		)
		// Dispatch register
		dispatch({
			type: USER_REGISTER_SUCCESS,
			payload: data,
		})
		// Auto login after registration
		dispatch({
			type: USER_LOGIN_SUCCESS,
			payload: data,
		})
		// Set user to local storage
		localStorage.setItem('userInfo', JSON.stringify(data))
	} catch (error) {
		dispatch({
			type: USER_REGISTER_FAIL,
			payload:
				// Send a custom error message
				// Else send a generic error message
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		})
	}
}
// Actions to get user details
export const getUserDetails = (id) => async (dispatch, getState) => {
	try {
		dispatch({ type: USER_DETAILS_REQUEST })

		// Get userInfo from userLogin by destructuring
		const {
			userLogin: { userInfo },
		} = getState()

		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${userInfo.token}`,
			},
		}

		// Make post request to register
		const { data } = await axios.get(`/api/users/${id}`, config)
		// Dispatch register
		dispatch({
			type: USER_DETAILS_SUCCESS,
			payload: data,
		})
	} catch (error) {
		dispatch({
			type: USER_DETAILS_FAIL,
			payload:
				// Send a custom error message
				// Else send a generic error message
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		})
	}
}
