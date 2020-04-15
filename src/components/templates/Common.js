import React, { useState } from "react";
import SignatureCanvas from 'react-signature-canvas'
import moment from 'moment';

/**
 * Block Number
 * @param {*} props 
 */
export const BlockNumber = props => <div className="block-number">{props.number}</div>
