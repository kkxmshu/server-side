/**
 * @module MazeGame
 */

var MazeGame = function() {
	// Objects of all games
	this.games = [];

	// IDs of all users
	this.users = [];

	// IDs of availiable users
	this.usersAvailable = []; 

	// IDs of users in game
	this.usersInGames = [];
}

/**
 * Adding user ID to array with all users in online.
 *
 * @param user ID
 * @returns first unvisited cell or -1 if there is no unvisited cells
 */
MazeGame.prototype.onConnect = function(userID) {
	this.users.push(userID);
	this.usersAvailable.push(userID);
};

/**
 * Remove user from active users on disconnect.
 *
 * @param user ID
 */
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

/**
 * Creating empty room.
 *
 * @param game object
 * @param user ID
 */
MazeGame.prototype.createGame = function(game, userID) {
	if(this.usersAvailable.indexOf(userID) !== -1) {
		this.games.push(game);
		this.usersAvailable.splice(this.usersAvailable.indexOf(userID), 1);
		this.bindUserToGame(userID, game);
		return true;
	}
	return false;
};

/**
 * Join user to game
 *
 * @param user ID
 * @param game ID
 */
MazeGame.prototype.signToGame = function(userID, gameID) {
	if(this.usersAvailable.indexOf(userID) !== -1) {
		this.usersAvailable.splice(this.usersAvailable.indexOf(userID), 1);
		this.bindUserToGame(userID, this.games[gameID]);
		this.games[gameID].addPlayer(userID);
	};
};

/**
 * Remove user from active games and from list of users
 *
 * @param user ID
 */
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

/**
 * Binding user to game
 *
 * @param user ID
 * @param game object
 */
MazeGame.prototype.bindUserToGame = function(userID, game) {
	this.usersInGames.push({user: userID, game: game});
	return true;
};

/**
 * List of all games
 *
 * @returns object with list of all games
 */
MazeGame.prototype.getListOfGames = function() {
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

/**
 * Get game index by ID of game
 *
 * @param game object
 * @returns game index
 */
MazeGame.prototype.getGameIndex = function(game) {
	return this.games.indexOf(game);
}


/**
 * Get game object by user ID
 *
 * @param user id
 * @returns game object
 */
MazeGame.prototype.findGameByUser = function(userID) {
	return this.usersInGames.filter(function(obj) {
		if(obj.user == userID) {
			return obj
		}
	})[0]
}

module.exports = MazeGame;