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
			$(".listOfGames span").append("Игра на " + data[i]['playersMax'] + " игрока (уже " + data[i]['playersNow'] + " из " + data[i]['playersMax'] + ") <a href='' class='js-connect' data-id='" + data[i]['roomId'] + "'>Подключиться</a><br>");
		}
	});

	socket.on('startGame', function (data) {
		$('.info').hide();
		$('.game').show();

		$('.userData').find('#roomId').val(data['roomId']);

		makeMove(data);
	});

	socket.on('makeMove', function (data) {
		if(data['userId'] == data['opponentMove']['id']) {
			log('Вы походили на [' + data['opponentMove']['x'] + ';' + data['opponentMove']['y'] + ']');
		} else {
			log('Пользователь ' + data['opponentMove']['id'] + ' походил на [' + data['opponentMove']['x'] + ';' + data['opponentMove']['y'] + ']');
		}
		
		makeMove(data);
	});

	$(document).on('click', '.js-connect', function(){
		var roomId = $(this).data('id');
		socket.emit('connectToGame', { roomId: roomId });
		return false;
	})

	$(document).on('submit', '.js-userData', function(){
		var form = $(this).serializeArray();
		var dataObj = {};
		$(form).each(function(i, field){
			dataObj[field.name] = field.value;
		});
		socket.emit('makeMove', dataObj);
		return false;
	})

	
});

function makeMove(data) {
	$('.userData').find('#roomId').val(data['roomId']);

	if(data['canMove']) {
		$('.currentStatus').html('Ваш ход');
		$('.userData').show();
	} else {
		$('.currentStatus').html('Ход игрока ' + data['movePlayer'] + '. Вы в очереди на ' + data['userId'] + ' месте');
		$('.userData').hide();
	}
}

function log(text) {
	$('.log').append(text + '<br>');
}