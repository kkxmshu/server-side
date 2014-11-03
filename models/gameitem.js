var GameItem = function(creator, playersMax) {
    this.creator = creator;
    this.playersMax = playersMax;
    this.players = [];
    this.started = false;
}

module.exports = GameItem;