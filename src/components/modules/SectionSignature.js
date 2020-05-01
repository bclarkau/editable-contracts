import React, { useState } from "react";
import moment from 'moment';
import SignatureCanvas from 'react-signature-canvas';
import { BlockNumber } from './Section';

/**
 * Company signature section. Renders the contract author name and their signature.
 * 
 * @property {object} author The author object 
 * @property {String} date The date the contract was approved by the author 
 * @property {boolean} isLocked The lock status of the editable fields
 */
export const SectionCompanySignature = props => {
	return (
		<section id="company-signature">
			<div className="index">
				<BlockNumber number="5" />
			</div>
			<div className="content">
				<h2 className="title">Company signature <span className="subtitle">- Name &amp; title</span></h2>
				<div className="body columns">
					<div className="filled">
						<div className="bold">{props.author.name}</div>
						<div>{props.author.title}</div>
					</div>
					<div className='signature prompt locked'>
						<img src={atob(props.author.signature)} />
						{props.isLocked && props.date ? <span className="date">Approved on {moment(props.date).format('DD MMM YYYY')}</span> : false}
					</div>
				</div>
			</div>
		</section>
	)
}

/**
 * Client signature section. Renders the contact's details and a signature field.
 * 
 * @property {object} contact The contact object 
 * @property {String} date The date the contract was signed by the client 
 * @property {boolean} isLocked The lock status of the editable fields
 * @property {String} signature The clients signature as Data URI image 
 * @property {function} setSignature Callback. Sets the signature state in the parent
 * @property {String} id The unique reference ID of the current contract
 */
export const SectionClientSignature = props => {
	const [canvas, setCanvas] = useState({});

	// clear the canvas and signature state 
	function handleClear() {
		canvas.clear();
		props.setSignature('');
	}

	// signature block content depending on isLocked status
	let signatureBlock = props.isLocked ? 
		<img src={props.signature} />
	: 
		<React.Fragment>
			<SignatureCanvas 
				canvasProps={{className: 'sig-canvas'}} 
				velocityFilterWeight={1}
				maxWidth={1.5}
				minWidth={0.2}
				onEnd={(e) => props.setSignature(canvas.toDataURL())}
				ref={(ref) => setCanvas(ref)} />
				<span className="action">
					<button onClick={handleClear}><img src="/assets/images/delete.svg" alt="X" /></button>
				</span>
		</React.Fragment>
	;

	// conditional classes to be applied to the signature block
	let classes = [
		'signature',
		'prompt',
		props.isLocked && 'locked'
	];

	return (
		<section id="client-signature">
			<div className="index">
				<BlockNumber number="6" />
			</div>
			<div className="content">
				<h2 className="title">Client signature <span className="subtitle">- Name, title &amp; email</span></h2>
				<div className="body columns">
					<div className="filled">
						<div className="bold">{props.contact.name}</div>
						<div>{props.contact.title}</div>
						<div className="italic">{props.contact.email}</div>
					</div>
					<div className={classes.join(' ')}>
						{!props.isLocked ? <span className="label">Sign here</span> : false}
						{signatureBlock}
						{props.isLocked && props.date ? <span className="date">Signed on {moment(props.date).format('DD MMM YYYY')}</span> : false}
					</div>
				</div>
			</div>
		</section>
	)
}
