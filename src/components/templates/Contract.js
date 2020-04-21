import React, { useState, useEffect } from "react";
import moment from 'moment';
import { saveContractSetting } from '../state.js';

// Components 
import FullPageLoader from '../modules/FullPageLoader';
import { AvsAnSimple } from '../modules/AvsAn';
import { BlockNumber } from './Common';

const ContractTemplate = props => {	
	const ref = props.match.params.ref;

	// Data state
	const [auth, setAuth] = useState(true);
	const [contract, setContract] = useState(null);
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	
	// UI state
	const [bookingURL, setBookingURL] = useState('');
	const [signature, setSignature] = useState('');
	const [dialogOpen, setDialogOpen] = useState(false);
	const [isLocked, setIsLocked] = useState(false);
	const [isReadyToSubmit, setIsReadyToSubmit] = useState(false);

	/** Fetch the contract from database by reference ID and add to component state */
	useEffect(() => {
		fetch(`${window.api_host}/v1/contract/${ref}`, {
			crossDomain: true,
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			},
			// body : JSON.stringify({ 'ref' : ref })
		})
		.then(response => { 
			if (response.ok) {
				return response.json();
			} else {
				throw new Error(response.statusText);
			}
		})
		.then(data => {
			setContract(data);
			if(data.signature) { setSignature(data.signature) }
		})
		.catch(error => setError(error))
		.finally(() => setIsLoading(false))
	}, []);

	let isPart1Ready = !!signature;
	let isPart2Ready = !!bookingURL;

	// let submitButton = !isLocked ? <SectionSubmit ready={isPart1Ready} label="Submit signed contract" setDialogOpen={setDialogOpen} /> : false;
	let submitNotice = isLocked && contract.status !== 'approved' ? <Notice text={"Thanks for submitting. " + contract.author.firstName + " will review this contract shortly."} /> : false;

	let additional_notes;
	if ( contract ){
		if ( contract.free_title && contract.free_textbox) {
			additional_notes = <SectionFreeText free_title={contract.free_title} free_textbox={contract.free_textbox}/>
		}
	}	

	return !isLoading && contract ? (
		<div id="editable-contracts">
			<div id="wrapper">
				<Header event={contract.event.mcode} hotel={contract.hotel.id} />

				<main>
					<article className="container">
						<SectionEvent event={contract.event} id={ref} />
						<SectionHotel hotel={contract.hotel} id={ref} />
						<Footer />
					</article>
				</main>
			</div>
		</div>
	) : <FullPageLoader />;
}
export default ContractTemplate;

export const Header = props => {
	return (
		<header>
			<div className="container">
				<div className="brand">
					<div className="brand__logo">benclark.dev</div>
					<div className="brand__slogan">Editable contracts demo</div>
				</div>
				<div className="title">
					<h1 className="name">
						<span className="name__line1">Hotel</span>
						<span className="name__line2">Contract</span>
					</h1>
					<div className="qrcode">
						<div className="qrcode__image"><img src={`https://api.qrserver.com/v1/create-qr-code/?data=http://localhost:8080/contract/9141226e-0bf9-443c-a9f9-b058ffe3ba8c`} /></div>
					</div>
				</div>
			</div>
		</header>
	)
}

export const Footer = props => {
	return (
		<footer>
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. At nemo nihil fugit quisquam magnam consectetur sapiente 
			deserunt accusantium veniam eaque ad ullam fuga, reprehenderit animi sit similique repellendus. Possimus, similique.
		</footer>
	)
}

export const SectionEvent = props => {
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

	async function handleSubmit() {
		await setIsLoading(true)

		await fetch(`${window.api_host}/v1/contract/${props.id}/event`, {
			crossDomain: true,
			method: 'PATCH',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			},
			body : JSON.stringify({ 
				'name' : name,
				'venue' : venue,
				'start' : start,
				'end' : end	
			})
		})
		.then(response => { 
			if (response.ok) {
				return response.json();
			} else {
				throw new Error(response.statusText);
			}
		})
		.then(data => setIsLoading(false))
		.catch(error => setError(error))
		.finally(() => setIsEditing(false))
	}

	async function handleClose() {
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

export const SectionEditMenu = props => <div className="menu">
	<button className="save" onClick={props.save}><img src="/assets/images/save.svg" alt="Save" /></button>
	<button className="cancel" onClick={() => props.close(false)}><img src="/assets/images/cancel.svg" alt="Cancel" /></button>
</div>

export const SectionLoader = props => <div className="section-loader"><img src="/assets/images/load.svg" alt="Loading..." /></div>

export const SectionHotel = props => {
	return (
		<section id="hotel">
			<div className="index">
				<BlockNumber number="2" />
			</div>
			<div className="content">
				<h2 className="title">Hotel <span className="subtitle">- Name &amp; address</span></h2>
				<div className="body">
					<p className="filled">
						<strong>{props.hotel.name},</strong>
						<span>
							{props.hotel.address}
							{props.hotel.city ? ' ' + props.hotel.city : ''}
							{props.hotel.state ? ' ' + props.hotel.state : ''}
							{props.hotel.country ? ' ' + props.hotel.country : ''}
						</span>
					</p>
				</div>
			</div>
		</section>
	)
}
