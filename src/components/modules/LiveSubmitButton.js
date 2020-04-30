import React, { useState } from "react";
import moment from 'moment';
import { store } from '../store';

const LiveSubmitButton = props => {
	const [status, setStatus] = useState(props.isLocked ? 'sent' : 'active');

	function handleSubmit() {		
		setStatus('sending');

		// pause for a bit to show loader
		setTimeout(() =>
			// save updated data to database
			store(props.id, {
				'status' : 'signed',
				'signature' : btoa(props.signature),
				'signed_on' : moment().format('YYYY-MM-DD HH:mm:ss')
			})
			.then(() => props.setIsLocked(true))
			.catch(error => setError(error))
			.finally(() => setStatus('sent'))
		, 1000);
	}

	let label = status === 'sent' ? props.postLabel : props.children; 
	let loader = status === 'sending' ? <div className="overlay"><img src="/assets/images/load.svg" alt="..." /></div> : false;
	let isDisabled = status === 'sent' ? true : props.disabled;

	return <React.Fragment>
		<button className={status} type="submit" aria-label="Submit" disabled={isDisabled} onClick={handleSubmit}>
			{label}
			{loader}
		</button>
	</React.Fragment>
}
export default LiveSubmitButton;