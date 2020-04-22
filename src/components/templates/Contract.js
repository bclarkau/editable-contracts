import React, { useState, useEffect } from "react";
import moment from 'moment';

// Components 
import SectionEvent from '../modules/SectionEvent';
import SectionHotel from '../modules/SectionHotel';
import FullPageLoader from '../modules/FullPageLoader';
import { Header, Footer } from './Layout';
import { BlockNumber } from '../modules/Section';

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