import React, { useState } from "react";

/**
 * Submit button that shows animated loading and completed states on click. 
 * 
 * @property {boolean} disabled The button disabled attribute
 * @property {boolean} isLocked The lock status of the editable fields
 * @property {String} postLabel Optional. The button label to use after submit.
 */
const LiveSubmitButton = props => {
	const [status, setStatus] = useState(props.isLocked ? 'sent' : 'active');

	// on submit, run the prop callback function 
	async function handleSubmit() {
		setStatus('sending');

		// wait for click callback to complete
		await new Promise((resolve, reject) => {
			props.handleClick()
				.then(res => resolve(res))
				.catch(error => reject(error))
		})

		// if we have a post label (the callback isn't going to redirect), set the button status again
		if(props.postLabel) {
			setStatus('sent');
		}
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