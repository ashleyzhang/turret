var canvas;
var context;
var height;
var width;
const padding = 20;
function init() {
	canvas = document.getElementById('turret');
	context = canvas.getContext('2d');
    canvas.height = window.innerHeight - padding;
    canvas.width = window.innerWidth - padding;
	height = canvas.offsetHeight;
	width = canvas.offsetWidth;
    startGame();
}

//Declaring ball that is ready to shoot
var readyBall;

//Declaring turret
var turret;

//Declaring border
var border;

function startGame() {
    console.log("Game Started");
    // Initialize variables
    turret = {
		x: width / 2,
		y: height / 2,
    	radius: 150,
    	color: "black",
    	startAngle: 0,
    	endAngle: Math.PI * (ballNum - 1) / (ballNum / 2),
		spinSpeed: Math.PI / (ballNum * 2)
	};
	border = {
		thickness: 50,
		color: "grey"
	};
	initBalls(1);
	initTargets(1);
	nextFrame();
}
    
//Number of balls that can fit in the turret
var ballNum = 24;
//Declaring array of balls
var balls = [];
//Ball initialization
function initBalls(num) {
    balls = [];
	for(var i = 0; i < ballNum; i++) {
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
}

//Background color
var backgroundColor = "white";

//Holes in the border each assigned different color
var targetNum = 20;
//Declaring array of targets
var targets = [];
//target initialization
function initTargets(num) {
	targets = [];
	for(var i = 0; i < targetNum; i++) {
		var randomSide = generateRandomSide();
		target = {
			side: randomSide,
			x: generateRandomX(randomSide),
			y: generateRandomY(randomSide),
			size: generateRandomSize(),
            color: generateRandomColors()
        };
        //Long boolean statement to check whether or not position is valid and recalculate position until valid one is chosen
        while(((target.side === 1 || target.side === 3) && target.y + target.size > height - border.thickness) || 
        	((target.side === 2 || target.side === 4) && target.x + target.size > width - border.thickness)) {
        	target.x = generateRandomX(target.side);
        	target.y = generateRandomY(target.side);
        }
        //Minimum distaance between targets
        var minDistance = 50;
        var isValid = false;
        for(var j = 0; j < targets.indexOf(target); j++) {
        	while(!isValid) {
        		//Check that targets are not too close together
    			if(targets[i].side === 1 || targets[i].side === 3) {
    				if(targets[i].y + targets[i].size - targets[j].y < minDistance) {
    					if(targets[i].y + targets[i].size - targets[j].y > 0) {
    						isValid = false;
    						targets[i].side = generateRandomSide();
    						targets[i].x = generateRandomX(targets[i].side);
    						targets[i].y = generateRandomY(targets[i].side);
    					}
    				}
    				else if(targets[j].y + targets[j].size - targets[i].y < minDistance) {
    					if(targets[j].y + targets[j].size - targets[i].y > 0) {
    						isValid = false;
    						targets[i].side = generateRandomSide();
    						targets[i].x = generateRandomX(targets[i].side);
    						targets[i].y = generateRandomY(targets[i].side);
    					}
    				}
    			}
    			else if(targets[i].side === 2 || targets[i].side === 4) {
    				if(targets[i].x + targets[i].size - targets[j].x < minDistance) {
    					if(targets[i].x + targets[i].size - targets[j].x > 0) {
    						isValid = false;
    						targets[i].side = generateRandomSide();
    						targets[i].x = generateRandomX(targets[i].side);
    						targets[i].y = generateRandomY(targets[i].side);
    					}
    				}
    				else if(targets[j].x + targets[j].size - targets[i].x < minDistance) {
    					if(targets[j].x + targets[j].size - targets[i].x > 0) {
    						isValid = false;
    						targets[i].side = generateRandomSide();
    						targets[i].x = generateRandomX(targets[i].side);
    						targets[i].y = generateRandomY(targets[i].side);
    					}
    				}
    			}
    			else {
    				isValid = true;
    			}
    		}
        }
        targets.push(target);
	}
}
//generate random side of wall
function generateRandomSide() {
	var num = Math.random();
	if(num >= 0 && num < 0.25) {
		return 1;
	}
	else if(num >= 0.25 && num < 0.5) {
		return 2;
	}
	else if(num >= 0.5 && num < 0.75) {
		return 3;
	}
	else {
		return 4;
	}
}

//generate random x value of target positions
function generateRandomX(side) {
	if(side === 2 || side === 4) {
		return Math.random() * (width - 2 * border.thickness) + border.thickness;
	}
	else if(side === 1) {
		return 0;
	}
	else {
		return width - border.thickness;
	}
}

//generate random y value of target positions
function generateRandomY(side) {
	if(side === 1 || side === 3) {
		return Math.random() * (height - 2 * border.thickness) + border.thickness;
	}
	else if(side === 2) {
		return 0;
	}
	else {
		return height - border.thickness;
	}
}

//generate random width of targets
function generateRandomSize() {
	var size = Math.random() * 70 + 50;
	return size;
}

//generate random colors of balls
function generateRandomColors() {
	var num = Math.random();
	var color = "";
	if(num >= 0 && num < 0.1) {
		color = "lightpink";
	}
	else if(num >= 0.1 && num < 0.2) {
		color = "lightsalmon";
	}
	else if(num >= 0.2 && num < 0.3) {
		color = "palegreen";
	}
	else if(num >= 0.3 && num < 0.4) {
		color = "turquoise";
	}
	else if(num >= 0.4 && num < 0.5) {
		color = "plum";
	}
	else if(num >= 0.5 && num < 0.6) {
		color = "palegoldenrod";
	}
	else if(num >= 0.6 && num < 0.7) {
		color = "powderblue";
	}
	else if(num >= 0.7 && num < 0.8) {
		color = "slateblue";
	}
	else if(num >= 0.8 && num < 0.9) {
		color = "orange";
	}
	else {
		color = "rosybrown";
	}
	return color;
}
