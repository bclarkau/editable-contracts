import React, { useState } from "react";
import SignatureCanvas from 'react-signature-canvas'
import moment from 'moment';

/**
 * Block Number
 * @param {*} props 
 */
export const BlockNumber = props => <div className="block-number">{props.number}</div>

export const SectionEditMenu = props => <div className="menu">
	<button className="save" onClick={props.save}><img src="/assets/images/save.svg" alt="Save" /></button>
	<button className="cancel" onClick={() => props.close(false)}><img src="/assets/images/cancel.svg" alt="Cancel" /></button>
</div>

export const SectionLoader = props => <div className="section-loader"><img src="/assets/images/load.svg" alt="Loading..." /></div>
