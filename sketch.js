/*

The Game Project



*/


var gameChar_x;
var gameChar_y;
var floorPos_y;

var isLeft;
var isRight;
var isPlummeting;
var isFalling;

var collectables;
var canyons;

var trees_x;
var treePos_y;

var cloud;
var mountain;

var cameraPosX;

var game_score;

var flagpole;

var lives;

var bgMusic;
var burnSound;
var jumpSound;
var coinSound;
var enemySound;

var platforms;

var enemies;
function preload(){
	soundFormats('mp3', 'wav');
	bgMusic = loadSound('assets/background.wav');
	burnSound = loadSound('assets/burn.wav');
	jumpSound = loadSound('assets/jump.wav');
	coinSound = loadSound('assets/coin.wav');
	enemySound = loadSound('assets/enemy.wav');
	bgMusic.setVolume(0.08);
	burnSound.setVolume(0.2);
	jumpSound.setVolume(0.2);
	coinSound.setVolume(0.2);
	enemySound.setVolume(0.2);
}

function setup()
{
	createCanvas(1024, 576);
	floorPos_y = height * 3/4;
	lives = 3;

	startGame();
	bgMusic.loop();


};

function draw()
{
	cameraPosX = gameChar_x - width/2;
	///////////DRAWING CODE//////////

	//fill the sky
	background(50, 20, 0); 

	// //draw some ground
	noStroke();
	fill(30, 5, 5);
	rect(0, floorPos_y, width, height - floorPos_y); 


	push();
	translate(-cameraPosX, 0);


	//draw mountains
	drawMountains();


	//draw clouds
	drawClouds();


	//draw trees
	drawTrees();


	//draw canyon
	for (let i = 0; i < canyons.length; i++) {
	drawCanyon(canyons[i]);
	}
	//draw collectable item
	for (let i = 0; i< collectables.length; i++){
		if (!collectables[i].isFound) {
			drawCollectable(collectables[i]);
			checkCollectable(collectables[i]);
		}
	}

	//draw Platforms
	for(var i = 0; i < platforms.length; i++) {
		platforms[i].draw();
	}

	//draw the game character

	drawGameChar();

	checkFlagpole();
	renderFlagpole();

	//draw Enemy
	for (var i = 0; i < enemies.length; i++) {
		enemies[i].draw();
		var isContact = enemies[i].checkContact(gameChar_x, gameChar_y);
		if(isContact) {
			if(lives > 0 ) {
				startGame();
				break;
			}
		}
	}

	pop();



	//score count
	for (let i = 0; i < game_score; i++) {
		fill(255, 215, 0);
		ellipse(20 + i*25, 40, 20);
		fill(218, 165, 32);
		ellipse(20 + i*25, 40, 15);
		fill(50, 20, 0);
		rectMode(CENTER);
		rect(20 + i*25, 40, 5, 5);
		rectMode(CORNER);
	}



	//die count
	for (let i = 0; i < lives; i++) {
        fill(120,0,0);
        stroke(0);
        ellipse(20 + i*25, 15, 20);
        
        fill(200,100,100);
        ellipse(20 + i*25 -5, 10, 7.5);
	}

	checkPlayerDie();


	//GAME OVER
	if (lives < 1) {
		fill(200);
		stroke(300);
		textSize(150);
		textAlign(CENTER)
		text("Game Over", width/2, height/2);
	} 

	if (flagpole.isReached == true) {
		fill(200);
		stroke(300);
		textSize(125);
		textAlign(CENTER)
		text("Level Complete", width/2, height/2);
		noLoop();


	}


	///////////INTERACTION CODE//////////
	//to left
	if (isLeft == true){
		gameChar_x -= 7;
	}
	//to right
	if (isRight == true){
		gameChar_x += 7;
	}

	//Gravity
	if (isPlummeting == true){
		gameChar_y += 8;
		isLeft = false;
		isRight = false;
		isFalling = false;

	}
	else {
		if (gameChar_y < floorPos_y){
			var isContact = false;
			for (var i = 0; i < platforms.length; i++){
				if (platforms[i].checkContact(gameChar_x, gameChar_y) == true) {
					isContact = true;
					isFalling = false;
					break;
				};
			}
			if(isContact == false){
				gameChar_y += 5;
				isFalling = true;
			}
		}
		else{
			isFalling = false;
		}
	}

};


function keyPressed()
{
	// if statements to control the animation of the character when
	// keys are pressed.

	if (keyCode == 37){
		isLeft = true;
	}
	else if (keyCode == 39){
		isRight = true;
	}
	if (!isFalling && keyCode == 38){
		gameChar_y -= 120;
		isFalling = true;
		jumpSound.play();

	}

};

function keyReleased()
{
	// if statements to control the animation of the character when
	// keys are released.
	if (keyCode == 37){
		isLeft = false;
	}
	else if (keyCode == 39){	
		isRight = false;
	}

};

function drawClouds() {
	for (var i = 0; i < cloud.x_pos.length; i++)
	{
		fill(0);
		ellipse(cloud.x_pos[i], cloud.y_pos, cloud.size[i]*0.8, cloud.size[i]*0.3);
		ellipse(cloud.x_pos[i] + cloud.size[i] * 0.2, cloud.y_pos, cloud.size[i] * 0.2, cloud.size[i]/2*0.2);
		ellipse(cloud.x_pos[i] + cloud.size[i] * 0.1, cloud.y_pos + cloud.size[i] * 0.1, cloud.size[i] * 0.5, cloud.size[i]/2*0.5);
		ellipse(cloud.x_pos[i] + cloud.size[i] * 0.4, cloud.y_pos, cloud.size[i] * 0.9, cloud.size[i]/2*0.8);
		ellipse(cloud.x_pos[i] + cloud.size[i] * 0.8, cloud.y_pos + cloud.size[i] * 0.05, cloud.size[i] * 0.4, cloud.size[i]/2*0.6);
		ellipse(cloud.x_pos[i] + cloud.size[i] * 0.8, cloud.y_pos, cloud.size[i] * 0.6, cloud.size[i]/2*0.6);
	}

};


function drawMountains() {
	for (var i = 0; i < mountain.x_pos.length; i++)
	{
		fill(20,0,0);
		triangle(mountain.x_pos[i], mountain.y_pos, mountain.x_pos[i] + 400, mountain.y_pos, mountain.x_pos[i] + 200, mountain.y_pos - 172);
		triangle(mountain.x_pos[i] + 200, mountain.y_pos, mountain.x_pos[i] + 600, mountain.y_pos, mountain.x_pos[i] + 400, mountain.y_pos - 282);
		triangle(mountain.x_pos[i] + 400, mountain.y_pos, mountain.x_pos[i] + 800, mountain.y_pos, mountain.x_pos[i] + 600, mountain.y_pos - 232);
		triangle(mountain.x_pos[i] + 600, mountain.y_pos, mountain.x_pos[i] + 1024, mountain.y_pos, mountain.x_pos[i] + 800, mountain.y_pos - 182);	
		triangle(mountain.x_pos[i] + 800, mountain.y_pos, mountain.x_pos[i] + 1200, mountain.y_pos, mountain.x_pos[i] + 1000, mountain.y_pos - 172);	
		triangle(mountain.x_pos[i] + 1000, mountain.y_pos, mountain.x_pos[i] + 1400, mountain.y_pos, mountain.x_pos[i] + 1200, mountain.y_pos - 282);	
		triangle(mountain.x_pos[i] + 1200, mountain.y_pos, mountain.x_pos[i] + 1600, mountain.y_pos, mountain.x_pos[i] + 1400, mountain.y_pos - 132);	
		triangle(mountain.x_pos[i] + 1400, mountain.y_pos, mountain.x_pos[i] + 1900, mountain.y_pos, mountain.x_pos[i] + 1700, mountain.y_pos - 182);	


	}

};

function drawTrees() {
	for( var i=0; i < trees_x.length; i++)
	{
		//Tree
		fill(35, 10, 10);
		rect(trees_x[i], treePos_y, 60, 150);
		//branches
		fill(60,0,0);
		triangle(trees_x[i] - 50, treePos_y + 18, trees_x[i] + 110, treePos_y + 18, trees_x[i] + 30, 150);
		triangle(trees_x[i] - 50, treePos_y - 32, trees_x[i] + 110, treePos_y - 32, trees_x[i] + 30, 100);

	}

};

	//collectable drawing
function drawCollectable(t_collectable) {
	if( t_collectable.isFound == false){
	fill(255, 215, 0);
	ellipse(t_collectable.x_pos, t_collectable.y_pos, t_collectable.size - 10, t_collectable.size - 10);
	fill(218, 165, 32);
	ellipse(t_collectable.x_pos, t_collectable.y_pos, t_collectable.size - 20, t_collectable.size - 20);
	fill(50, 20, 0);
	rectMode(CENTER);
	rect(t_collectable.x_pos, t_collectable.y_pos, t_collectable.size - 40, t_collectable.size - 40);
	rectMode(CORNER);
	}

};

	//collectable iteraction
function checkCollectable(t_collectable) {
	if(dist(gameChar_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos) < 50){
		t_collectable.isFound = true;
		game_score += 1;
		coinSound.play();
	}

}
//draw canyon
function drawCanyon(t_canyon) {
	fill(200, 50, 0, 200);
	rect(t_canyon.x_pos, floorPos_y, t_canyon.width, 150);

	//gravity
	//if not plummeting
	if (t_canyon.x_pos < gameChar_x && gameChar_x < t_canyon.x_pos + t_canyon.width && gameChar_y == floorPos_y){		
		isPlummeting = true;
	}

};

function drawGameChar() {
	if(isLeft && isFalling)
	{
		// add your jumping-left code
		//Helmet
		fill(150, 160, 180, 140);
		beginShape();
		vertex(gameChar_x - 20, gameChar_y - 60);
		vertex(gameChar_x + 20, gameChar_y - 60);
		vertex(gameChar_x + 20, gameChar_y - 25);
		vertex(gameChar_x - 10, gameChar_y - 10);
		vertex(gameChar_x - 20, gameChar_y - 25);
		endShape(CLOSE);
		//Eyes
		fill(0);
		rect(gameChar_x - 20, gameChar_y - 45, 18, 10);
		fill(255,0,0);
		ellipse(gameChar_x - 15, gameChar_y - 41, 6 ,1);

	}
	else if(isRight && isFalling)
	{
		// add your jumping-right code
		//Helmet
		fill(150, 160, 180, 140);
		beginShape();
		vertex(gameChar_x - 20, gameChar_y - 60);
		vertex(gameChar_x + 20, gameChar_y - 60);
		vertex(gameChar_x + 20, gameChar_y - 25);
		vertex(gameChar_x + 10, gameChar_y - 10);
		vertex(gameChar_x - 20, gameChar_y - 25);
		endShape(CLOSE);
		//Eyes
		fill(0);
		rect(gameChar_x + 2, gameChar_y - 45, 18, 10);
		fill(255,0,0);
		ellipse(gameChar_x + 15, gameChar_y - 41, 6 ,1);

	}
	else if(isLeft)
	{
		// add your walking left code
		//Helmet
		fill(150, 160, 180, 140);
		beginShape();
		vertex(gameChar_x - 20, gameChar_y - 60);
		vertex(gameChar_x + 20, gameChar_y - 60);
		vertex(gameChar_x + 20, gameChar_y - 25);
		vertex(gameChar_x - 10, gameChar_y - 10);
		vertex(gameChar_x - 20, gameChar_y - 25);
		endShape(CLOSE);
		//Eyes
		fill(0);
		rect(gameChar_x - 20, gameChar_y - 45, 18, 10);
		fill(255,0,0);
		ellipse(gameChar_x - 15, gameChar_y - 41, 3 ,3);

	}
	else if(isRight)
	{
		// add your walking right code
		//Helmet
		fill(150, 160, 180, 140);
		beginShape();
		vertex(gameChar_x - 20, gameChar_y - 60);
		vertex(gameChar_x + 20, gameChar_y - 60);
		vertex(gameChar_x + 20, gameChar_y - 25);
		vertex(gameChar_x + 10, gameChar_y - 10);
		vertex(gameChar_x - 20, gameChar_y - 25);
		endShape(CLOSE);
		//Eyes
		fill(0);
		rect(gameChar_x + 2, gameChar_y - 45, 18, 10);
		fill(255,0,0);
		ellipse(gameChar_x + 15, gameChar_y - 41, 3 ,3);

	}
	else if(isFalling || isPlummeting)
	{
		// add your jumping facing forwards code
		//Helmet
		fill(150, 160, 180, 140);
		beginShape();
		vertex(gameChar_x - 20, gameChar_y - 60);
		vertex(gameChar_x + 20, gameChar_y - 60);
		vertex(gameChar_x + 20, gameChar_y - 25);
		vertex(gameChar_x, gameChar_y - 10);
		vertex(gameChar_x - 20, gameChar_y - 25);
		endShape(CLOSE);
		//Eyes
		fill(0);
		rect(gameChar_x - 15, gameChar_y - 45, 30, 10);
		fill(255,0,0);
		ellipse(gameChar_x - 7, gameChar_y - 41, 6 ,1);
		ellipse(gameChar_x + 7, gameChar_y - 41, 6 ,1);

	}
	else
	{
		// add your standing front facing code
		//Helmet
		fill(150, 160, 180, 140);
		beginShape();
		vertex(gameChar_x - 20, gameChar_y - 60);
		vertex(gameChar_x + 20, gameChar_y - 60);
		vertex(gameChar_x + 20, gameChar_y - 25);
		vertex(gameChar_x, gameChar_y - 10);
		vertex(gameChar_x - 20, gameChar_y - 25);
		endShape(CLOSE);
		//Eyes
		fill(0);
		rect(gameChar_x - 15, gameChar_y - 45, 30, 10);
		fill(255,0,0);
		ellipse(gameChar_x - 7, gameChar_y - 41, 3 ,3);
		ellipse(gameChar_x + 7, gameChar_y - 41, 3 ,3);

	}

};

//draw Flag
function renderFlagpole() {
	push();
	strokeWeight(5);
	stroke(50);
	line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 250);
	fill(120, 0, 0);

	if (!flagpole.isReached) {
		triangle(
			flagpole.x_pos,
			floorPos_y - 250,
			flagpole.x_pos + 70,
			floorPos_y -225,
			flagpole.x_pos,
			floorPos_y - 190
		);
		} else {
		triangle(
			flagpole.x_pos,
			floorPos_y,
			flagpole.x_pos + 70,
			floorPos_y -25,
			flagpole.x_pos,
			floorPos_y -60
		)
	}

	pop();
};

//flag reached
function checkFlagpole() {
	if (abs(gameChar_x - flagpole.x_pos) < 20) {
		flagpole.isReached = true;
	}

};

//Live count
function checkPlayerDie() {
	if (gameChar_y > height) {
		lives -= 1;
		burnSound.play();

		if (lives <= 0) {
			noLoop();
		} else {
			startGame();
		}
	
	
	}
};

//drawPlatforms
function drawPlatforms(x, y, length) {
	var p = {
		x: x,
		y: y,
		length: length,
		draw: function() {
			noStroke();
			fill(50, 50, 50);
			rect(this.x, this.y, this.length, 20);
		},
		checkContact: function(gc_x, gc_y) {
			if (gc_x > this.x && gc_x < this.x + this.length) {
				var d = this.y - gc_y;
				if (d >= 0 && d < 5) {
					return true;
				}
			}
			return false;
		}
	}
	return p;
}
//drawEnemies
function drawEnemies(x, y, range) {
	this.x = x;
	this.y = y;
	this.range = range;
	
	this.currentX = x;
	this.inc = 1;

	this.update = function() {
		this.currentX += this.inc;
		if (this.currentX >= this.x + this.range) {
			this.inc -= 1;
		} else if (this.currentX < this.x) {
			this.inc = 1;
		}
	}
	this.draw = function () {
		this.update();
		fill(50)
		triangle(this.currentX - 10, this.y + 10, this.currentX, this.y - 10, this.currentX + 10, this.y + 10)
		fill(200, 50, 50)
		ellipse(this.currentX, this.y + 2.5, 10, 10)
	}
	this.checkContact = function(gc_x, gc_y) {
		var d = dist(gc_x, gc_y, this.currentX, this.y)
		if (d < 20) {
			enemySound.play();
			lives -=1;
			if (lives <= 0) {
				noLoop();
			} else {
				startGame();
			}
		}
		return false;
		
	}
}


function startGame() {


	gameChar_x = width/2;
	gameChar_y = floorPos_y;

	isLeft = false;
	isRight = false;
	isPlummeting = false;
	isFalling = false;

	collectables =
	[
		{
			x_pos: 50,
			y_pos: floorPos_y - 25,
			size: 50,
			isFound: false
		},
		{
			x_pos: 1025,
			y_pos: floorPos_y - 25,
			size: 50,
			isFound: false
		},
		{
			x_pos: 1500,
			y_pos: floorPos_y - 175,
			size: 50,
			isFound: false
		},
		{
			x_pos: 2150,
			y_pos: floorPos_y - 25,
			size: 50,
			isFound: false
		},
		{
			x_pos: 2950,
			y_pos: floorPos_y - 200,
			size: 50,
			isFound: false
		},
		{
			x_pos: 3700,
			y_pos: floorPos_y - 175,
			size: 50,
			isFound: false
		},
		{
			x_pos: 3850,
			y_pos: floorPos_y - 225,
			size: 50,
			isFound: false
		},
		{
			x_pos: 3850,
			y_pos: floorPos_y - 125,
			size: 50,
			isFound: false
		},
		{
			x_pos: 4000,
			y_pos: floorPos_y - 175,
			size: 50,
			isFound: false
		}

	];

	canyons = [
		{
			x_pos: -1575,
			width: 1500
		},
		{
			x_pos: 150,
			width: 125
		},
		{
			x_pos: 875,
			width: 100
		},
		{
			x_pos: 1075,
			width: 100
		},

		{
			x_pos: 1600,
			width: 200
		},
		{
			x_pos: 2000,
			width: 100
		},
		{
			x_pos: 2200,
			width: 100
		},
		{
			x_pos: 3000,
			width: 400
		},
		{
			x_pos: 3500,
			width: 600
		},
		{
			x_pos: 3000,
			width: 400
		},
		
	]

	trees_x = [300, 500, 900, 1150, 1350, 1700, 2000, 2300, 2550, 2800, 3100, 3600];
	treePos_y = floorPos_y - 150;


	cloud = 
	{
		x_pos: [-400, 150, 500, 800, 1200, 1600, 1950, 2500, 3100, 3500],
		y_pos: 30,
		size: [250, 200, 180, 220, 190, 170, 250, 150, 180, 170]
	};

	mountain = 
	{
		x_pos: [0, width, width * 2, width * 3],
		y_pos: floorPos_y
	};

	cameraPosX = 0;

	game_score = 0;

	flagpole = {isReached: false, x_pos: 5000};

	platforms = [];
	platforms.push(drawPlatforms(1550, floorPos_y -100, 100));
	platforms.push(drawPlatforms(3000, floorPos_y -100, 200));
	platforms.push(drawPlatforms(3500, floorPos_y -100, 100));
	platforms.push(drawPlatforms(3650, floorPos_y -150, 100));
	platforms.push(drawPlatforms(3800, floorPos_y -200, 100));
	platforms.push(drawPlatforms(3800, floorPos_y -100, 100));
	platforms.push(drawPlatforms(3950, floorPos_y -150, 100));

	enemies = []
	enemies.push(new drawEnemies(-75, floorPos_y - 10, 225));
	enemies.push(new drawEnemies(2300, floorPos_y - 10, 225));
	enemies.push(new drawEnemies(2525, floorPos_y - 10, 225));
	enemies.push(new drawEnemies(2750, floorPos_y - 10, 225));

}
