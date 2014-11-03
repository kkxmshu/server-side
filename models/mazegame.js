/**
 * @module MazeGame
 */

var MazeGame = function() {
	/** Array with list of all games. */
    this.games = [];
    /** Array with list of all users. */
    this.users = [];
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

MazeGame.prototype.getListOfGames = function(game) {
	return this.games;
};

module.exports = MazeGame;