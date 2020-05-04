import React, { useState } from "react";
import moment from 'moment';
import DatePicker from 'react-datepicker';
import { BlockNumber, SectionEditMenu, SectionLoader } from './Section';
import { store } from '../store';

/**
 * Event details section. Renders an editable field for all displayed data.
 * 
 * @property {object} event The event object 
 * @property {String} id The unique reference ID of the current contract
 * @property {boolean} isLocked The lock status of the editable fields
 */
const SectionEvent = props => {
	const [name, setName] = useState(props.event.name);
	const [venue, setVenue] = useState(props.event.venue);
	const [start, setStart] = useState(props.event.start);
	const [end, setEnd] = useState(props.event.end);
	const [isLoading, setIsLoading] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [error, setError] = useState(null);
	const [heldState, setHeldState] = useState(false);

	// section content depending on isEditing status
	let content = isEditing ? 
		<React.Fragment>
			<input name="name" type="text" value={name} onChange={e => setName(e.target.value)} />
			<input name="venue" type="text" value={venue} onChange={e => setVenue(e.target.value)} />
			<DatePicker name="start" selected={moment(start).toDate()} onChange={date => setStart(date)} />
			<DatePicker name="end" selected={moment(end).toDate()} onChange={date => setEnd(date)} />
		</React.Fragment>
	:
		<React.Fragment>
			<span className="bold">{name},</span>
			<span>{venue},</span>
			<span className="bold">
				{moment(start).format('dddd Do')}&nbsp;
				{moment(start).isSame(end, 'month') ? '' : moment(start).format('MMMM') + ' '}
				{moment(start).isSame(end, 'year') ? '' : moment(start).format('YYYY') + ' '}
				to {moment(end).format('dddd Do MMMM YYYY')}
			</span>
		</React.Fragment>

	// on submit, set loading state and store data 
	function handleSubmit() {
		setIsLoading(true)

		// save updated data to database
		store(props.id, {
			'event' : {
				'name' : name,
				'venue' : venue,
				'start' : start,
				'end' : end	
			}
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
		setName(heldState ? heldState.event.name : props.event.name);
		setVenue(heldState ? heldState.event.venue : props.event.venue);
		setStart(heldState ? heldState.event.start : props.event.start);
		setEnd(heldState ? heldState.event.end : props.event.end);
		setIsEditing(false);
	}

	// conditional classes to be applied to the section wrapper 
	let classes = [
		isEditing && 'editing',
		props.isLocked ? 'locked' : 'editable'
	]

	return (
		<section id="event" className={classes.join(' ')} onClick={() => !props.isLocked && (isEditing || setIsEditing(true))}>
			<div className="index">
				<BlockNumber number="1" />
			</div>
			<div className="content">
				<h2 className="title">Event <span className="subtitle">- Name, venue &amp; dates</span></h2>
				<div className="body">
					<div className="filled">{content}</div>
				</div>
			</div>
			{isLoading && <SectionLoader />}
			{isEditing && <SectionEditMenu close={handleClose} save={handleSubmit} />}
		</section>
	)
}
export default SectionEvent;
