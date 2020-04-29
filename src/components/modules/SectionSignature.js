import React, { useState } from "react";
import moment from 'moment';
import SignatureCanvas from 'react-signature-canvas';
import { BlockNumber, SectionEditMenu, SectionLoader } from './Section';

export const SectionClientSignature = props => {
	const [canvas, setCanvas] = useState({});

	function handleClear() {
		canvas.clear();
		props.setSignature('');
	}

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
