import React, { useState } from "react";
import { BlockNumber, SectionEditMenu, SectionLoader } from './Section';
import { store } from '../store';

/**
 * Request section. Renders an editable block of text.
 * 
 * @property {String} request The request string 
 * @property {String} id The unique reference ID of the current contract
 * @property {boolean} isLocked The lock status of the editable fields
 */
const SectionRequest = props => {
	const [request, setRequest] = useState(props.request);
	const [isLoading, setIsLoading] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [error, setError] = useState(null);
	const [heldState, setHeldState] = useState(false);

	// section content depending on isEditing status
	let content = isEditing ? 
		<p><textarea name="request" rows="10" value={request} onChange={e => setRequest(e.target.value)}></textarea></p>
	:
		<p className="preserve-breaks">{request}</p>

	// on submit, set loading state and store data 
	function handleSubmit() {
		setIsLoading(true);
		
		// save updated data to database
		store(props.id, {
			'request' : request
		})
		.then(data => setHeldState(data))
		.catch(error => setError(error))
		.finally(() => {
			setIsLoading(false);
			setIsEditing(false);
		})
	}

	// on edit close, reset any changes made
	function handleClose() {
		setRequest(heldState ? heldState.request : props.request);
		setIsEditing(false);
	}

	// conditional classes to be applied to the section wrapper 
	let classes = [
		isEditing && 'editing',
		props.isLocked ? 'locked' : 'editable'
	]

	return (
		<section id="request" className={classes.join(' ')} onClick={() => !props.isLocked && (isEditing || setIsEditing(true))}>			<div className="index">
				<BlockNumber number="3" />
			</div>
			<div className="content">
				<h2 className="title">Request <span className="subtitle">- Info &amp; Details</span></h2>
				<div className="body">{content}</div>
			</div>
			{isLoading && <SectionLoader />}
			{isEditing && <SectionEditMenu close={handleClose} save={handleSubmit} />}
		</section>
	)
}
export default SectionRequest;
