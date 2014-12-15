/**
 * @module MazeGame
 */

var MazeGame = function() {
	this.games = []; // Массив всех игр
	this.users = []; // Массив всех пользователей
	this.usersAvailable = []; // Масив со всеми свободными пользователями
	this.usersInGames = []; // Массив пользователей, которые сейчас играют
}

MazeGame.prototype.onConnect = function(userID) {
	this.users.push(userID);
	this.usersAvailable.push(userID);
};

MazeGame.prototype.onDisconnect = function(userID) {
	this.users.splice(this.users.indexOf(userID), 1);

	if(this.usersAvailable.indexOf(userID) !== undefined) {
		var currentGame = this.findGameByUser(userID);
		if(currentGame !== undefined) {
			currentGame['game'].removeUser(userID);
			if(currentGame['game'].getCurrentPlayers() == 0) {
				this.games.splice(this.games.indexOf(currentGame['game']), 1);
				currentGame = undefined;
			}
		}
	} else {
		this.usersAvailable.splice(this.usersAvailable.indexOf(userID), 1);
	}
};

MazeGame.prototype.createGame = function(game, userID) {
	if(this.usersAvailable.indexOf(userID) !== -1) {
		this.games.push(game);
		this.usersAvailable.splice(this.usersAvailable.indexOf(userID), 1);
		this.bindUserToGame(userID, game);
		return true;
	}
	return false;
};

MazeGame.prototype.signToGame = function(userID, gameID) {
	if(this.usersAvailable.indexOf(userID) !== -1) {
		this.usersAvailable.splice(this.usersAvailable.indexOf(userID), 1);
		this.bindUserToGame(userID, this.games[gameID]);
		this.games[gameID].addPlayer(userID);
	};
};

MazeGame.prototype.exitFromGame = function(userID) {
	this.usersAvailable.push(userID);

	var currentGame = this.findGameByUser(userID);
	if(currentGame !== undefined) {
		currentGame['game'].removeUser(userID);
		if(currentGame['game'].getCurrentPlayers() == 0) {
			this.games.splice(this.games.indexOf(currentGame['game']), 1);
			currentGame = undefined;
		};
	};


};

MazeGame.prototype.bindUserToGame = function(userID, game) {
	this.usersInGames.push({user: userID, game: game});
	return true;
};

MazeGame.prototype.getListOfGames = function(userId) {
	var result = [];

	this.games.forEach(function(element, index, array) {
		result.push({
			playersMax: element['playersMax'],
			playersNow: element.getCurrentPlayers(),
			roomId: index
		});
	});

	return result;
};

MazeGame.prototype.getGameIndex = function(game) {
	return this.games.indexOf(game);
}

MazeGame.prototype.findGameByUser = function(user) {
	return this.usersInGames.filter(function(obj) {
		if(obj.user == user) {
			return obj
		}
	})[0]
}

module.exports = MazeGame;