import React, { Component } from 'react';

// UI
import Typography from '@material-ui/core/Typography';

/**
 * Mini component to split a sentence into separate words
 * Useful for displaying an inline form with flex items
 * 
 * @prop {string}	sentence		- a sentence to split 
 * 
 * @example <SplitSentence sentence="I am a sentence" />
 */
class SplitSentence extends Component {
	constructor(props) {
		super(props);
		this.split = props.sentence ? props.sentence.split(' ') : [];
	}

	render() {
		return this.split.map((word, i) => {
			return <Typography key={i} {...this.props}>{word}</Typography>;
		});
	}
}
export default SplitSentence;