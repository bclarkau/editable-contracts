import React, { useState } from "react";
import moment from 'moment';
import SignatureCanvas from 'react-signature-canvas';
import { BlockNumber, SectionEditMenu, SectionLoader } from './Section';
import { store } from '../store';

export const SectionClientSignature = props => {
	const [name, setName] = useState(props.contact.name);
	const [title, setTitle] = useState(props.contact.title);
	const [email, setEmail] = useState(props.contact.email);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [heldState, setHeldState] = useState(false);
	const [canvas, setCanvas] = useState({});

	let date = props.date ? props.date : Date.now();

	function handleClear() {
		canvas.clear();
		props.setSignature('');
	}

	let dateSigned = props.isLocked ? <span className="date">Signed on {moment(date).format('DD MMM YYYY')}</span> : false;

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
					<button onClick={handleClear}>X</button>
				</span>
		</React.Fragment>
	;

	return (
		<section id="client-signature">
			<div className="index">
				<BlockNumber number="6" />
			</div>
			<div className="content">
				<h2 className="title">Client signature <span className="subtitle">- Name, title &amp; email</span></h2>
				<div className="body columns">
					<p className="filled">
						<span className="bold">{name},</span>
						<span>{title},</span>
						<span className="italic">{email}</span>
					</p>
					<p className="signature prompt">
						<span className="label">Sign here</span>
						{dateSigned}
						{signatureBlock}
					</p>
				</div>
			</div>
		</section>
	)
}
