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
		game.flashSprite = new Flash(game, 'flashBlack', 'flashBlack', 1, 0);
	}
	else if (type == 1) {
		game.flashSprite = new Flash(game, 'flashGreen', 'flashGreen', 1, 0);
	}
	else if (type == 2) {
		game.flashSprite = new Flash(game, 'flashHeart', 'flashHeart', 1, 0);
	}
	else if (type == 3) {
		game.flashSprite = new Flash(game, 'flashYellow', 'flashYellow', 1, 0);
	}
	game.bgFlashGroup.add(game.flashSprite);
	
}