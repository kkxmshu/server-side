$(document).ready(function() {
	var socket = io();

	socket.on('stats', function (data) {
		$('.statBlock').html(data.join('<br>'));
	});

	$('.listOfGames-create').on('click', function() {
		var players = $(this).data('players');
		socket.emit('createGame', { players: players });
	})

	socket.on('listOfGames', function (data) {
		$(".listOfGames span").empty();
		for(var i = 0; i<data.length; i++) {
			$(".listOfGames span").append("Игра на " + data[i]['playersMax'] + " игрока<br>");
		}
	});
});