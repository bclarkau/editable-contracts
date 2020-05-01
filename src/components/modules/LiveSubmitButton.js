import React, { useState } from "react";
import moment from 'moment';
import { store } from '../store';

/**
 * Submit button that shows animated loading and completed states on click. 
 * 
 * @property {String} signature The clients signature as Data URI image 
 * @property {boolean} disabled The button disabled attribute
 * @property {boolean} isLocked The lock status of the editable fields
 * @property {function} setIsLocked Callback. Sets the locked state in the parent
 * @property {String} postLabel The button label to use after submit 
 * @property {String} id The unique reference ID of the current contract
 */
const LiveSubmitButton = props => {
	const [status, setStatus] = useState(props.isLocked ? 'sent' : 'active');

	// on submit, set loading state and store data 
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

	// change button label depending on contract status
	let label = status === 'sent' ? props.postLabel : props.children; 
	
	// button loading overlay 
	let loader = status === 'sending' ? <div className="overlay"><img src="/assets/images/load.svg" alt="..." /></div> : false;

	// if contract has been sent, disable button. Otherwise defer to disabled prop. 
	let isDisabled = status === 'sent' ? true : props.disabled;

	return <React.Fragment>
		<button className={status} type="submit" aria-label="Submit" disabled={isDisabled} onClick={handleSubmit}>
			{label}
			{loader}
		</button>
	</React.Fragment>
}
export default LiveSubmitButton;