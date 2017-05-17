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
		
		let res = JSON.parse(req.responseText);
		return res['accountId'];
	};

	this.getMatchHistory = function(accountId) {
		// let matchHist = {};
		matchHist = [];
		
		let req = new XMLHttpRequest();
		req.open('GET', this.BASE_PATH + 
			 '/lol/match/v3/matchlists/by-account/' + 
				 accountId + '?api_key=' + KEY, false); 
	  req.send();

		let res = JSON.parse(req.responseText);
		let matches = res['matches'];
		
		for (let i = 0; i < matches.length; i++) {
			matchHist.push({ 'gameId': matches[i]['gameId'], 
											 'champion': matches[i]['champion'], 
											 'lane': matches[i]['lane'] });
		}
		
		return matchHist;
	};
	
	this.getChampionHistory = function(histList, championId) {
		return histList.filter(match => (champion === histList['champion']));
	};
	
	this.getMatchInfo = function(gameId, accountId) {
		let matchInfo = {};

		let req = new XMLHttpRequest();
		req.open('GET', this.BASE_PATH +
			'/lol/match/v3/matches/' + gameId + '?api_key=' + KEY, false);
		req.send();
    
		let res = JSON.parse(req.responseText);
		console.log('res', res);
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
		
		playerInfo['win'] = stats['win'];
		playerInfo['kills'] = stats['kills'];
		playerInfo['deaths'] = stats['deaths'];
		playerInfo['assists'] = stats['assists'];
		playerInfo['goldEarned'] = stats['goldEarned'];
		playerInfo['totalMinionsKilled'] = stats['totalMinionsKilled'];
		playerInfo['neutralMinionsKilled'] = stats['neutralMinionsKilled'];
		playerInfo['wardsPlaced'] = stats['wardsPlaced'];
		
		return playerInfo;
	};
	
	this.getAggregatePlayerData = function(accountId) {
		let matchHist = this.getMatchHistory(accountId);
		let playerInfos = [];
		
		matchHist.forEach(match => {
			playerInfos.push(this.getMatchInfo(match));
		});
		
		// take find sum over all games on that specific champion
	};
	
	this.generateCSV = function(playerData) {
		// return csv
	};
};

let r = new RiotAPI();

let accountId = r.getAccountID('sonataine');
let gameId = r.getMatchHistory(accountId)[0];
let pi = r.getMatchInfo(gameId, accountId);

console.log(pi);
