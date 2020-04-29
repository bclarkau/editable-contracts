import React, { useState } from "react";
import moment from 'moment';
import { store } from '../store';

const LiveSubmitButton = props => {
	const [status, setStatus] = useState(false);

	// const SubmitWrapper = styled.div`
	// 	position: relative;
	// 	margin-left: 1rem; 
	// `;

	// const Spinner = styled(CircularProgress)`
	// 	position: absolute;
	// 	top: 50%;
	// 	left: 50%;
	// 	margin-top: ${props => props.size ? '-' + props.size/2 + 'px' : 0};
	// 	margin-left: ${props => props.size ? '-' + props.size/2 + 'px' : 0};
	// `;

	function handleSubmit() {		
		setStatus('sending');
		
		// save updated data to database
		store(props.id, {
			'status' : 'signed',
			'signature' : btoa(props.signature),
			'signed_on' : moment().format('YYYY-MM-DD HH:mm:ss')
		})
		// .then(data => setTimeout(resolve, delay, value))
		.catch(error => setError(error))
		.finally(() => setStatus('sent'))
	}

	let classes = [
		'submit-button',
		props.status
	];

	return <div className={classes.join(' ')}>
		<button type="submit" aria-label="Submit" disabled={props.disabled} onClick={handleSubmit}>{props.children}</button>
		{props.status === 'sending' ? <img src="/assets/images/loading.svg" alt="..." /> : false}
	</div>
}
export default LiveSubmitButton;