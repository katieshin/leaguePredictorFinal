const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

const KEY = 'RGAPI-d4c340ce-9ecd-49cf-86df-e04e35ea3ce5';

const RiotAPI = function() {
	this.BASE_PATH = 'https://na1.api.riotgames.com';
	
	this.getAccountID = function(summonerName) {
		let req = new XMLHttpRequest();
		req.open('GET', this.BASE_PATH + 
			'/lol/summoner/v3/summoners/by-name/' + 
			summonerName + '?api_key=' + KEY, false);
		req.send();
		
		let header = req.getResponseHeader("X-Rate-Limit-Count");
		console.log('header', header);

		let res = JSON.parse(req.responseText);
		return res['accountId'];
	};

	this.getMatchHistory = function(accountId) {
		// let matchHist = {};
		let matchHist = [];
		
		let req = new XMLHttpRequest();
		req.open('GET', this.BASE_PATH + 
			 '/lol/match/v3/matchlists/by-account/' + 
				 accountId + '?api_key=' + KEY, false); 
	  req.send();
		
		let header = req.getResponseHeader("X-Rate-Limit-Count");
		console.log(header);

		let res = JSON.parse(req.responseText);
		let matches = res['matches'];
		// console.log('matches', matches);
		
		for (let i = 0; i < matches.length; i++) {
			matchHist.push({ 'gameId': matches[i]['gameId'], 
											 'champion': matches[i]['champion'], 
											 'lane': matches[i]['lane'] });
		}
		
		return matchHist;
	};
	
	this.getChampionHistory = function(matchHist, championId) {
		// console.log('matchHist', matchHist);
		return matchHist.filter(match => (championId === match['champion']));
	};
	
	this.getMatchInfo = function(gameId, accountId) {
		let matchInfo = {};

		let req = new XMLHttpRequest();
		req.open('GET', this.BASE_PATH +
			'/lol/match/v3/matches/' + gameId + '?api_key=' + KEY, false);
		req.send();
		
		let header = req.getResponseHeader("X-Rate-Limit-Count");
		console.log(header);
    
		let res = JSON.parse(req.responseText);
		let participantIdentities = res['participantIdentities'];
		let participants = res['participants'];
		let participantId;
		let stats;

		for (let i = 0; i < participantIdentities.length; i++) {
			if (participantIdentities[i]['player']['accountId'] == accountId) {
				participantId = participantIdentities[i]['participantId'];
			}
		}

		for (let i = 0; i < participants.length; i++) {
			if (participants[i]['participantId'] == participantId) {
				stats = participants[i]['stats'];
			}
		}
		
		let playerInfo = {};
		
		// playerInfo['win'] = stats['win'];
		playerInfo['kills'] = stats['kills'];
		playerInfo['deaths'] = stats['deaths'];
		playerInfo['assists'] = stats['assists'];
		playerInfo['goldEarned'] = stats['goldEarned'];
		playerInfo['totalMinionsKilled'] = stats['totalMinionsKilled'];
		playerInfo['neutralMinionsKilled'] = stats['neutralMinionsKilled'];
		playerInfo['wardsPlaced'] = stats['wardsPlaced'];
		
		return playerInfo;
	};
	
	this.getAggregatePLayerChampionData = function(accountId, championId) {
		let matchHist = this.getMatchHistory(accountId);
		console.log('matchHist', matchHist);
		let champHist = this.getChampionHistory(matchHist, championId);
		console.log('champHist', champHist);
		let playerInfos = [];
		
		champHist.forEach(match => {
			let matchInfo = this.getMatchInfo(match['gameId'], accountId);
			console.log('matchInfo', matchInfo);
			playerInfos.push(matchInfo);
		});
		
		playerInfos.reduce((sums, curr) => {
			return { 'kills': sums['kills'] + curr['kills'], 
							 'deaths': sums['deaths'] + curr['deaths'],
							 'assists': sums['assists'] + curr['assists'],
							 'goldEarned': sums['goldEarned'] + curr['goldEarned'],
							 'totalMinionsKilled': sums['totalMinionsKilled'] + 
																			curr['totalMinionsKilled'],
							 'neutralMinionsKilled': sums['neutralMinionsKilled'] + 
																				curr['neutralMinionsKilled'],
							 'wardsPlaced': sums['wardsPlaced'] + curr['wardsPlaced']};
		}, {'kills': 0, 'deaths': 0, 'assists': 0, 'goldEarned': 0, 'totalMinionsKilled': 0, 
				'neutralMinionsKilled': 0, 'wardsPlaced': 0});
		
		for (let value of playerInfos.values()) {
			values /= matchHist.length;
		}
		
		return playerInfos;
	};
	
	this.generateCSV = function(playerData) {
		// return csv
	};
};

let r = new RiotAPI();

let accountId = r.getAccountID('sonataine');
// console.log('accountId', accountId);
let matchHist = r.getMatchHistory(accountId);
let champMatch = r.getChampionHistory(matchHist, 60);
// console.log('champMatch', champMatch);
let match = matchHist[0];
let pi = r.getMatchInfo(match['gameId'], accountId);
// console.log(pi);

let aggr = r.getAggregatePLayerChampionData(accountId, 60);
console.log('aggr', aggr);
