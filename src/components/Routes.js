import React, { useState, useEffect } from "react";
import { Redirect, BrowserRouter, Route, Switch } from 'react-router-dom';

// templates 
import HomeTemplate from './templates/Home';
import ContractTemplate from './templates/Contract';

// modules 
import FullPageLoader from './modules/FullPageLoader';

/**
 * Wrapper around Route component that requires a user to be logged in to visit. 
 * If user is not logged in they are redirected to the home or login page
 */
export const PrivateRoute = ({component: Component, ...rest}) => {
	const [isLoggedIn, setIsLoggedIn] = useState(auth && auth.authenticated);
	const [isLoading, setIsLoading] = useState(true);

	// route args merged together here to avoid reloading the page too often (can result in react error)
	const [routeArgs, setRouteArgs] = useState({
		allowed: false,
		redirectPath: '/login', // default redirect path is to the login page
	}); 

	// on page load, initalise the route args
	useEffect(() => {
		init()
		.then(data => setRouteArgs({
			allowed: data.allowed,
			redirectPath: data.redirectPath,
		}))
		.then(() => setIsLoading(false));
	}, []);

	/**
	 * Initalise the route arguments we need for determining how a private route will function
	 */
	async function init() {
		let allowed = false;
		let redirectPath = '/login';
	
		// If trying to access the Home (base page) private route, only check for auth (contract ID is not set by this point)
		if(rest.isBasePage) {
			allowed = isLoggedIn;
		} 
		// otherwise for all other private routes, check for both auth and contract ID
		else {
			allowed = rest.noredirect || (isLoggedIn && contract);

			// private routes should redirect to homepage if logged in but no contract ID 
			if(isLoggedIn) {
				redirectPath = '/';
			}
		}

		return {
			allowed: allowed,
			redirectPath: redirectPath
		};
	}
	
	return !isLoading ? 
		<Route
			{...rest}
			render={(props) => routeArgs.allowed
				? <Component {...props} {...rest} />
				: <Redirect to={{pathname: routeArgs.redirectPath, state: {from: props.location}}} />
			}
		/>
	: false;
}

const Routes = (props) => {
	// Component state values
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	// check authentication on load
	useEffect(() => {
		isAuthenticated();
	}, []);

	// get authentication status and info of user
	async function isAuthenticated() {
		await fetch(`${window.api_host}/v1/auth`, {
			crossDomain: true,
			method: 'POST',
			mode: 'cors',
		})
		.then(response => { 
			if (response.ok) {
				return response.json();
			} else {
				throw new Error(response.statusText);
			}
		})
		.then(data => setAuth(data))
		.catch(error => setError(error))
		.finally(() => setIsLoading(false));
	}

	return (
		<BrowserRouter>
			{ !isLoading ? 
				<Switch>
					{/* Public routes */}
					<Route exact name="Home" path={'/'} component={HomeTemplate} />
					<Route exact name="Contract" path={'/contract/:ref'} component={ContractTemplate} />

					{/* Render these components separately so that they don't count towards the appSteps */}
					{/* Send the isBasePage prop so we can easily tell it apart in PrivateRoute component */}
					{/* <PrivateRoute exact name="Home" path={'/'} component={Home} isBasePage /> */}
				</Switch>
			: <FullPageLoader /> }
		</BrowserRouter>
	)
}
export default Routes;