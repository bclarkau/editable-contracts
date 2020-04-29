import React, { useState, useEffect } from "react";

// Components 
import SectionEvent from '../modules/SectionEvent';
import SectionHotel from '../modules/SectionHotel';
import SectionRequest from '../modules/SectionRequest';
import SectionRooms from '../modules/SectionRooms';
import { SectionClientSignature } from '../modules/SectionSignature';
import FullPageLoader from '../modules/FullPageLoader';
import LiveSubmitButton from '../modules/LiveSubmitButton';
import { Header, Footer } from './Layout';

const ContractTemplate = props => {	
	const ref = props.match.params.ref;

	// Data state
	const [contract, setContract] = useState(null);
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	
	// UI state
	const [signature, setSignature] = useState('');
	const [dialogOpen, setDialogOpen] = useState(false);

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
			if(data.signature) { 
				setSignature(atob(data.signature)) 
			}
		})
		.catch(error => setError(error))
		.finally(() => setIsLoading(false))
	}, []);

	let isLocked = contract && contract.status === 'signed';


	let submitButton = !isLocked ? <div id="submit">
		<LiveSubmitButton className="submit-button" signature={signature} disabled={!signature} id={ref}>Submit signed contract</LiveSubmitButton>
	</div> : false;
	let submitNotice = isLocked && contract.status !== 'approved' ? <div className="notice">Thanks for submitting. {contract.author.name} will review this contract shortly.</div> : false;

	let additional_notes;
	if ( contract ){
		if ( contract.free_title && contract.free_textbox) {
			additional_notes = <SectionFreeText free_title={contract.free_title} free_textbox={contract.free_textbox}/>
		}
	}

	return !isLoading && contract ? (
		<div id="editable-contracts" className={contract.status}>
			<div id="wrapper">
				<Header event={contract.event.mcode} hotel={contract.hotel.id} />

				<main>
					<article className="container">
						<SectionEvent event={contract.event} id={ref} isLocked={isLocked} />
						<SectionHotel hotel={contract.hotel} id={ref} isLocked={isLocked} />
						<SectionRequest request={contract.request} id={ref} isLocked={isLocked} />
						<SectionRooms currency={contract.hotel.currency} allocation={contract.allocation} id={ref} isLocked={isLocked} />
						<SectionClientSignature contact={contract.contact} date={contract.signed_on} isLocked={isLocked} signature={signature} setSignature={setSignature} id={ref} />
						{submitButton}
						{submitNotice}
						<Footer />
					</article>
				</main>
			</div>
		</div>
	) : <FullPageLoader />;
}
export default ContractTemplate;