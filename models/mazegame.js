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
}

MazeGame.prototype.addGame = function(game, userId) {
	var canCreateGame = true;
	for(var i = 0; i < this.games.length; i++) {
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
		result.push({
			playersMax: this.games[i].playersMax,
			playersNow: this.games[i].players.length,
			roomId: i
		});
	}

	return result;
};

module.exports = MazeGame;