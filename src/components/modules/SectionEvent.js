import React, { useState } from "react";
import moment from 'moment';
import { BlockNumber, SectionEditMenu, SectionLoader } from '../modules/Section';
import { store } from '../store';

const SectionEvent = props => {
	const [name, setName] = useState(props.event.name);
	const [venue, setVenue] = useState(props.event.venue);
	const [start, setStart] = useState(props.event.start);
	const [end, setEnd] = useState(props.event.end);
	const [isLoading, setIsLoading] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [error, setError] = useState(null);

	let classes = [
		isEditing ? 'editing' : 'editable'
	];

	let content = isEditing ? 
		<React.Fragment>
			<input name="name" type="text" value={name} onChange={e => setName(e.target.value)} />
			<input name="venue" type="text" value={venue} onChange={e => setVenue(e.target.value)} />
			<input name="start" type="date" value={start} onChange={e => setStart(e.target.value)} />
			<input name="end" type="date" value={end} onChange={e => setEnd(e.target.value)} />
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
		.then(data => setIsLoading(false))
		.catch(error => setError(error))
		.finally(() => setIsEditing(false))
	}

	function handleClose() {
		setName(props.event.name);
		setVenue(props.event.venue);
		setStart(props.event.start);
		setEnd(props.event.end);
		setIsEditing(false);
	}

	return (
		<section id="event" className={classes.join(' ')} onClick={() => isEditing || setIsEditing(true)}>
			<div className="index">
				<BlockNumber number="1" />
			</div>
			<div className="content">
				<h2 className="title">Event <span className="subtitle">- Name, venue &amp; dates</span></h2>
				<div className="body">
					<p className="filled">{content}</p>
				</div>
			</div>
			{isLoading && <SectionLoader />}
			{isEditing && <SectionEditMenu close={handleClose} save={handleSubmit} />}
		</section>
	)
}
export default SectionEvent;
