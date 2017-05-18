const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const KEY = 'RGAPI-80ac7c32-a460-494e-80d4-7f2e7c394535';

const RiotAPI = function() {
	this.BASE_PATH = 'https://na1.api.riotgames.com';

	this.getAccountID = function(summonerName, callback) {
		let req = new XMLHttpRequest();
		let url = this.BASE_PATH
			      + '/lol/summoner/v3/summoners/by-name/'
				  + summonerName + '?api_key=' + KEY;

		//req.open('GET', url, true);
		req.onreadystatechange = function() {
			console.log('readyState', req.readyState);
			if (req.readyState == 4 && req.status == 200) {
				let result = JSON.parse(req.responseText);
				console.log('result', result);
				callback(result['accountId']);
				// return result['accountId'];
			}
		};
		
		req.open('GET', url, true);
		req.send();
	};
};



let r = new RiotAPI();

// var accountId = r.getAccountID('sonataine');
// console.log('accountId', accountId);

var accountId = r.getAccountID('sonataine', console.log);
