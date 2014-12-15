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
		$('.userData').find('#moveCurrent').val(data['moveCurrent']);

		$('.userInfo').html('Текущий раунд — ' + data['moveCurrent']);

		makeMove(data);
	});

	socket.on('someUserDoMove', function (data) {
		if(data['userId'] == data['moveInfo']['userID'] && data['isCorrect']) {
			log('Вы походили на [' + data['moveInfo']['x'] + ';' + data['moveInfo']['y'] + ']');
		} else if(data['isCorrect']) {
			log('Пользователь ' + data['moveInfo']['userID'] + ' походил на [' + data['moveInfo']['x'] + ';' + data['moveInfo']['y'] + ']');
		} else if(data['isWinner']) {
			log('Никого не осталось в комнате. Вы победили.');
		} else {
			log('Пользователь ' + data['moveInfo']['userID'] + ' не успел походить и его было выкинуто из комнаты');
		}
	});

	socket.on('errorText', function (data) {
		if(data['id'] == 0) { // Время вышло
			$('.log').html(data['text']);
			$('.info').show();
			$('.game').hide();
		};
		if(data['id'] == 1) { // В комнате уже играют
			alert(data['text']);
		};
	})

	$(document).on('click', '.js-connect', function (){
		var roomId = $(this).data('id');
		socket.emit('connectToGame', { roomId: roomId });
		return false;
	})

	$(document).on('submit', '.js-userData', function (){
		$('.userData').hide();

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
	$('.userData').show();
}

function log(text) {
	$('.log').append(text + '<br>');
}