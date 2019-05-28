/*

	CMPM 120 - Spring 2019

	TEAM 16: THE WINGED BOYFRIENDS!
	Terrence DuBois, Brady Moore, Merita Lundstrom

	_______________________________
	|	 Final Project: B.P.M.    |
 	| (Bouncing Particle Madness) |
 	¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯
 	chaning github version
*/

var game = new Phaser.Game(1000, 600, Phaser.AUTO);


var highscore;
game.starsColl = 0;
game.debugControls = false;

game.scoreColor1 = '#0f7200';
game.scoreColor2 = '#26D100';

var emitter;

// add states to StateManager
game.state.add('Boot', Boot);
game.state.add('Preload', Preload);
game.state.add('LogoScreen', LogoScreen);
game.state.add('MainMenu', MainMenu);
game.state.add('Practice', Practice);
game.state.add('Mode1', Mode1);
game.state.add('GameOver', GameOver);
game.state.add('Credits', Credits);

// start on Logo
game.state.start('Boot');

function saveStarsColl() {

	// save highscore to browser (credit to Nathan Altice's Paddle Parkour)
	if (localStorage.getItem('starsColl') == null) {
		// in this case, we don't have a saved browser highscore yet, so we set this score as the new highscore
		game.starsColl = 0;
		localStorage.setItem('starsColl', game.starsColl.toString());
		console.log("first time playing game, setting starsColl to 0");
	}
	else {
		// in this case, we have a variable saved to the browser "starsColl"
		// so we get that and compare it to the player's current stars

		game.starsCollFromBrowser = parseInt(localStorage.getItem('starsColl'));

		if (game.starsColl > game.starsCollFromBrowser) {
			localStorage.setItem('starsColl', game.starsColl.toString());
		}
		else {
			game.starsColl = game.starsCollFromBrowser;
		}
		console.log("loading in previous stars");
	}
}


// function for clean movement
function approach(value, valueDest, speed) {

	if (value < valueDest) {
		value += speed;
	}
	else if (value > valueDest) {
		value -= speed;
	}
	if (Math.abs(value - valueDest) < speed) {
		value = valueDest;
	}

	return value;
}

// function for movement that "eases" (curved movement)
function approachSmooth(value, valueDest, divisor) {
	if (value < valueDest) {
		value += Math.abs(valueDest - value) / divisor;
	}
	else if (value > valueDest) {
		value -= Math.abs(valueDest - value) / divisor;
	}
	return value;
}




function gameplayHUD() {
	
	game.world.sendToBack(game.bgGroup);
	game.world.sendToBack(game.bgFlashGroup);
	game.world.sendToBack(game.bgFill);
	game.world.bringToTop(game.HUDgroup);

	// debug controls
	if (game.debugControls) {
		if (game.input.keyboard.justPressed(Phaser.Keyboard.D)) {
			game.currentHearts++;
		}
		if (game.input.keyboard.justPressed(Phaser.Keyboard.A)) {
			game.currentHearts--;
		}
	}

	// update level text
	game.speedupText.text = 'LEVEL ' + game.level + '  ';
	game.speedupText2.text = game.speedupText.text;

	// update score text
	if (game.scoreTextDisplay < game.currentScore) {
		game.scoreTextDisplay += 0.5;
	}
	else if (game.scoreTextDisplay > game.currentScore) {
		game.scoreTextDisplay = game.currentScore;
	}
	
	
	for (var i = 0; i < game.scoreTextArrLength; i++) {
		game.scoreTextArr[i].x = game.world.width - 60 - i;
		game.scoreTextArr[i].y = 75 - i;
		game.scoreTextArr[i].text = Math.floor(game.scoreTextDisplay) + '  ';
	}
	

	// update stars text
	game.starCountMenuText.text = game.starsColl + '  ';

	game.currentHearts = Phaser.Math.clamp(game.currentHearts, 0, game.maxHearts);


	// update hearts HUD
	for (var i = 0; i < game.maxHearts; i++) {

		if (game.heartSprite[i] != -1) {
			game.heartSprite[i].destroy();
			game.heartSprite[i] = -1;
		}

		if (game.currentHearts > i) {
			var currentHeartX = 24 + (i * 58);
			var currentHeartY = 30;
			game.heartSprite[i] = game.add.sprite(currentHeartX, currentHeartY, 'heartHUD');
			game.heartSprite[i].anchor.setTo(0.5);
			game.heartSprite[i].scale.setTo(0.5);
		}
	}
}

function gameplayHUDPractice() {
	
	game.world.sendToBack(game.bgGroup);
	game.world.sendToBack(game.bgFlashGroup);
	game.world.sendToBack(game.bgFill);
	game.world.bringToTop(game.HUDgroup);

	// debug controls
	if (game.debugControls) {
		if (game.input.keyboard.justPressed(Phaser.Keyboard.D)) {
			game.currentHearts++;
		}
		if (game.input.keyboard.justPressed(Phaser.Keyboard.A)) {
			game.currentHearts--;
		}
	}

	// update level text
	game.speedupText.text = 'LEVEL ' + game.level + '  ';
	game.speedupText2.text = game.speedupText.text;

	// update score text
	if (game.scoreTextDisplay < game.currentScore) {
		game.scoreTextDisplay += 0.5;
	}
	else if (game.scoreTextDisplay > game.currentScore) {
		game.scoreTextDisplay = game.currentScore;
	}
	
	
	for (var i = 0; i < game.scoreTextArrLength; i++) {
		game.scoreTextArr[i].x = game.world.width - 60 - i;
		game.scoreTextArr[i].y = 75 - i;
		game.scoreTextArr[i].text = Math.floor(game.scoreTextDisplay) + '  ';
	}
	

	// update stars text
	game.starCountMenuText.text = game.starsColl + '  ';

	game.currentHearts = Phaser.Math.clamp(game.currentHearts, 0, game.maxHearts);

}







//heart spawner
function spawnBGCircle() {

	game.bgCircle = new BGCircle(game, 'bgAnimatedCircle', 'bgAnimatedCircle', 0, 0);
	game.bgGroup.add(game.bgCircle);



	// set up how long to wait until next heart spawn
	var timeTilNextSpawn = 0.25;

	// call this function again in "timeTilNextSpawn" seconds
	game.time.events.repeat(Phaser.Timer.SECOND * timeTilNextSpawn, 1, spawnBGCircle, this);
}

function spawnFlash(type) {

	if (type == 0) {
		game.flashSprite = new Flash(game, 'flashSkull', 'flashSkull', 1, 0);
	}
	else if (type == 1) {
		game.flashSprite = new Flash(game, 'flashPlus', 'flashPlus', 1, 0);
	}
	else if (type == 2) {
		game.flashSprite = new Flash(game, 'flashHeart', 'flashHeart', 1, 0);
	}
	else if (type == 3) {
		game.flashSprite = new Flash(game, 'flashStar', 'flashStar', 1, 0);
	}
	game.bgFlashGroup.add(game.flashSprite);
	
}



//skull spawner
function spawnEnemy() {

	var newEnemySpeed = Math.random() * 350;
	newEnemySpeed = Phaser.Math.clamp(newEnemySpeed, 250, 350);
	game.enemy = new Avoid(game, 'skull', 'skull', .5, 0, game.playerPos, newEnemySpeed);
	game.add.existing(game.enemy);





	// decrease time until next spawn as levels progress
	var maxTimeTilNextSpawn = 2;
	var minTimeTilNextSpawn = 1;
	if (game.level == 1) {
		maxTimeTilNextSpawn = 2;
	}
	else if (game.level == 2) {
		maxTimeTilNextSpawn = 1.75;
	}
	else if (game.level == 3) {
		maxTimeTilNextSpawn = 1.5;
	}
	else if (game.level == 4) {
		maxTimeTilNextSpawn = 1.25;
	}
	else {
		maxTimeTilNextSpawn = 1;
	}

	var timeTilNextSpawn = Math.random() * maxTimeTilNextSpawn;

	// clamp time until next spawn between reasonable minimum and maximum
	timeTilNextSpawn = Phaser.Math.clamp(timeTilNextSpawn, minTimeTilNextSpawn, maxTimeTilNextSpawn);

	// call this function again in "timeTilNextSpawn" seconds
	game.time.events.repeat(Phaser.Timer.SECOND * timeTilNextSpawn, 1, spawnEnemy, this);
}


// plus spawner
function spawnCollect() {
	var newEnemySpeed = Math.random() * 350;
	newEnemySpeed = Phaser.Math.clamp(newEnemySpeed, 150, 350);
	game.Heart = new Avoid(game, 'plus', 'plus', .5, 0, game.playerPos, newEnemySpeed);
	game.add.existing(game.Heart);

	// set up how long to wait until next plus spawn
	var minTimeTilNextSpawn = 3;
	var maxTimeTilNextSpawn = 8;
	if (game.level == 1) {
		maxTimeTilNextSpawn = 7;
	}
	else if (game.level == 2) {
		maxTimeTilNextSpawn = 6;
	}
	else if (game.level == 3) {
		maxTimeTilNextSpawn = 5;
	}
	else if (game.level == 4) {
		maxTimeTilNextSpawn = 4;
	}
	else {
		maxTimeTilNextSpawn = 3;
	}

		var timeTilNextSpawn = Math.random() * 10;

	timeTilNextSpawn = Phaser.Math.clamp(timeTilNextSpawn, minTimeTilNextSpawn, maxTimeTilNextSpawn);
	console.log("time til next plus: " + timeTilNextSpawn);

	// call this function again in "timeTilNextSpawn" seconds
	game.time.events.repeat(Phaser.Timer.SECOND * timeTilNextSpawn, 1, spawnCollect, this);
}



// star spawner
function spawnStar() {
	var newEnemySpeed = Math.random() * 350;
	newEnemySpeed = Phaser.Math.clamp(newEnemySpeed, 150, 350);
	game.Star = new Avoid(game, 'star', 'star', .5, 0, game.playerPos, newEnemySpeed);
	game.add.existing(game.Star);

	// set up how long to wait until next plus spawn
	var timeTilNextSpawn = Math.random() * 50;
	var minTimeTilNextSpawn = 30;
	var maxTimeTilNextSpawn = 45;
	timeTilNextSpawn = Phaser.Math.clamp(timeTilNextSpawn, minTimeTilNextSpawn, maxTimeTilNextSpawn);
	console.log("time til next plus: " + timeTilNextSpawn);

	// call this function again in "timeTilNextSpawn" seconds
	game.time.events.repeat(Phaser.Timer.SECOND * timeTilNextSpawn, 1, spawnStar, this);
}



//heart spawner
function spawnHealth() {
	var newEnemySpeed = Math.random() * 350;
	newEnemySpeed = Phaser.Math.clamp(newEnemySpeed, 150, 250);
	game.Heart = new Avoid(game, 'heart', 'heart', 0.5, 0, game.playerPos, newEnemySpeed);
	game.add.existing(game.Heart);

	// set up how long to wait until next heart spawn
	var timeTilNextSpawn = Math.random() * 15;
	var minTimeTilNextSpawn = 10;
	var maxTimeTilNextSpawn = 15;
	timeTilNextSpawn = Phaser.Math.clamp(timeTilNextSpawn, minTimeTilNextSpawn, maxTimeTilNextSpawn);
	console.log("time til next health: " + timeTilNextSpawn);

	// call this function again in "timeTilNextSpawn" seconds
	game.time.events.repeat(Phaser.Timer.SECOND * timeTilNextSpawn, 1, spawnHealth, this);
}

function switchSides() {
	
	// switch which side player will slide to
	if (game.playerPos == 0) {
		game.playerPos = 1;
		this.beat.play('',0,.5,false);
		game.hasHitPlayer = false;
	}
	else {
		game.playerPos = 0;
		this.beat.play('',0,.5,false);
		game.hasHitPlayer = false;
	}
	game.playerPosChanged = 1;

	// repeat this function
	game.time.events.repeat(Phaser.Timer.SECOND * game.switchRate, 1, switchSides, this);
	
}


function buldge(){

	if(game.player.scale.x < game.maxScale && game.isBig == false){
		game.player.scale.setTo(game.player.scale.x += game.scaleFactor, game.player.scale.y += game.scaleFactor);
	}
	if(game.player.scale.x >= game.maxScale){
		game.isBig = true;
	}


	if(game.player.scale.x > game.minScale && game.isBig == true){
		game.player.scale.setTo(game.player.scale.x -= game.scaleFactor,game.player.scale.y -= game.scaleFactor);
	}
	if(game.player.scale.x <= game.minScale){
		game.isBig = false;
	}
}

function buldgeWaves() {
	if (game.playerPosChanged){
		game.playerPosChanged = 0;

		game.waveScaleDest = game.maxScale;
	}

	if (Math.abs(rightside.scale.x - game.maxScale) < 0.1) {
		game.waveScaleDest = 0.2;
	}
	

	if (rightside.scale.x < game.waveScaleDest) {
		rightside.scale.x += Math.abs(rightside.scale.x - game.waveScaleDest) / 4;
	}
	else if (rightside.scale.x > game.waveScaleDest) {
		rightside.scale.x -= Math.abs(rightside.scale.x - game.waveScaleDest) / 16;	
	}
	leftside.scale.x = rightside.scale.x;
}

function blinkPlayer(playerObj) {

	if (game.hasHitPlayer) {
		if (playerObj.alpha < 1) {
			playerObj.alpha += 0.075;
		}
		else {
			playerObj.alpha = 0;
		}
	}
	else {
		playerObj.alpha = 1;
	}	
}