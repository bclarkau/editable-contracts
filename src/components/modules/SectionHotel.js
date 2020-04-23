import React, { useState } from "react";
import { BlockNumber, SectionEditMenu, SectionLoader } from '../modules/Section';

const SectionHotel = props => {
	const [name, setName] = useState(props.hotel.name);
	const [address, setAddress] = useState(props.hotel.address);
	const [city, setCity] = useState(props.hotel.city);
	const [state, setState] = useState(props.hotel.state);
	const [country, setCountry] = useState(props.hotel.country);
	const [isLoading, setIsLoading] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [error, setError] = useState(null);

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
		.then(data => setIsLoading(false))
		.catch(error => setError(error))
		.finally(() => setIsEditing(false))
	}

	function handleClose() {
		setName(props.hotel.name);
		setAddress(props.hotel.address);
		setCity(props.hotel.city);
		setState(props.hotel.state);
		setCountry(props.hotel.country);
		setIsEditing(false);
	}

	return (
		<section id="hotel" className={isEditing ? 'editing' : 'editable'} onClick={() => isEditing || setIsEditing(true)}>
			<div className="index">
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
