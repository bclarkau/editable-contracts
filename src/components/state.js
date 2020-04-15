/**
 * Save a contract
 * @param {int} 		id 			The contract ID
 * @param {Object} 		data 		The data to save to the database
 * @param {Integer} 	author 		The author ID
 * @param {Boolean} 	noAuth 		Whether this is a publically accessible endpoint or not
 */
export async function saveContractSetting(id, data, author, noAuth=false) {
	// console.info(`Saving contract #${id}:`, data, author, noAuth);
	let endpoint = noAuth ? 'sign' : 'edit';

	return new Promise((resolve, reject) => {
		fetch(`${window.api_host}/v2/contracts/${endpoint}`, {
			crossDomain: true,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id : id,
				data : data,
				author : author
			})
		})
		.then(response => { 
			if (response.ok) {
				resolve();
			} else {
				throw new Error(response.statusText);
			}
		})
		.catch(error => {
			console.error(error);
			reject();
		});
	});
}

/**
 * Save a master agreement
 * @param {int} 		id 			The master agreement ID
 * @param {Object} 		data 		The data to save to the database
 * @param {Integer} 	author 		The author ID
 * @param {Boolean} 	noAuth 		Whether this is a publically accessible endpoint or not
 */
export async function saveMasterAgreementSetting(id, data, author, noAuth=false) {
	// console.info(`Saving master agreement #${id}:`, data, author, noAuth);
	let endpoint = noAuth ? 'sign' : 'edit';

	return new Promise((resolve, reject) => {
		fetch(`${window.api_host}/v2/masteragreements/${endpoint}`, {
			crossDomain: true,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id : id,
				data : data,
				author : author
			})
		})
		.then(response => { 
			if (response.ok) {
				resolve();
			} else {
				throw new Error(response.statusText);
			}
		})
		.catch(error => {
			console.error(error);
			reject();
		});
	});
}
