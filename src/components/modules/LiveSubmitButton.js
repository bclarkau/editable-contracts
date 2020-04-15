import React from "react";
import styled from 'styled-components';

import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';

const LiveSubmitButton = props => {
	const SubmitWrapper = styled.div`
		position: relative;
		margin-left: 1rem; 
	`;

	const Spinner = styled(CircularProgress)`
		position: absolute;
		top: 50%;
		left: 50%;
		margin-top: ${props => props.size ? '-' + props.size/2 + 'px' : 0};
		margin-left: ${props => props.size ? '-' + props.size/2 + 'px' : 0};
	`;

	return <SubmitWrapper>
		<Button type="submit" aria-label="Submit" variant="contained" color={props.color} disabled={props.isLoading}>{props.label}</Button>
		{props.isLoading ? <Spinner color={props.color} size={24} /> : false}
	</SubmitWrapper>
}
export default LiveSubmitButton;