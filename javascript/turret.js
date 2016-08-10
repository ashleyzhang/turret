function nextFrame() {
	spinTurret();
	drawFrame();
	if(isReleased) {
		freeMove();
	}
	setTimeout(nextFrame, 25);
}
function drawFrame() {
	//Clear canvas before drawing
	context.clearRect(0, 0, width, height);

	//Set background color
	context.rect(0, 0, width, height);
    context.fillStyle = backgroundColor;
    context.fill();

	//Draw border
	drawBorder(border.thickness, border.color);

	//Draw balls
	balls.forEach(function(ball) {
		drawBall(ball.x, ball.y, ball.radius, ball.color);
	});

	//Draw targets
	targets.forEach(function(target) {
		drawTarget(target.x, target.y, target.size, target.color, target.side);
	});

	//Draw turret
    drawTurret(turret.x, turret.y, turret.startAngle, turret.endAngle, turret.radius, turret.color);

    //Draw released ball
	if(isReleased) {
		drawBall(readyBall.x, readyBall.y, readyBall.radius, readyBall.color);
	}
}

//Draws four rectangles on the edge of the screen
function drawBorder(thickness, color) {
	context.fillStyle = color;
	context.fillRect(0, 0, width, thickness);
	context.fillRect(0, 0, thickness, height);
	context.fillRect(width - thickness, 0, thickness, height);
	context.fillRect(0, height - thickness, width, thickness);
}

//Draws targets
function drawTarget(x, y, size, color, side) {
	context.fillStyle = color;
	if(side === 1) {
		context.fillRect(x, y, border.thickness / 2, size);
		context.fillStyle = backgroundColor;
		context.fillRect(x + border.thickness / 2 - 1, y, border.thickness / 2 + 5, size);
	}
	else if(side === 2) {
		context.fillRect(x, y, size, border.thickness / 2);
		context.fillStyle = backgroundColor;
		context.fillRect(x, y + border.thickness / 2 - 1, size, border.thickness / 2 + 5);
	}
	else if(side === 3) {
		context.fillRect(x + border.thickness / 2, y, border.thickness / 2, size);
		context.fillStyle = backgroundColor;
		context.fillRect(x - 5, y, border.thickness / 2 + 6, size);
	}
	else {
		context.fillRect(x, y + border.thickness / 2, size, border.thickness / 2);
		context.fillStyle = backgroundColor;
		context.fillRect(x, y - 5, size, border.thickness / 2 + 6);
	}
}

//Draws a circle that does not close completely
function drawTurret(x, y,startAngle, endAngle, radius, color) {
	context.beginPath();
	context.strokeStyle = color;
	context.arc(x, y, radius, startAngle, endAngle); 
	context.lineWidth = 3;
	context.stroke();
}

//Draws balls inside turret
function drawBall(x, y, radius, color) {
	context.beginPath();
	context.fillStyle = color;
	context.arc(x, y, radius, 0, Math.PI * 2);
	context.fill();
}

//Creates new ball
function addBall() {
	console.log("addBall");
	ball = {
		x: 0,
		y: 0,
        numBalls: ballNum,
        //Not exact radius because otherwise need recursive but close approximation
        radius: (turret.radius - (turret.radius * Math.sin(Math.PI / ballNum))) * Math.sin(Math.PI / ballNum),
        color: generateRandomColors()
    };
	balls.push(ball);
}

function spinTurret() {
	turret.startAngle += turret.spinSpeed;
	turret.endAngle += turret.spinSpeed;

	//Controls position of ball
	var position = 0;
	balls.forEach(function(ball) {
		if(position !== 0) {
			ball.x = turret.x + (turret.radius - ball.radius) * Math.cos(((turret.endAngle + turret.startAngle) / 2 - Math.PI) + (Math.PI / (ballNum / 2) * position));
			ball.y = turret.y + (turret.radius - ball.radius) * Math.sin(((turret.endAngle + turret.startAngle) / 2 - Math.PI) + (Math.PI / (ballNum / 2) * position));
			position++;
		}
		//Moves ball that is ready to shoot
		else {
			ball.x = turret.x + turret.radius * Math.cos((turret.endAngle + turret.startAngle) / 2 - Math.PI);
			ball.y = turret.y + turret.radius * Math.sin((turret.endAngle + turret.startAngle) / 2 - Math.PI);
			position++;
		}
	});
}

var isReleased;
var releaseAngle;
//Releases ball from turret
function releaseBall() {
    readyBall = {
		x: balls[0].x,
		y: balls[0].y,
		vx: 0,
		vy: 0,
		numBalls: balls[0].numBalls,
        radius: balls[0].radius,
        color: balls[0].color,
        releaseAngle: (-turret.startAngle + ((2 * Math.PI) - turret.endAngle)) / 2
    };
	//Sets ball velocity
	var speed = turret.spinSpeed * turret.radius;
	readyBall.vx = speed * Math.cos(readyBall.releaseAngle);
	readyBall.vy = speed * Math.sin(readyBall.releaseAngle);

	balls.shift();
	addBall();
	isReleased = true;
}

//Moves readyBall after released from turret
function freeMove() {
	// Bounce off walls
	if (readyBall.x < readyBall.radius && readyBall.x > -readyBall.radius) {
		readyBall.x = readyBall.radius;
		readyBall.vx *= -1;
	}
	if (readyBall.x > width - readyBall.radius && readyBall.x < width + readyBall.radius) {
		readyBall.x = width - readyBall.radius;
		readyBall.vx *= -1;
	}
	if (readyBall.y < readyBall.radius && readyBall.y > -readyBall.radius) {
		readyBall.y = readyBall.radius;
		readyBall.vy *= -1;
	}
	if (readyBall.y > height - readyBall.radius && readyBall.y < height + readyBall.radius) {
		readyBall.y = height - readyBall.radius;
		readyBall.vy *= -1;
	}
	//Change position of ball
	readyBall.x += readyBall.vx;
	readyBall.y -= readyBall.vy;
}
