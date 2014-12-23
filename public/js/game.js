// Line width
var line = 10;
var offset = line / 2;

// Wall color
var lineColor = "black";

// Width of canvas
var w = 0;
// Height of canvas
var h = 0;

// Cell height
var cell_h = 0;
// Cell width
var cell_w = 0;

/**
 * Calculates cells width and height
 */
function initGame() {
	w = canvas.width;
	h = canvas.height;

	cell_h = (h-line*3) / 3;
	cell_w = (w-line*3) / 3;

	player.img = loadSprite('img/player.png')
	maze.bag = loadSprite('img/bag.png')
}

/**
 * Redraw canvas
 * 
 * @param argument for changing values
 */
function renderScene(delta) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	// ctx.fillRect((w / 2)-32, (h / 2)-32, 64, 64);
	maze.draw();
	player.draw();

}
/**
 * Method for loading sprite
 * 
 * @param path to sprite
 * @returns object with loaded sprite 
 */
function loadSprite(imagePath) {
	var image = new Image();
	image.src = imagePath;
	return image;
}

/**
 * Draw sprite
 *
 * @param image, which need to draw
 * @param x-coordinate
 * @param y-coordinate
 * @param x-coordinate of sprite (1st point)
 * @param y-coordinate of sprite (1st point)
 * @param height/width for cutting the sprite from 1st point
 * @param rotation value in radians
 * @param scale value
 */
function drawSprite(imageObject, x, y, sx, sy, ds, rotation, scale) {
	ctx.save();
	ctx.translate(x, y);
	ctx.rotate(rotation);
	ctx.scale(scale, scale);
	ctx.drawImage(imageObject, sx, sy, ds, ds, 0, 0, ds, ds);
	ctx.restore();
}

// Variables of move direction
var UP = 1000, DOWN = 1001, LEFT = 1010, RIGHT = 1100;

// Maze object
var maze = {
	// Cells values
	ways: {
		left: 2, right: 5, top: 1, bottom: 9
	},
	bag: null,
	/**
	 * Refresh cells values
	 */
	init: function() {
		
	},
	/**
	 * Draw cells
	 */
	draw: function() {	
		drawCell(cell_w, 0, this.ways.top);
		drawCell(cell_w, cell_h * 2, this.ways.bottom);
		drawCell(0, cell_h, this.ways.left);
		drawCell(cell_w * 2, cell_h, this.ways.right);
	}
}

/**
 * Draw one wall
 *
 * @param source x
 * @param source y 
 * @param destination x
 * @param destination y
 * @param color of the wall
 * @param is this wall vertical? 
 */
function wall(sx, sy, dx, dy, color, isVertical) {
	// Calculate values of Bezier control points
	var c1x = sx + Math.floor((Math.random() * 10) - 0), 
		c1y = sy + Math.floor((Math.random() * 10) - 0),
		c2x = dx - Math.floor((Math.random() * 200) - 0),
		c2y = dy + Math.floor((Math.random() * 10) - 0);
	if(isVertical) {
		c1x = sx + Math.floor((Math.random() * 5) - 2); 
		c1y = sy + Math.floor((Math.random() * 100) - 0);
		c2x = dx - Math.floor((Math.random() * 5) - 5);
		c2y = dy + Math.floor((Math.random() * 25) - 0);
	} 
	
	ctx.save();
	ctx.beginPath();
	ctx.strokeStyle = color;
	ctx.lineWidth = line;
	ctx.lineCap = "round";

	ctx.moveTo(sx + offset, sy + offset);
	ctx.bezierCurveTo(c1x, c1y, c2x, c2y, dx + offset, dy + offset);

	ctx.stroke();
	ctx.restore();
}

// Direction values for bitmask
var BOTTOM = 1, RIGHT = 2, TOP = 4, LEFT = 8;

/**
 * Draw walls of cell
 *
 * @param source x
 * @param source y
 * @param cell
 */
function drawCell(sx, sy, cell) {
	if(cell == -1) {
		drawSprite(maze.bag, sx, sy, 0, 0, 128, 0, 1);
	} else {

		if((cell & BOTTOM) != 0) {
			wall(sx, sy + cell_h, sx + cell_w, sy + cell_h, lineColor, false);
		}
		if((cell & RIGHT) != 0) {
			wall(sx + cell_w, sy, sx + cell_w, sy + cell_h, lineColor, true);
		}
		if((cell & TOP) != 0) {
			wall(sx, sy, sx + cell_w, sy, lineColor, false);
		}
		if((cell & LEFT) != 0) {
			wall(sx, sy, sx, sy + cell_h, lineColor, true);
		}

	}
}

var DIR_LEFT = 0, DIR_BOTTOM = 96, DIR_TOP = 192, DIR_RIGHT = 288;
// Player object
var player = {
	direction: DOWN,
	scale: 10,
	coords: {x: 0, y: 0},
	update: function() {	},
	direct: DIR_RIGHT,
	draw: function() {
		drawSprite(this.img, (w / 2)-64, (h / 2)-64, this.direct, 0, 96, 0, 1)
	},
	changeCoords: function(direction) {
		console.log(maze.ways);
	},
	update: function() {},

	/**
	 * One step in the direction of
	 *
	 * @param move direction 
	 */
	goto: function(direction) {
		switch(direction) {
			case UP:
				if((maze.ways.top & BOTTOM) == 0) {
					this.coords.y -= 1;
					this.direct = DIR_TOP;
					return true;
				}
				break;
			case DOWN:
				if((maze.ways.bottom & TOP) == 0) {
					this.coords.y += 1;
					this.direct = DIR_BOTTOM;
					return true;
				}
				break;
			case RIGHT:
				if(maze.ways.right == -1) {
					this.coords.x = -1;
					this.coords.y = -1;
				}
				if((maze.ways.right & LEFT) == 0 ) {
					this.coords.x += 1;
					this.direct = DIR_RIGHT;
					return true;
				}
				break;
			case LEFT:
				if((maze.ways.left & RIGHT) == 0) {
					this.coords.x -= 1;
					this.direct = DIR_LEFT;
					return true;
				}
				break;
		};
		return false;
	}
}

var start = false;
var timer = 0;
/**
 * Send move direction to the server
 *
 * @param direction
 */
function toServer(direction) {
}


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
				res = player.goto(UP);
			}
			if(e.which == 83) { // s
				res = player.goto(DOWN);
			}
			if(e.which == 65) { // a
				res = player.goto(LEFT);
			}
			if(e.which == 68) { // d
				res = player.goto(RIGHT);
			}

			if(res) {
				$('.userData').find('#x').val(player.coords.x);
				$('.userData').find('#y').val(player.coords.y);
				$('.js-userData').submit();
			}
		}
	});

	socket.on('someUserDoMove', function (data) {
		if(data['isWinner'] != undefined && data['winnerID'] == data['userId']) {
			t = JSON.parse(data.cells);

			maze.ways.left = t.left;
			maze.ways.right = t.right;
			maze.ways.top = t.top;
			maze.ways.bottom = t.bottom;
			renderScene(42);
			maze.draw();

			alert('Вы победили.');

			document.location.reload();
		} else if(data['isWinner'] != undefined && data['winnerID'] != data['userId']) {
			alert('Кто-то победил');

			document.location.reload();
		} else if((data['userId'] == data['moveInfo']['userID']) && data['isCorrect']) {
			t = JSON.parse(data.cells);

			maze.ways.left = t.left;
			maze.ways.right = t.right;
			maze.ways.top = t.top;
			maze.ways.bottom = t.bottom;
			renderScene(42);
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
		// $('.userData').hide();

		var form = $(this).serializeArray();
		var dataObj = {};
		$(form).each(function(i, field){
			dataObj[field.name] = field.value;
		});

		console.log("MAKE MOVE");
		console.log(dataObj);

		socket.emit('makeMove', dataObj);
		return false;
	});

	
	// moveTimeAll = 0;

	socket.on('startGame', function (data) {
		$('.info').hide();
		$('.game').show();

		$('.userData').find('#roomId').val(data['roomId']);
		$('.userData').find('#moveCurrent').val(data['moveCurrent']);

		if(!start) {
			start = true;
			$('.js-userData').submit();
		}

		// if(data.moveTime != undefined) {
		// 	moveTimeAll = data.moveTime;
		// }

		// moveTime = moveTimeAll-1;
		// clearInterval(timer);
		// timer = setInterval(function(){
		// 	$('.timer').html(moveTime--);
		// 	if(moveTime < 0) {
		// 		$('.js-userData').submit();
		// 		clearInterval(timer);
		// 	}
		// }, 1000);
		
		makeMove(data);		
	});
});

function makeMove(data) {
	$('.userData').find('#roomId').val(data['roomId']);
	$('.userData').show();
}
