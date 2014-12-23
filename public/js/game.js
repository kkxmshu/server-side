var mySprite;
var spriteRotation = 0;
var line = 10;
var offset = line / 2;

var w = 0;
var h = 0;


var cell_h = 0;
var cell_w = 0;

function initGame() {
	mySprite = loadSprite("src/blocks.png");
	w = canvas.width;
	h = canvas.height;

	cell_h = (h-line) / 3;
	cell_w = (w-line) / 3;
}

function updateScene(delta) {
	spriteRotation += (Math.PI / 180.0) * 45 * delta;
}

function renderScene(delta) {
	var offset = line / 2;

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillRect((w / 2)-32, (h / 2)-32, 64, 64);
	maze.draw();

}

function loadSprite(imagePath) {
	var image = new Image();
	image.src = imagePath;
	return image;
}

function drawSprite(imageObject, x, y, sx, sy, ds, rotation, scale) {
	// var w = imageObject.width;
	// var h = imageObject.height;

	ctx.save();
	ctx.translate(x, y);
	ctx.rotate(rotation);
	ctx.scale(scale, scale);
	ctx.drawImage(imageObject, sx, sy, ds, ds, 0, 0, ds, ds);
	ctx.restore();
}

var UP = 1000, DOWN = 1001, LEFT = 1010, RIGHT = 1100;


var maze = {
	ways: {
		left: 2, right: 5, top: 4, bottom: 8
	},
	init: function() {
		// get ways from server 
	},
	draw: function() {	
		drawCell(cell_w, 0, this.ways.top);
		drawCell(cell_w, cell_h * 2, this.ways.bottom);
		drawCell(0, cell_h, this.ways.left);
		drawCell(cell_w * 2, cell_h, this.ways.right);
	}
}


function wall(sx, sy, dx, dy, color) {
	ctx.save();
	ctx.beginPath();
	ctx.strokeStyle = color;
	ctx.lineWidth = line;
	ctx.lineCap = "square";
	ctx.moveTo(sx + offset, sy + offset);
	ctx.lineTo(dx + offset, dy + offset);
	ctx.stroke();

	ctx.restore();
}
var BOTTOM = 1, RIGHT = 2, TOP = 4, LEFT = 8;
function drawCell(sx, sy, cell) {
	if((cell & BOTTOM) != 0) {
		wall(sx, sy + cell_h, sx + cell_w, sy + cell_h, "red");
	} else {
		// bottom blur
	}

	if((cell & RIGHT) != 0) {
		wall(sx + cell_w, sy, sx + cell_w, sy + cell_h, "red");
	} else {
		// right blur
	}

	if((cell & TOP) != 0) {
		wall(sx, sy, sx + cell_w, sy, "red");
	} else {
		// top blur
	}

	if((cell & LEFT) != 0) {
		wall(sx, sy, sx, sy + cell_h, "red");
	} else {
		// left blur
	}
}

var player = {
	direction: DOWN,
	scale: 10,
	coords: {x: 0, y: 0},
	update: function() {	},
	draw: function() {	},
	changeCoords: function(direction) {
		console.log(maze.ways);
		switch(direction) {

			case UP:
				if(maze.ways.top != 0) {
					this.coords.y -= 1;
					return true;
				}
				break;
			case DOWN:
				if(maze.ways.bottom != 0) {
					this.coords.y += 1;
					return true;
				}
				break;
			case RIGHT:
				if(maze.ways.right != 0) {
					// alert(right);
					this.coords.x += 1;
					return true;
				}
				break;
			case LEFT:
				if(maze.ways.left != 0) {
					this.coords.x -= 1;
					return true;
				}
				break;
		};
		return false;
	}
}

var start = false;
var timer = 0;


$(document).ready(function() {
	var socket = io();

	socket.on('stats', function (data) {
		$('.statBlock').html(data.join('<br>'));
	});

	socket.on('listOfGames', function (data) {
		$(".listOfGames span").empty();
		for(var i = 0; i<data.length; i++) {
			$(".listOfGames span").append("Игра на " + data[i]['playersMax'] + " игрока (уже " + data[i]['playersNow'] + " из " + data[i]['playersMax'] + ") <a href='' class='js-connect' data-id='" + data[i]['roomId'] + "'>Подключиться</a><br>");
		}
	});

	socket.on('errorText', function (data) {
		alert(data['text']);
	})

	$('.listOfGames-create').on('click', function() {
		var players = $(this).data('players');
		socket.emit('createGame', { players: players });
	});

	$(document).keydown(function (e) {
		if($('.userData').is(':visible')) {
			var res = false;
			if(e.which == 87) { // w
				res = player.changeCoords(UP);
			}
			if(e.which == 83) { // s
				res = player.changeCoords(DOWN);
			}
			if(e.which == 65) { // a
				res = player.changeCoords(LEFT);
			}
			if(e.which == 68) { // d
				res = player.changeCoords(RIGHT);
			}
			if(res) {
				$('.userData').find('#x').val(player.coords.x);
				$('.userData').find('#y').val(player.coords.y);
				$('.js-userData').submit();
			}
		}
	});

	socket.on('someUserDoMove', function (data) {
		console.log(data);
		if(data['isWinner']) {
			alert('Никого не осталось в комнате. Вы победили.');
		} else if((data['userId'] == data['moveInfo']['userID']) && data['isCorrect']) {
			t = JSON.parse(data.cells);

			maze.ways.left = t.left;
			maze.ways.right = t.right;
			maze.ways.top = t.top;
			maze.ways.bottom = t.bottom;
			maze.draw();

			console.log('Вы походили на [' + data['moveInfo']['x'] + ';' + data['moveInfo']['y'] + ']');
		} else if(data['isCorrect']) {
			console.log('Пользователь ' + data['moveInfo']['userID'] + ' походил на [' + data['moveInfo']['x'] + ';' + data['moveInfo']['y'] + ']');
		} else {
			console.log('Пользователь ' + data['moveInfo']['userID'] + ' не успел походить и его было выкинуто из комнаты');
		}
	});

	$(document).on('click', '.js-connect', function (){
		var roomId = $(this).data('id');
		socket.emit('connectToGame', { roomId: roomId });
		return false;
	});

	$(document).on('submit', '.js-userData', function (){
		$('.userData').hide();

		var form = $(this).serializeArray();
		var dataObj = {};
		$(form).each(function(i, field){
			dataObj[field.name] = field.value;
		});
		socket.emit('makeMove', dataObj);
		return false;
	});

	
	moveTimeAll = 0;

	socket.on('startGame', function (data) {
		$('.info').hide();
		$('.game').show();

		$('.userData').find('#roomId').val(data['roomId']);
		$('.userData').find('#moveCurrent').val(data['moveCurrent']);

		if(!start) {
			start = true;
			$('.js-userData').submit();
		}

		if(data.moveTime != undefined) {
			moveTimeAll = data.moveTime;
			
		}

		moveTime = moveTimeAll-1;
		clearInterval(timer);
		timer = setInterval(function(){
			$('.timer').html(moveTime--);
			if(moveTime < 0) {
				$('.js-userData').submit();
				clearInterval(timer);
			}
		}, 1000);
		
		makeMove(data);		
	});
});

function makeMove(data) {
	console.log("move");
	$('.userData').find('#roomId').val(data['roomId']);
	$('.userData').show();
}