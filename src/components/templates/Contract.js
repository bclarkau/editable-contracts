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
						<SectionEvent event={contract.event} />
						<SectionHotel hotel={contract.hotel} />
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
	return (
		<section id="event">
			<div className="index">
				<BlockNumber number="1" />
			</div>
			<div className="content">
				<h2 className="title">Event <span className="subtitle">- Name, venue &amp; dates</span></h2>
				<div className="body">
					<p className="filled">
						<strong className="highlight">{props.event.name},</strong>
						<span>{props.event.venue},</span>
						<strong>
							{moment(props.event.start).format('dddd Do')}&nbsp;
							{moment(props.event.start).isSame(props.event.end, 'month') ? '' : moment(props.event.start).format('MMMM') + ' '}
							{moment(props.event.start).isSame(props.event.end, 'year') ? '' : moment(props.event.start).format('YYYY') + ' '}
							to {moment(props.event.end).format('dddd Do MMMM YYYY')}
						</strong>
					</p>
				</div>
			</div>
		</section>
	)
}

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
