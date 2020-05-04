import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import moment from "moment";
import { Header } from './Layout';
import LiveSubmitButton from '../modules/LiveSubmitButton';

// default contract data for demo 
const defaultContract = {
	"event" : {
		"id" : btoa(Math.random()).slice(0, 5),
		"name" : "Web Developer Conference 2020",
		"start" : "2020-02-04",
		"end" : "2020-02-07",
		"venue" : "International Convention Centre Sydney"
	},
	"hotel" : {
		"id" : "H853N",
		"name" : "Meriton Suites Sussex Street",
		"address" : "230-232 Sussex Street",
		"city" : "Sydney",
		"state" : "NSW",
		"country" : "AU",
		"stars" : 5,
		"currency" : "AUD",
		"rooms" : 400
	},
	"request" : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Huius, Lyco, oratione locuples, rebus ipsis ielunior. Sed eum qui audiebant, quoad poterant, defendebant sententiam suam. Istic sum, inquit. Non quam nostram quidem, inquit Pomponius iocans; Aliter enim nosmet ipsos nosse non possumus. Duo Reges: constructio interrete. Nunc ita separantur, ut disiuncta sint, quo nihil potest esse perversius. Sic enim censent, oportunitatis esse beate vivere.\n\nSed tamen enitar et, si minus multa mihi occurrent, non fugiam ista popularia. Nunc haec primum fortasse audientis servire debemus. Et quod est munus, quod opus sapientiae? Inde igitur, inquit, ordiendum est. Scaevola tribunus plebis ferret ad plebem vellentne de ea re quaeri.\n\nQuid nunc honeste dicit? Mihi quidem Antiochum, quem audis, satis belle videris attendere. Partim cursu et peragratione laetantur, congregatione aliae coetum quodam modo civitatis imitantur; Sed haec nihil sane ad rem; Scrupulum, inquam, abeunti; Sed tamen enitar et, si minus multa mihi occurrent, non fugiam ista popularia. Nam Pyrrho, Aristo, Erillus iam diu abiecti. Inde sermone vario sex illa a Dipylo stadia confecimus. Habent enim et bene longam et satis litigiosam disputationem.",
	"allocation" : {
		"start" : "2020-02-02",
		"end" : "2020-02-07",
		"rooms" : [
			{
				"name" : "Single room",
				"rate" : 200,
				"number" : [30, 30, 200, 200, 200, 50]
			},
			{
				"name" : "Double room",
				"rate" : 300,
				"number" : [10, 10, 120, 120, 120, 30]
			}
		]
	},
	"contact" : {
		"name" : "John Smith",
		"title" : "Bookings Manager",
		"email" : "johnsmith@hotel.com"
	},
	"author" : {
		"id" : 123456,
		"name" : "Ben Clark",
		"role" : "admin",
		"title" : "Developer",
		"signature" : "ZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFmUUFBQUNXQ0FZQUFBQW9uWHB2QUFBTkQwbEVRVlI0bk8zZFg0Z2QxUjNBOGU5dU5zM2ZOc1lrTm8yMVNheVM0RjhpVnNWcVRJMEVKVzJ0c1dKS29xVEZ2OVcweHRiWWFtdXRJbGJ4RHhxaUtKRklTMmdqSlFTUlZJUlNDSUZBYUZxMnNBLzdzSDNKVTZCUDk2MHZ2WDA0ZTltWk0yZm16dDI5MmV2ZC9YNWdDSmsvWjg2OWU1a3o1OS92Z0NSSmtpUkpraVJKa2lSSmtpUkpraVJKa2lSSmtpUkpraVJKa2lSSmtpUkpraVJKa2lSSmtpUkpraVJKa2lSSmtpUkpraVJKa2lSSmtpUkpraVJKa2lSSmtpUkpraVJKa2lSSmtpUkpraVJKa2lSSmtpUkpraVJKa2lSSmtpUkpraVJKa2lSSmtpUkpraVJKa2lSSmtpUkpraVJKa2lSSjBpdzFCQXoyT2hPU0pLa3pnOER0d0p2QU1OQUVHc0N5WG1aS2tpVFZzeEI0RUJnbEZPTHhkbDd2c2laSmt0cFpBT3doMU1KVEJYa1RPTkd6M0VtU3BFcHpnQjNBR2ZLRjl6REZXdnBqUGNxalpxNTV3RmI4YlVuU2xOeklSUDk0YXpzRWZHUDgrS0hNL2dhd3FBZDVuR25PQTY0Rk5tRDN4VG9tWGlSUDl6Z3ZrdFNYbGdIdmt5L0l4NEJiTStkc2pvNC9QYzE1bkNubUFQY0FmeVI4eDludnROSERmUFhhbGVTN2Q2eWhTMUlIQm9EN0tQYVQvNWJRaDk2eUVqaEx2ckJmTXEwNTdYK0R3RFpnaFBJeENjMmFhYTBFamdFdmREK2JQYkdFL012Tlo0UVhIMGxTRFJjQVJ5bjJrMThlbmJlZWZIOTZBL2o2OUdWelJyZ1VPRVYxUVY2M21ma0dKbDZ1M2o4WG1aMW1BOEJINUg5ZkszdWFJMG5xSTFzcDFzcVBBSXVqODI1Sm5IZk45R1Z6UnRoQnNlRCtHNkdRWHhYdGY2Wk5XanVqODdlZm15eFBxOTNrUDlPVzNtWkhrdnJEQUtFNVBTNWdYcUxZeEhsL2RNNG94ZHE3eXMwSFBxRDRYVDlMaUxJSDhHNTBiRVZGZXM5RTV6Ym8vMjZQRzhoL3B0LzFOanVTMUIrK0FQeWVZZ0d6TTNQT0FDRWEzTW5vbkkrQUwwMW5adnZjVXVBNCtlL3dER0VXUWN0OTBmRTNLdEo3a2VMZnJkOXJzc3ZKajhzNFJmaU5TcElxREFBSEtSWUszeG8vUGtSb2hrLzE4ejQ0ZnIzcVdVTnh2djVIaEVLKzVjYm8rQmpsVTlZZXBQZzNhZGMwLzNrM2h6Q29ML3VaTHU1cGppU3BUL3lDWXFGd0dIaU5FTzB0TlVEck9ENWtPN1dPZksyekNUd1FuWE1KeFhFSjYwdlNpNXVrVzJNZCtuMVJuR2ZKZjZaN2U1c2RTZW9QMjJnL3VqcTF6ZTFGWnZ0WVhKZzN5RGV4UTJnSkdZbk8yVmlTM2lxS0x3Y25DYkgxKzltdDVEL1RUQmlwTDBubjNMVVVDK3A3RXZ0UzJ4MDl5RysvaWd2enM2UUhFUDR3Yzg0STVTMGc4eWlPWXhnbDlEdjNzMVhrV3lkR01kcWdKTFdWcXVIOWF2ellEc0xVcVZIS0YxODVPczM1N1ZkeFlUNEtYRlJ5N3NqNHVVOVNYWkRGbzkvUEV2cm1lMm1JOEp0cEFwOU04dnA0b09CVm1lTnpDTi9iMHVLbGtqUjdMU1FFS1luN3pNc0d0NjBEbnFCWXFBK1ZuSzhnTHN4UEFPZFhuSDhaWVRwYmxkUWd1S3Vubk5PcGU1SjhuanFONVBaeWRQMGpoSmVhN1lRWGhOYitqN3VVWDBucWV3T0V3anY3OER4TnZiN1h4eWl2UVNsdkZma0lla2VaZXY5MmFoRGNMVk5Nc3h1dXA1aXZ0UjFjLyszRTlSOG45alVKSS80bFNZUm05Ymk1OXNLYTE4NkxycjIxK3ZSWmF3bjVWZW1PTVBYV2pGUVh5VjFUVExNYkxxU1lyeVlUVXg3YldVdDV0MDVxZTd5TGVaZWt2dlU5aWcvSTZ6cTRmbjEwN2VlaHFmZnpaaDd3VnlhK28yR0tJWE1uazJZOGZmREJLYWJaRGFtdW05WldKK3pzL0lyclU5c0k0YnVRcEZudEtvb1B5QjBkcHZHajZQcTZOWHNJTmRRckNBLzY3VXord1h3SElYcGRLekxkY2tMLzZ4aWhwdmdTdlF0ME0waHhUZmpWWFVnM0hnVDMzQ1RUV1F2OEhEaEFpQXI0SE1XcGMzWE5BZjVNZWVGN1Q0MDA5cFZjZTRvUTVqVnVhdi9LSlBNcVNUUEdjdkw5dVUwNmo0czluM3d6OGxucU5TTXZCZlpTYkZZZG8vTUFLTmsrL01NVUE1QzB0czBkcHRzdGNSejh5UmFXV1E5RWFYNUlaeThzNXhGcTgyVUJncHBNYm0zeFZ5dlNheEw2eGF0c1QxelRBQjRpTFB1YTNUOEtmSFVTZVpTa0dXVXVFOU9KV3RzbmRONm4rMWFVeHBOdHpoK2l1R0JJdkhVU216dU9iVjYxL2JpRGRMc2xEb2l5cXd0cHhvUGdqdE5aeThaVzB2M2JxYTJUZE9QSWdxT0VFZnJaZlZXRDR1S3VtOVoySkxIdkdPVmhieVZwVm5tYjRzTzMwd2ZrWFJRZnRGWHpnZGRRWFNOc0ZVNVR1WCsyZVRiZU45MUJieTRnWDNDKzJvVTA0MEZ3WThDeW10Y3VKUjJidjJ3N1NiMWEveERGWnZKVGhCYWcyNk84bGxsRVBocGUxZll5VG8yVUpDQWZlYXpWcExtdXd6VFdVR3d1ZjZMaS9MSzExT04rNExyOTkxdElQK3dQTWxFTHpMWkFuR0Y2QzRGQjh2T2tUM1RoL3ZFZ3VBWWh4bnNkbTBqWHlrOEIrMG0vYU4xY0k5M0ZGS2VTSFNZTWpCc2tQN2p0K3BJMEZwS3VoY2RiZy81ZkxVNlN1aVkxWjduVG11c1hLTmFBUDZhOE5wY3FmSGNTcGpERnJRUjFZc0hIcTQ2MXRvY3o1OXdVSFp0TWYvQlV4QUYzdWpIeVAzNzVxVHM5YlRQRjcrb1FFeTl4Y3lpT0tuK3JScnFyRXRjOXo4UVlpQjJaL1h0TDBsaE8rMWFiMXU5clpZMDhTZEtNdEJYNGxJbnduNms1eTA5MW1PWVF4V2JiTTVSSE92c214WWZ6WnVET2FGK0RlcXUwYmFCWTAyOFFhcUF0OFF2SGFhYTNkcjQ2eXQvYlhVZ3pIZ1MzditaMW02THJQcVVZK0NjZVJIaU05dC9YRlJRSFZHN0xITitRMmY4WjZRaHhGMUZjTWpiZVRoTit4NUkwYTMyZmlZZmlGc0pvOUxoV2ZZak9Sa1l2b3RpOE9rWjVzMis4cUVhVE1JZ3RybWtPVjZTUnRTNlJYaE80TWpvdjdzK2Q3c2gxQjZMN1R6WE9lTnlxTWtLOTZISWJvK3YyVVN4WWR5WFNYdEltM1MwVUYwdkpMdVY2TVJNdmpnM0M3eUIyQ2NVWGd2ZzNzYUh0SjVTa1dTQmJhRDVCZmg1MDY0SFpTY2pSRlJSZkNFNVF2WkxYZm9vUDZyaEEzZ2NzcUhIL3I1SHVBNzR0T205bmRQejVHbWwzVXp4U2U5OGswcGhQYUtMZlNaaGFOaGFsZVZtTk5MSTE1Q2J3NjhRNWV5bitiYXBhU1JZQmIwYlhmRUErUU02eUtML2ZUYVN6bnZhajdLOXAveEVsYVhZb0M4N1JlbkN2N2lDdGl5a1dLb2VwTG9qWFZkeS9sWWU3YTk3L3k0bjdOd21EKzdJdWo0NlBNZjBSeE9KNCtIVUxwaThTQXZURXk1LytJL3IvT3pYU0dpTGZ0eDBIbkJrRVhxUDRmVlpGY2J1Ui9OK2dBZHdiblRPZi9NcG83eWJTV1VsMXpieEpLT3dsU2VQaVZhcXkyNmFhYVN3QzlsQ3NWYjlDKytBdkJ5dnUveDdWcTR0bExTRWRCalFWQUNkdVFYZzRjYzY1ZEUxMC8rRWExMXhIc1F1aXRSMEQvaDd0VzFNanpkMlo4OCtRZi9GYVIzb1EyZ2pwZnU0RkZLT3puU2pKeCt1WmN4b1VwOU10cG41SVYrZVlTOUs0NTBrL0tIZlh1SFlSb1prKzFWLzlhTTM3cDJyVVp3aWp6K3VhVHpINFRaTVFFejBldEhWYjRyeXBybUxXcWJoVjVLV1M4ODRuakxvdm0zZmRJUFJ0eDgzbUIycms0YUxvbWxhdGV5N0Z3Qy9aTGJXNHliVVVCNjM5aHZTQXVkWFJlYWxSN2ZIWWd0Wm5mU3F4ZjRUUXpTSkpzMTdjOU50NmVKWVpKUFROL294MFFUNU1HSnhWeCtMRTlXY3ByNVVQRUpwaWJ5REUrbjRJK0FucG11UlpRaE44TFA2OERjTEx3MWJDeThtN2hPYmdRelUvdzJUOEljckRDY0xjNitzSWd3RmZJWXo0cnFxWnZzZEViUElkMGJHNGlUc2xPNTk3bERBZzcxSGFqeWJmazBsakUvQ242SGk3bDdHNHNJNWZwcTR1dWU5TndLVVYrVHBCNlAvZlFRZ2J1NWt3emZKdVFndk1DNFFYcVVYdHZ4cEo2azlsZzQ0T0VHcnBUeE9hVWc4UUFxQlVMVlg1T0oxTisxcFZrczQ3aEpybjdlUC92a0crejdYT1Z2WlMwYTdBYW0yN092Z2NuYW9USEtWc2U0TlF1ODZLWThBUFU5MFV2YmJtdlY0bjFMVGovVWNKemZ6L2lmYi9rL1lqOWJPL245U0F5NzhrN3ZmVDhXTUR0SC9ScWRyT1lreDNTVE5ZcXNtN2s2MUJhTFpQMVliYldUREZldzhELzBycy8wSEZQZXVFRGQzUHVWMXhiVmVOUEdTM01VTE5lRVZKZXFtQmE4T1VCOS81VHB2N05aZ1lkVjRWTnJlMS9ZOHdGcU9kVkl2TUdjSUkrQTlKOTV2dmlkS28reklTYndld3YxM1NESmRhNDd6T05rTG8zNTNxV3QycFZiT3FDcG9qaEtiaDFuem1lSUJiYXRwVlZ0a0thMDFDcmJNczdHZzN6YVY5MUxNR29hQzdtZll2RjJXTGxaU0Y2WTJqNDJXM2crVG5neThrSGUrK1NXaXh1WlBPWmdpMCt4di9GL2czWWRwYldTdkx6ZFI3RVcwUVdwZXFGbnFScEJsbEJmQUlJWXpuSjRUQ3B0VTAzV29pSFNFMHRUNUc5eCtRSzRIN0NkT21QaVJFS1R0Q2FGN2VUU2cwcmliZG5MK05pZWxOdjZSZXpYb2o0YVhnY1VKdGZpUFRQekJ1TG1FMXVXeXQ5QlNoSU50TVp5dkpRUWlhYzRTSkxwVGpsTmRJQjhtUE5HL2R0K3dGWUNFaFNNd0RoQnI3OVV4K210OU9pdDAycDRBWENaKzdUcXlCVnA3MkVuNnYyZUEwSndtRitDMTAvaDFLMG93MVFIK3NWalZJZitTenpGelNVOEhPdFRuMDVuc2JKTHhzZExNSmZINFgwNUlrU1pJa1NaSWtTWklrU1pJa1NaSWtTWklrU1pJa1NaSWtTWklrU1pJa1NaSWtTWklrU1pJa1NaSWtTWklrU1pJa1NaSWtTWklrU1pJa1NaSWtTWklrU1pJa1NaSWtTWklrU1pJa1NaSWtTWklrU1pJa1NaSWtTWklrU1pJa1NaSWtTWklrU1pJa1NaSWtTWklrU1pJa1NaSWtTWklrU1pJa1NaSWtTWklrU1pJa1NaSWtTWklrU1pJa1NaSWtTWklrU1pJa1NaSWtTWklrU1pJa1NaSWtTWklrU1pJa1NaSWtTWklrU1pJa1NaSWtTWklrU1pJa1NaSWtTWklrU1pJa1NaSWtTWklrU1pJa1NkS2svUi94STJiQ0ZkeTFaUUFBQUFCSlJVNUVya0pnZ2c9PQ=="
	},
	"approved_on" : moment().format()
};

const HomeTemplate = props => {	
	const history = useHistory();
	const [error, setError] = useState(null);

	// add new contract with demo data
	async function handleNew() {
		let newContract = await new Promise((resolve, reject) => {
			fetch(`${window.api_host}/v1/contracts`, {
				crossDomain: true,
				method: 'POST',
				mode: 'cors',
				headers: {
					'Content-Type': 'application/json'
				},
				body : JSON.stringify(defaultContract)
			})
			.then(response => { 
				if (response.ok) {
					return response.json();
				} else {
					throw new Error(response.statusText);
				}
			})
			.then(res => resolve(res)) 
			.catch(error => reject(error))
		});

		// redirect to generated contract
		history.push(`/contract/${newContract.data.ref}`);
	}

	return (
		<div id="editable-contracts" className="home">
			<div id="wrapper">
				<Header />
				<main id="submit">
					<LiveSubmitButton className="submit-button" 
						disabled={false} 
						isLocked={false}
						handleClick={handleNew}>Generate new demo contract</LiveSubmitButton>
				</main>
			</div>
		</div>
	);
}
export default HomeTemplate;