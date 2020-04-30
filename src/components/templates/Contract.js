import React, { useState, useEffect } from "react";

// Components 
import SectionEvent from '../modules/SectionEvent';
import SectionHotel from '../modules/SectionHotel';
import SectionRequest from '../modules/SectionRequest';
import SectionRooms from '../modules/SectionRooms';
import { SectionCompanySignature, SectionClientSignature } from '../modules/SectionSignature';
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
	const [isLocked, setIsLocked] = useState(false);

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
			setIsLocked(data.status === 'signed');
			if(data.signature) { 
				setSignature(atob(data.signature)) 
			}
		})
		.catch(error => setError(error))
		.finally(() => setIsLoading(false))
	}, [isLocked]);

	return !isLoading && contract ? (
		<div id="editable-contracts" className={contract.status}>
			<div id="wrapper">
				<Header event={contract.event.code} hotel={contract.hotel.id} />
				<main>
					<article className="container">
						<SectionEvent event={contract.event} id={ref} isLocked={isLocked} />
						<SectionHotel hotel={contract.hotel} id={ref} isLocked={isLocked} />
						<SectionRequest request={contract.request} id={ref} isLocked={isLocked} />
						<SectionRooms currency={contract.hotel.currency} allocation={contract.allocation} id={ref} isLocked={isLocked} />
						<SectionCompanySignature author={contract.author} date={contract.approved_on} isLocked={true} />
						<SectionClientSignature contact={contract.contact} date={contract.signed_on} isLocked={isLocked} signature={signature} setSignature={setSignature} id={ref} />
						<div id="submit">
							<LiveSubmitButton className="submit-button" 
								signature={signature}
								disabled={!signature && contract.status !== 'signed'} 
								isLocked={isLocked}
								setIsLocked={setIsLocked}
								postLabel={`Thanks! ${contract.author.name} will review this contract shortly.`} 
								id={ref}>Submit signed contract</LiveSubmitButton>
						</div>
						<Footer />
					</article>
				</main>
			</div>
		</div>
	) : <FullPageLoader />;
}
export default ContractTemplate;