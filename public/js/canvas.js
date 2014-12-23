var frameRate = 0;
var canvas;
var lastTime;

function init(fps) {
    canvas = document.getElementById('maze');

    if (canvas.getContext){
		ctx = canvas.getContext('2d');
		// ctx.translate(canvas.width / 2, canvas.height / 2);
		frameRate = fps;
				
		initGame();
		
		lastTime = new Date().getTime();
		
		if (fps > 0) {
			timeInterval = 1000 / fps;
			setInterval(fw_update, timeInterval);
		} else {
			fw_update();
		}
		
		canvas.onmousemove = fw_mouseMove;
		canvas.onmousedown = fw_mouseDown;
		canvas.onmouseup = fw_mouseUp;	
    } else {
		alert('You need HTML5 compatible browser to play this game');
    }
}

function fw_update()
{
	var currTime = new Date().getTime();
	var delta = (currTime - lastTime) / 1000.0;
	lastTime = currTime;
	
	if (delta > 1.0) delta = 1.0;
	
//	updateScene(delta);
	renderScene(delta);
}

var mouseMovedX;
var mouseMovedY;
var mouseButton;

function fw_mouseMove(evt)
{
	mouseMovedX = evt.clientX - canvas.offsetLeft;
	mouseMovedY = evt.clientY - canvas.offsetTop;

	if (frameRate == 0) fw_update();	
}

function fw_mouseDown(evt)
{
	mouseMovedX = evt.clientX - canvas.offsetLeft;
	mouseMovedY = evt.clientY - canvas.offsetTop;

	switch(evt.which) {
		case 1 : mouseButton |= 0x01;	
			break;
		case 2 : mouseButton |= 0x02;
			break;
		case 3 : mouseButton |= 0x04;
			break;
	}

	if (frameRate == 0) fw_update();	
}

function fw_mouseUp(evt)
{
	mouseMovedX = evt.clientX - canvas.offsetLeft;
	mouseMovedY = evt.clientY - canvas.offsetTop;

	switch(evt.which) {
		case 1 : mouseButton &= 0x06;
			break;
		case 2 : mouseButton &= 0x05;
			break;
		case 3 : mouseButton &= 0x03;
			break;
	}

	if (frameRate == 0) fw_update();	
}