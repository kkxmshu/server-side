var arg = [
	[ 2, 0, 0, 3, 1, 2, 2, 2, 0, 0, 1, 3, 1, 0, 0, 2 ],
	[ 2, 2, 0, 2, 0, 0, 0, 1, 1, 1, 2, 0, 2, 2, 2, 3 ],
	[ 1, 1, 0, 0, 2, 2, 3, 2, 2, 0, 2, 2, 2, 3, 2, 2 ],
	[ 2, 0, 2, 3, 2, 2, 1, 0, 0, 0, 0, 3, 0, 0, 3, 2 ],
	[ 0, 0, 0, 0, 3, 0, 2, 2, 2, 3, 1, 0, 2, 2, 2, 2 ],
	[ 3, 3, 3, 0, 2, 3, 0, 3, 0, 2, 2, 3, 2, 2, 2, 2 ],
	[ 1, 0, 2, 2, 3, 0, 1, 1, 0, 3, 2, 2, 2, 2, 2, 2 ],
	[ 2, 2, 0, 2, 0, 1, 0, 0, 2, 0, 0, 0, 0, 0, 1, 2 ],
	[ 1, 0, 3, 0, 3, 2, 3, 2, 2, 2, 2, 3, 2, 3, 0, 2 ],
	[ 2, 2, 2, 2, 2, 1, 0, 2, 2, 2, 0, 2, 1, 2, 2, 3 ],
	[ 0, 0, 2, 2, 2, 1, 2, 0, 0, 3, 2, 0, 2, 0, 2, 2 ],
	[ 2, 2, 3, 0, 2, 2, 1, 0, 2, 2, 2, 2, 3, 2, 2, 2 ],
	[ 3, 2, 2, 2, 0, 2, 2, 2, 2, 0, 0, 2, 0, 1, 2, 2 ],
	[ 2, 0, 3, 2, 3, 2, 0, 1, 1, 2, 2, 3, 0, 3, 1, 2 ],
	[ 1, 2, 0, 0, 2, 0, 2, 1, 0, 0, 3, 0, 0, 3, 2, 2 ],
	[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3 ]
];

var HEIGHT = 500, WIDTH = 500;
var canvas, context, keystate;
var W = 87, S = 83, A = 65, D = 68;
var player = {
	x: null,
	y: null,
	side: 10,
	update: function(){
		if(keystate[W]) this.y -= 1;
		if(keystate[S]) this.y += 1;
		if(keystate[A]) this.x -= 1;
		if(keystate[D]) this.x += 1;
	},
	draw: function(){
		context.fillRect(this.x, this.y, this.side, this.side);
	}
};

function main(){
	canvas = document.getElementById('maze');
	context = canvas.getContext('2d');
	canvas.height = HEIGHT;
	canvas.width = WIDTH;
	document.body.appendChild(canvas);

	keystate = {

	};
	document.addEventListener("keydown", function(evt){
		keystate[evt.keyCode] = true;
	});
	document.addEventListener("keyup", function(evt){
		delete keystate[evt.keyCode];
	});

	init();

	var loop = function(){
		update();
		draw();

		window.requestAnimationFrame(loop, canvas);
	};
	window.requestAnimationFrame(loop, canvas);
}
function init(){
	player.x = 8;
	player.y = 8;
	buildMaze();
}
function buildMaze(){
	context.moveTo(0,2);
	context.lineTo(400, 2);
	context.moveTo(2,0);
	context.lineTo(2, 400);
	for(var i = 0; i < arg.length; i++) {
			for(var j = 0; j < arg[i].length; j++) {
			var w = 25;
			var x = j*w+w;
			var y = i*w+w;
			context.moveTo(x, y);
			if (arg[i][j] == 0) {
				// nothing here
			} else if (arg[i][j] == 1) {
				context.lineTo(x-w, y)
			} else if (arg[i][j] == 2) {
				context.lineTo(x, y-w);
			} else if (arg[i][j] == 3) {
				context.lineTo(x-w, y);
				context.moveTo(x, y);
				context.lineTo(x, y-w)
			}
		}
	}
	context.lineCap = "square";
	context.strokeStyle = "#ff0000";
	context.lineWidth = 5;
	context.stroke();
}

function update(){
	player.update();
}

function draw(){
	// context.fillRect(0, 0, WIDTH, HEIGHT);

	context.save();
	// context.fillStyle = "#fff";
	player.draw();

	context.restore();
}

main();

