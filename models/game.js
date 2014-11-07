var Game = function(creator, playersMax) {
    this.creator = creator;
    this.playersMax = playersMax;
    this.players = [creator];
    this.started = false;
    this.currentMove = 0;
}

Game.prototype.addPlayer = function(userId) {
	if(this.creator != userId && !this.started) {
		// TODO: check user in players
		this.players.push(userId);
	} else {
		return false;
	}
	return true;
};

Game.prototype.canStart = function() {
	if(this.playersMax == this.players.length) {
		this.started = true;
		return true;
	} else {
		return false;
	}
}

module.exports = Game;