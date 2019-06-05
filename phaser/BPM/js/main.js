/*

	CMPM 120 - Spring 2019

	TEAM 16: THE WINGED BOYFRIENDS!
	Terrence DuBois, Brady Moore, Merita Lundstrom

	_______________________________
	|	 Final Project: B.P.M.    |
 	| (Bouncing Particle Madness) |
 	¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯
 	Github: https://github.com/terrydubois/120_FinalGame
*/

// create game with 1000x600 canvas
var game = new Phaser.Game(1000, 600, Phaser.AUTO);


var highscore;
game.starsColl = 0;
game.debugControls = false;
game.modeUnlockedTextPosCounter = 0;
game.pause = false;
game.heartMulti = 1;
game.sfxOn = true;
game.musicOn =true;
game.multiPos = -200;
game.backSpawn = 0;

game.scoreColor1 = '#0f7200';
game.scoreColor2 = '#26D100';

game.multiColor1 = '#3361E2';
game.multiColor2 = '#ffa14d';

game.modeUnlockedTextColor = '#ff1900';

var emitter;

// add states to StateManager
game.state.add('Boot', Boot);
game.state.add('Preload', Preload);
game.state.add('LogoScreen', LogoScreen);
game.state.add('Intro', Intro);
game.state.add('MainMenu', MainMenu);
game.state.add('Practice', Practice);
game.state.add('Mode1', Mode1);
game.state.add('Mode2', Mode2);
game.state.add('Mode3', Mode3);
game.state.add('GameOver', GameOver);
game.state.add('Credits', Credits);
game.state.add('Options', Options);
game.state.add('UnlockedMode1', UnlockedMode1);

// start on Boot
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



// handle UI elements in HUD (hearts, score, levelup)
function gameplayHUD() {

	// send background animations to back layer, send HUD elements to front layer
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
	
	// update score text and position for score's drop shadow
	for (var i = 0; i < game.scoreTextArrLength; i++) {
		game.scoreTextArr[i].x = game.world.width - 60 - i;
		game.scoreTextArr[i].y = 75 - i;
		game.scoreTextArr[i].text = Math.floor(game.scoreTextDisplay) + '  ';
	}


	// update score text and position for score multiplier's drop shadow
	for (var i = 0; i < game.multiTextArrLength; i++) {
		game.multiTextArr[i].x = game.multiPos + 80 - i;
		game.multiTextArr[i].y =  65 - i;
		game.multiTextArr[i].text = "x  " + game.heartMulti + '  ';
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

// handle UI elements in HUD specifically for practice mode
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







// background animation spawner
function spawnBGCircle() {

	// determine which sprite we will spawn into the background
	var bgAnimationImage = 'bgAnimatedCircle';

	if (game.currentMode == 0) {
		bgAnimationImage = 'bgAnimatedSquare';
	}
	else if (game.currentMode == 1) {
		bgAnimationImage = 'bgAnimatedCircle';
	}
	else if (game.currentMode == 2) {
		bgAnimationImage = 'bgAnimatedTriangle';
	}
	else if (game.currentMode == 3) {
		bgAnimationImage = 'bgAnimatedStar';
	}

	// spawn new background animation sprite
	game.bgAnimation = new BGCircle(game, bgAnimationImage, bgAnimationImage, 0, 0);
	game.bgGroup.add(game.bgAnimation);
}

//main menu animation spawner
function spawnBGIcons(){
	var bgIcon = 'bigSkull';
	var topOrBot = Math.random()*2;
	var top =true;
	if(game.backSpawn ==0){
	var bgIcon = 'bigSkull';
	game.backSpawn ++;
	}
	else if(game.backSpawn == 1){
	var bgIcon = 'bigPlus';
	game.backSpawn ++;
	}
	else if(game.mode2UnlockedAlert == true && game.backSpawn == 2){
	var bgIcon = 'bigHeart';
	game.backSpawn ++;
	}
	else if(game.mode3UnlockedAlert ==true && game.backSpawn == 3){
	var bgIcon = 'bigStar';
	game.backSpawn = 0;
	}
	else{
		game.backSpawn =0;
	}	

	if(topOrBot >1){
		top = true;
	}
	else{
		top = false;
	}
	var newEnemySpeed = Math.random() * 4;
	newEnemySpeed = Phaser.Math.clamp(newEnemySpeed, 2.50, 3.50);



	// spawn new background animation sprite
	game.bgMenuAnimation = new BGIcons(game, bgIcon, bgIcon,.5,0, top, newEnemySpeed);
	game.bgGroup.add(game.bgMenuAnimation);

	game.world.sendToBack(game.bgGroup);
	game.time.events.repeat(Phaser.Timer.SECOND , 1, spawnBGIcons, this);
}



// create flash in background when player hits collider
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

	// add flash to background group so it is sent to the back layer
	game.bgFlashGroup.add(game.flashSprite);
}



//skull spawner
function spawnEnemy() {

	var newEnemySpeed = Math.random() * 350;
	newEnemySpeed = Phaser.Math.clamp(newEnemySpeed, 250, 350);
	if(game.currentMode == 3){
	game.enemy = new AvoidHorz(game, 'skull', 'skull', .5, 0, game.playerPos, newEnemySpeed);
	}
	else{
	game.enemy = new Avoid(game, 'skull', 'skull', .5, 0, game.playerPos, newEnemySpeed);
	}
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
	if(game.currentMode == 3){
	game.Heart = new AvoidHorz(game, 'plus', 'plus', .5, 0, game.playerPos, newEnemySpeed);
	}
	else{
	game.Heart = new Avoid(game, 'plus', 'plus', .5, 0, game.playerPos, newEnemySpeed);
	}
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
	if (game.currentMode == 3){
		game.Star = new AvoidHorz(game, 'star', 'star', .5, 0, game.playerPos, newEnemySpeed);
	}
	else{
		game.Star = new Avoid(game, 'star', 'star', .5, 0, game.playerPos, newEnemySpeed);
	}
	game.add.existing(game.Star);

	// set up how long to wait until next plus spawn
	var timeTilNextSpawn = Math.random() * 50;
	var minTimeTilNextSpawn = 30;
	var maxTimeTilNextSpawn = 45;
	timeTilNextSpawn = Phaser.Math.clamp(timeTilNextSpawn, minTimeTilNextSpawn, maxTimeTilNextSpawn);
	console.log("time til next plus: " + timeTilNextSpawn);
	if (game.state.getCurrentState().key =='Intro') {
		timeTilNextSpawn *= 0.5;
	}

	// call this function again in "timeTilNextSpawn" seconds
	game.time.events.repeat(Phaser.Timer.SECOND * timeTilNextSpawn, 1, spawnStar, this);
}



//heart spawner
function spawnHealth() {
	var newEnemySpeed = Math.random() * 350;
	newEnemySpeed = Phaser.Math.clamp(newEnemySpeed, 150, 250);
	if(game.currentMode == 3){
		game.Heart = new AvoidHorz(game, 'heart', 'heart', 0.5, 0, game.playerPos, newEnemySpeed);
	}
	else{
		game.Heart = new Avoid(game, 'heart', 'heart', 0.5, 0, game.playerPos, newEnemySpeed);
	}
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
		if(game.sfxOn){
			this.beat.play('',0,.5,false);
		}
		game.hasHitPlayer = false;
	}
	else {
		game.playerPos = 0;
		if(game.sfxOn){
			this.beat.play('',0,.5,false);
		}
		game.hasHitPlayer = false;
	}
	game.playerPosChanged = 1;

	// repeat this function
	game.time.events.repeat(Phaser.Timer.SECOND * game.switchRate, 1, switchSides, this);
	
}


function unlockPlayer() {

	game.allowMovement = true;

	// show arrow key controls if necessary
	arrowKeyInstructionsUpdate();
}



function buldge(){
	// scale player up and down for a buldge animation
	if (game.player.scale.x < game.maxScale && !game.isBig) {
		game.player.scale.setTo(game.player.scale.x += game.scaleFactor, game.player.scale.y += game.scaleFactor);
	}
	if (game.player.scale.x >= game.maxScale){
		game.isBig = true;
	}
	if (game.player.scale.x > game.minScale && game.isBig) {
		game.player.scale.setTo(game.player.scale.x -= game.scaleFactor,game.player.scale.y -= game.scaleFactor);
	}
	if (game.player.scale.x <= game.minScale){
		game.isBig = false;
	}
}

function buldgeWaves() {
	// make waves pulsate whenever player launches off of them
	if (game.playerPosChanged) {
		game.playerPosChanged = 0;

		game.waveScaleDest = game.maxScale;
	}

	if (Math.abs(rightside.scale.x - game.maxScale) < 0.1) {
		game.waveScaleDest = 0.2;
	}

	// smoothly bring wave scale to its desired value
	if (rightside.scale.x < game.waveScaleDest) {
		rightside.scale.x += Math.abs(rightside.scale.x - game.waveScaleDest) / 4;
	}
	else if (rightside.scale.x > game.waveScaleDest) {
		rightside.scale.x -= Math.abs(rightside.scale.x - game.waveScaleDest) / 16;	
	}
	leftside.scale.x = rightside.scale.x;
}

function blinkPlayer(playerObj) {
	// blink the player in and out, for invincibility frames
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

// set up arrow key instructions
function arrowKeyInstructionsCreate() {

	game.arrowKeyInstructions = game.add.sprite(game.world.width / 2, game.world.height / 2, 'arrowKeys');
	game.arrowKeyInstructions.anchor.setTo(0.5);
	game.arrowKeyInstructions.alpha = 0;
	game.arrowKeyInstructionsScale = 1.5;
	game.arrowKeyInstructions.scale.setTo(game.arrowKeyInstructionsScale);
	// if this is Mode 3, the arrow keys should be rotated on their side
	if (game.state.getCurrentState().key == 'Mode3') {
		game.arrowKeyInstructions.angle = 90;
	}
	else {
		game.arrowKeyInstructions.angle = 0;
	}

	game.arrowKeyInstructionsTimer = 0;

	game.arrowKeyInstructionsScalePlus = 0;
}

// show arrow key instructions if need be
function arrowKeyInstructionsUpdate() {
	if (game.state.getCurrentState().key =="Intro") {
		if (game.allowMovement) {
			game.arrowKeyInstructionsTimer++;		
		}
	}
	else {
		game.arrowKeyInstructionsTimer++;
	}
	if (game.arrowKeyInstructionsTimer >= 160 && !game.hasStarted) {

		// fade in arrow key controls
		game.arrowKeyInstructions.alpha += 0.02;
		game.arrowKeyInstructions.alpha = Phaser.Math.clamp(game.arrowKeyInstructions.alpha, 0, 1);
		game.arrowKeyInstructionsScale = approachSmooth(game.arrowKeyInstructionsScale, 1, 20);
		game.arrowKeyInstructionsScale = Phaser.Math.clamp(game.arrowKeyInstructionsScale, 1, 1.5);

		game.arrowKeyInstructions.scale.setTo(game.arrowKeyInstructionsScale);
	}
	else {
		game.arrowKeyInstructions.alpha = 0;
	}
}

// setup the text for saying "YOUVE UNLOCKED A NEW MODE"
function modeUnlockedTextCreate() {
	game.modeUnlockedTextArrLength = 7;
	game.modeUnlockedTextArr = [game.modeUnlockedTextArrLength];

	for (var i = 0; i < game.modeUnlockedTextArrLength; i++) {
		game.modeUnlockedTextArr[i] = game.add.text(game.world.width * 1.5, game.world.height * 0.8, "YOU'VE UNLOCKED A NEW MODE!  ", {font: 'Impact', fontStyle: 'italic', fontSize: '30px', fill: '#000', align: 'center'});
		game.modeUnlockedTextArr[i].anchor.setTo(0.5);
		game.HUDgroup.add(game.modeUnlockedTextArr[i]);
	}
	game.modeUnlockedTextPos = 0;
	game.modeUnlockedTextXDest = game.world.width * 1.5;

	newModeUnlockedColor();
}

// control the text saying "YOUVE UNLOCKED A NEW MODE"
function modeUnlockedTextUpdate() {

	// wait a number of frames before the alert flies away
	game.modeUnlockedTextPosCounter--;
	game.modeUnlockedTextPosCounter = Math.max(game.modeUnlockedTextPosCounter, 0);

	// if we have not displayed the alert yet, do so
	if (game.starsColl >= game.modeStarsToUnlock[2] && !game.mode2UnlockedAlert) {
		game.mode2UnlockedAlert = true;
		game.modeUnlockedTextPos = 1;
		game.modeUnlockedTextPosCounter = 200;
		for (var i = 0; i < game.modeUnlockedTextArrLength; i++) {
			game.modeUnlockedTextArr[i].text = "YOU'VE UNLOCKED MODE 2!  ";
		}
	}
	if (game.starsColl >= game.modeStarsToUnlock[3] && !game.mode3UnlockedAlert) {
		game.mode3UnlockedAlert = true;
		game.modeUnlockedTextPos = 1;
		game.modeUnlockedTextPosCounter = 200;
		for (var i = 0; i < game.modeUnlockedTextArrLength; i++) {
			game.modeUnlockedTextArr[i].text = "YOU'VE UNLOCKED MODE 3!  ";
		}
	}

	if (game.state.getCurrentState().key =='UnlockedMode1') {
		for (var i = 0; i < game.modeUnlockedTextArrLength; i++) {
			game.modeUnlockedTextArr[i].text = "YOU'VE UNLOCKED MODE 1!  ";
		}
	}



	// the three X-positions the alert should be at
	if (game.modeUnlockedTextPos == 0) {
		game.modeUnlockedTextXDest = game.world.width * 1.5;
	}
	else if (game.modeUnlockedTextPos == 1) {
		game.modeUnlockedTextXDest = game.world.width * 0.5;

		if (game.modeUnlockedTextPosCounter < 1) {
			game.modeUnlockedTextPos = 2;
		}
	}
	else if (game.modeUnlockedTextPos == 2) {
		game.modeUnlockedTextXDest = game.world.width * -0.5;
	}

	// update mode unlocked position for drop shadow
	for (var i = 0; i < game.modeUnlockedTextArrLength; i++) {
		game.modeUnlockedTextArr[i].x = approachSmooth(game.modeUnlockedTextArr[i].x, game.modeUnlockedTextXDest - i, 12);
		game.modeUnlockedTextArr[i].y = (game.world.height * 0.8) - i;
		// move text up if this is unlocking Mode 1
		if (game.state.getCurrentState().key =='UnlockedMode1') {
			game.modeUnlockedTextArr[i].y -= 200;
		}

		// update drop shadow color
		var currentFill = game.modeUnlockedTextColor;
		if (i == game.modeUnlockedTextArrLength - 1) {
			currentFill = '#000';
		}
		else if (i == game.modeUnlockedTextArrLength - 2) {
			currentFill = '#fff';
		}
		game.modeUnlockedTextArr[i].addColor(currentFill, 0);
	}
}

function newModeUnlockedColor() {
	// get random hex color (source: https://css-tricks.com/snippets/javascript/random-hex-color/)
	game.modeUnlockedTextColor = "#" + Math.floor(Math.random() * 16777215).toString(16);

	// repeat this function
	game.time.events.repeat(Phaser.Timer.SECOND * 0.1, 1, newModeUnlockedColor, this);
}

function resetColliderCounts() {
	// reset count of skulls, plusses, stars, and hearts back to 0
	game.skullCount = 0;
	game.plusCount = 0;
	game.starCount = 0;
	game.heartCount = 0;
}