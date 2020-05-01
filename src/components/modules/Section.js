import React, { useState } from "react";
import SignatureCanvas from 'react-signature-canvas'
import moment from 'moment';

/**
 * Block Number. Displays a simple div with required class. 
 * 
 * @property {int} number The section number 
 */
export const BlockNumber = props => <div className="block-number">{props.number}</div>

/**
 * Section menu. Displays a set of buttons to handle edit functionality. 
 * 
 * @property {function} save Callback. Saves the changes made to the current section. 
 * @property {function} close Callback. Closes the current section. 
 */
export const SectionEditMenu = props => <div className="menu">
	<button className="save" onClick={props.save}><img src="/assets/images/save.svg" alt="Save" /></button>
	<button className="cancel" onClick={() => props.close(false)}><img src="/assets/images/cancel.svg" alt="Cancel" /></button>
</div>

/**
 * Section loader image. 
 */
export const SectionLoader = () => <div className="section-loader"><img src="/assets/images/load.svg" alt="Loading..." /></div>
