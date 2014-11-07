/**
 * @module MazeGame
 */

var MazeGame = function() {
	/** Array with list of all games. */
    this.games = [];
    /** Array with list of all users. */
    this.users = [];
    /** Array with list of available users. */
    this.availableUsers = [];
    /** Array with user and current game */
    this.usersInGames = [];
}

MazeGame.prototype.addGame = function(game, userId) {
	var canCreateGame = true;
	for(var i = 0; i < this.games.length; i++) {
		if(this.games[i] === undefined) {
			continue;
		}

		if(this.games[i].creator == userId) {
			canCreateGame = false;
		}
	}
	if(canCreateGame) {
		this.games.push(game);
	}
	return canCreateGame;
};

MazeGame.prototype.getListOfGames = function(userId) {
	var result = [];

	for(var i = 0; i < this.games.length; i++) {
		if(this.games[i] === undefined) {
			continue;
		}

		result.push({
			playersMax: this.games[i].playersMax,
			playersNow: this.games[i].players.length,
			roomId: i
		});
	}

	return result;
};

MazeGame.prototype.getGameIndex = function(game) {
	return this.games.indexOf(game);
}

MazeGame.prototype.bindUserToGame = function(user, game) {
	this.usersInGames.push({user: user, game: this.getGameIndex(game)});
	return true;
}

MazeGame.prototype.findGameByUser = function(user) {
	return this.usersInGames.filter(function(obj) {
		if(obj.user == user) {
			return obj 
		}
	})[0]
}

module.exports = MazeGame;