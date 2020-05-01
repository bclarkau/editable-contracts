import React from "react";

/**
 * Full Page Loader
 * Very simple component to display a full page loading screen
 * 
 * @param {*} props 
 */
const FullPageLoader = props => {
	return (
		<div className="full-loader">
			<img src="/assets/images/load-dark.svg" alt="Loading..." />
		</div>
	);
}
export default FullPageLoader;