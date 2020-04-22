import React, { useState } from "react";
import { BlockNumber, SectionEditMenu, SectionLoader } from './Section';
import { store } from '../store';

const SectionRequest = props => {
	const [request, setRequest] = useState(props.request);
	const [isLoading, setIsLoading] = useState(false);
	const [isEditing, setIsEditing] = useState(true);
	const [error, setError] = useState(null);

	let classes = [
		isEditing ? 'editing' : 'editable'
	];

	let content = isEditing ? 
		<p><textarea name="request" rows="10" value={request} onChange={e => setRequest(e.target.value)}></textarea></p>
	:
		<p className="preserve-breaks">{request}</p>

	function handleSubmit() {
		setIsLoading(true)
		
		// save updated data to database
		store(props.id, {
			'request' : request
		})
		.then(data => setIsLoading(false))
		.catch(error => setError(error))
		.finally(() => setIsEditing(false))
	}

	function handleClose() {
		setRequest(props.request);
		setIsEditing(false);
	}

	return (
		<section id="request" className={classes.join(' ')} onClick={() => isEditing || setIsEditing(true)}>
			<div className="index">
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
