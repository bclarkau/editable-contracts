import React, { useState } from "react";
import { BlockNumber, SectionEditMenu, SectionLoader } from './Section';
import { store } from '../store';

/**
 * Hotel details section. Renders an editable field for all displayed data.
 * 
 * @property {object} hotel The hotel object 
 * @property {String} id The unique reference ID of the current contract
 * @property {boolean} isLocked The lock status of the editable fields
 */
const SectionHotel = props => {
	const [name, setName] = useState(props.hotel.name);
	const [address, setAddress] = useState(props.hotel.address);
	const [city, setCity] = useState(props.hotel.city);
	const [state, setState] = useState(props.hotel.state);
	const [country, setCountry] = useState(props.hotel.country);
	const [isLoading, setIsLoading] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [error, setError] = useState(null);
	const [heldState, setHeldState] = useState(false);

	// section content depending on isEditing status
	let content = isEditing ? 
		<React.Fragment>
			<input name="name" type="text" value={name} onChange={e => setName(e.target.value)} />
			<input name="address" type="text" value={address} onChange={e => setAddress(e.target.value)} />
			<input name="city" type="text" value={city} onChange={e => setCity(e.target.value)} />
			<input name="state" type="text" value={state} onChange={e => setState(e.target.value)} />
			<input name="country" type="text" value={country} onChange={e => setCountry(e.target.value)} />
		</React.Fragment>
	:
		<React.Fragment>
			<span className="bold">{name},</span>
			<span>
				{address}
				{city ? ' ' + city : ''}
				{state ? ' ' + state : ''}
				{country ? ' ' + country : ''}
			</span>
		</React.Fragment>

	// on submit, set loading state and store data 
	function handleSubmit() {
		setIsLoading(true)

		// save updated data to database
		store(props.id, {
			'hotel' : { 
				'name' : name,
				'address' : address,
				'city' : city,
				'state' : state,
				'country' : country
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
		setName(heldState ? heldState.hotel.name : props.hotel.name);
		setAddress(heldState ? heldState.hotel.address : props.hotel.address);
		setCity(heldState ? heldState.hotel.city : props.hotel.city);
		setState(heldState ? heldState.hotel.state : props.hotel.state);
		setCountry(heldState ? heldState.hotel.country : props.hotel.country);
		setIsEditing(false);
	}

	// conditional classes to be applied to the section wrapper 
	let classes = [
		isEditing && 'editing',
		props.isLocked ? 'locked' : 'editable'
	]

	return (
		<section id="hotel" className={classes.join(' ')} onClick={() => !props.isLocked && (isEditing || setIsEditing(true))}>			<div className="index">
				<BlockNumber number="2" />
			</div>
			<div className="content">
				<h2 className="title">Hotel <span className="subtitle">- Name &amp; address</span></h2>
				<div className="body">
					<p className="filled">{content}</p>
				</div>
			</div>
			{isLoading && <SectionLoader />}
			{isEditing && <SectionEditMenu close={handleClose} save={handleSubmit} />}
		</section>
	)
}
export default SectionHotel;
