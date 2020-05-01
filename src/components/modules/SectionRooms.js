import React, { useState, useReducer } from "react";
import { BlockNumber, SectionEditMenu, SectionLoader } from './Section';
import { store } from '../store';
import moment from 'moment';

// update single values inside state depending on fields changed
const allocationReducer = (state, action) => {
	let newState = JSON.parse(JSON.stringify(state)); 

	switch(action.type) {
		// update start and (calculated) end date
		case 'date':
			newState.start = moment(action.date).format('YYYY-MM-DD');
			newState.end = moment(action.date).add(action.total, 'days').format('YYYY-MM-DD');
			return newState;
		// update room name
		case 'room':
			newState.rooms[action.key].name = action.name;
			return newState;
		// add room to list
		case 'addRoom':
			newState.rooms.push({name: '', rate: 0, number: Array.from({length: action.nights}, () => 0)});
			return newState;
		// remove room from list
		case 'removeRoom':
			newState.rooms = state.rooms.filter((value, index) => index != action.index);
			return newState;
		// update room rate
		case 'rate':
			newState.rooms[action.key].rate = action.rate;
			return newState;
		// update block number for a specific room/night
		case 'block':
			newState.rooms[action.key].number[action.index] = action.number;
			return newState;
		// reset to initial state 
		case 'reset':
			return action.initialState; 
		default:
			console.error('Reducer error: Unknown key');
			return state;
	}
};

/**
 * The rooms section shows an editable table of allocation details. 
 * 
 * @property {String} currency The hotel currency
 * @property {object} allocation Contains the start/end date of the event and the room name/rate/block details
 * @property {String} id The unique reference ID of the current contract
 * @property {boolean} isLocked The lock status of the editable fields
 */
export const SectionRooms = props => {
	const [state, dispatch] = useReducer(allocationReducer, props.allocation);
	const [currency, setCurrency] = useState(props.currency);
	const [isLoading, setIsLoading] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [error, setError] = useState(null);
	const [activeRow, setActiveRow] = useState(-1);

	// create the markup for the nights columns
	let nights = getDateRange(state.start, state.end);
	let nightHeaderColumns = nights.map((night, i) => <td className="date" key={i}>
		<AllocationDate date={night} index={i} isEditing={isEditing} callback={e => dispatch({ type: 'date', total: nights.length-1, date: e.target.value })} />
	</td>);

	// on submit, set state and save to database
	function handleSubmit() {
		setIsLoading(true)
		
		// save updated data to database
		store(props.id, {
			'allocation' : state
		})
		.then(data => setIsLoading(false))
		.catch(error => setError(error))
		.finally(() => setIsEditing(false))
	}

	// on edit close, reset any changes made
	function handleClose() {
		dispatch({ type: 'reset', initialState: props.allocation });
		setIsEditing(false);
	}

	// conditional classes to be applied to the section wrapper 
	let classes = [
		isEditing && 'editing',
		props.isLocked ? 'locked' : 'editable'
	]

	return (
		<section id="event" className={classes.join(' ')} onClick={() => !props.isLocked && (isEditing || setIsEditing(true))}>
			<div className="index">
				<BlockNumber number="4" />
			</div>
			<div className="content">
				<h2 className="title">Booking <span className="subtitle">- Rooms &amp; rates per night</span></h2>
				<div className="body">
					<table>
						<thead>
							<tr>
								<td className="name">Room type</td>
								<td className="rate">Rate &sup1;</td>
								{nightHeaderColumns}
							</tr>
						</thead>
						<tbody>
							{state.rooms && state.rooms.map((room, i) => (
								<tr className={activeRow === i ? 'active' : ''} key={i}>
									<td className="name"><RoomName name={room.name} isEditing={isEditing} callback={e => dispatch({ type: 'room', key: i, name: e.target.value })} /></td>
									<td className="rate">
										<RoomRate rate={room.rate} isEditing={isEditing} callback={e => dispatch({ type: 'rate', key: i, rate: e.target.value })} />
										<RoomCurrency currency={currency} isEditing={isEditing} callback={e => setCurrency(e.target.value)} />
									</td>
									{room.number.map((num, j) => <td className="block" key={j}>
										<RoomBlock number={num} isEditing={isEditing} callback={e => dispatch({ type: 'block', key: i, index: j, number: e.target.value })} />
									</td>)}
									{isEditing && <td><button className="remove" onMouseOut={() => setActiveRow(-1)} onMouseOver={() => setActiveRow(i)} onClick={() => dispatch({ type: 'removeRoom', index: i })}>
										<img src="/assets/images/remove.svg" alt="Remove room" />
									</button></td>}
								</tr>
							))}
							{isEditing ? 
								<tr>
									<td colSpan={state.rooms.length + 3}>
										<button className="add" onClick={() => dispatch({ type: 'addRoom', nights: nights.length })}>
											<img src="/assets/images/add.svg" alt="Add room" />
										</button>
									</td>
								</tr>
							: false}
						</tbody>
					</table>
				</div>
			</div>
			{isLoading && <SectionLoader />}
			{isEditing && <SectionEditMenu close={handleClose} save={handleSubmit} />}
		</section>
	)
}
export default SectionRooms;

/**
 * Output a room name field
 * @property {String} name The room name
 * @property {Boolean} isEditing Whether the section is currently in edit mode
 * @property {function} callback The callback used to update room name state
 */
export const RoomName = props => (
	props.isEditing ? <input required name="name" type="text" value={props.name} onChange={props.callback} /> : <span>{props.name}</span>
)

/**
 * Output a room rate field
 * @property {number} rate The room rate
 * @property {Boolean} isEditing Whether the section is currently in edit mode
 * @property {function} callback The callback used to update room rate state
 */
export const RoomRate = props => (
	props.isEditing ? <input required name="rate" type="number" min="0" value={props.rate} onChange={props.callback} /> : <span>{props.rate}</span>
)

/**
 * Output a room currency field
 * @property {String} currency The room currency
 * @property {Boolean} isEditing Whether the section is currently in edit mode
 * @property {function} callback The callback used to update room currency state
 */
export const RoomCurrency = props => (
	props.isEditing ? <input required name="currency" type="text" value={props.currency} onChange={props.callback} /> : <span>&nbsp;{props.currency}</span>
)

/**
 * Output a room block field
 * @property {number} number The number of rooms in the block
 * @property {Boolean} isEditing Whether the section is currently in edit mode
 * @property {function} callback The callback used to update room rate state
 */
export const RoomBlock = props => (
	props.isEditing ? <input required name="block" type="number" min="0" value={props.number} onChange={props.callback} /> : <span>{props.number}</span>
)

/**
 * Output an allocation date field
 * @property {number} index The column index of the date
 * @property {Boolean} isEditing Whether the section is currently in edit mode
 * @property {function} callback The callback used to update allocation date state
 */
export const AllocationDate = props => {
	// only show an input field for the first column
	// other columns dynamically populated
	if(props.isEditing && props.index === 0) {
		return <input required name="date" type="date" value={props.date.format('YYYY-MM-DD')} onChange={props.callback} />
	}
	return <span>{props.date.format('D MMM')}</span>;
}

/**
 * Create an array of moment date objects based on start/end dates
 * @param {String} start The start date
 * @param {String} end The end date
 */
function getDateRange(start, end) {
	var nights = [];
	var startDate = moment(start);
	var endDate = moment(end);
	while(startDate <= endDate) {
		nights.push( moment(startDate) );
		startDate = moment(startDate).add(1, 'days');
	}
	return nights;
}