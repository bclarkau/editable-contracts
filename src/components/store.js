/**
 * Save a contract
 * @param {String} 		ref 		The contract reference ID
 * @param {Object} 		data 		The data to save to the database
 */
export async function store(id, data) {
	// console.info(`Saving contract #${id}:`, data);

	return new Promise((resolve, reject) => {
		fetch(`${window.api_host}/v1/contract/${id}`, {
			crossDomain: true,
			method: 'PATCH',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			},
			body : JSON.stringify(data)
		})
		.then(response => { 
			if (response.ok) {
				return response.json();
			} else {
				throw new Error(response.statusText);
			}
		})
		.then(contract => resolve(contract.data))
		.catch(error => {
			console.error(error);
			reject();
		});
	});
}
