import React from "react";
import styled from 'styled-components';

// UI
import CircularProgress from '@material-ui/core/CircularProgress';

// styles
const FullScreen = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	display: flex;
	justify-content: center;
	align-items: center;
`;

/**
 * Full Page Loader
 * Very simple component to display a full page loading screen
 * 
 * @param {*} props 
 */
const FullPageLoader = props => {
	return (
		<FullScreen>
			<CircularProgress />
		</FullScreen>
	);
}
export default FullPageLoader;