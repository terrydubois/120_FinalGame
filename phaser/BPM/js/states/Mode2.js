/*

	CMPM 120 and ARTG 120 - Spring 2019

	TEAM 16: THE WINGED BOYFRIENDS!
	Terrence DuBois, Brady Moore, Merita Lundstrom

	_______________________________
	|	 Final Project: B.P.M.    |
 	| (Bouncing Particle Madness) |
 	¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯
	 Github: https://github.com/terrydubois/120_FinalGame
	 Itch: https://kittynugget.itch.io/bpm-bouncing-particle-madness
*/

// define gameplay state and methods
var Mode2 = function(game) {};
Mode2.prototype = {
	init: function() {
		console.log('Mode2: init');

	},
	preload: function() {
		console.log('Mode2: preload');

	},
	create: function() {
		console.log('Mode2: create');

		game.time.advancedTiming = true;

		game.bgFill = game.add.sprite(0,0,'sky');

        // add music
		game.song1 = game.add.audio('Mode2');
		this.beat = game.add.audio('BEAT');
		this.beat.volume = 0.1;


		game.playerEmitter = game.add.emitter(game.world.width/2,game.world.height/2+175, 250);
		game.playerEmitter.makeParticles('player');

		game.playerEmitter.minParticleScale = 0.3;
		game.playerEmitter.maxParticleScale = 0.5;
		game.playerEmitter.setAlpha(1, 0.0, 250);
    	game.playerEmitter.start(false, 5000, 50);




		game.posLeft = 50;
		game.posLeftDest = 50;
		game.posRight = game.world.width - game.posLeft;

		game.originalPos =50;
		game.newPos =250;


		rightside = game.add.tileSprite(game.posRight, 0, 127, 1800, 'waveformR');
		rightside.anchor.setTo(.5);
		rightside.scale.x  = .2;
        leftside = game.add.tileSprite(game.posLeft, 0, 127, 1800, 'waveformL');
        leftside.anchor.setTo(.5);
        leftside.scale.x  = .2;

		game.player = game.add.sprite(game.world.width/2,game.world.height/2+175,'player');
		game.player.anchor.setTo(.5);
		game.player.scale.setTo(0.7);

		game.player.animations.add('squiggle', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 8, true);
		game.player.animations.play('squiggle');

		game.switchRate = 1;
		game.playerXSpeedTarget = 20;
		game.playerXSpeed = game.playerXSpeedTarget;
		game.playerYSpeed = 12;
		game.playerPos = 1;
		game.playerCollisionRad = game.player.width / 4;
		game.wavePos = 1;

		game.lastSpawnX = -1;
		game.hasHitPlayer = false;
		

		// setup hearts
		game.maxHearts = 7;
		game.startingHearts = 5;
		game.currentHearts = game.startingHearts;
		game.heartSprite = [];
		for (var i = 0; i < game.maxHearts; i++) {
			game.heartSprite[i] = -1;
		}


		game.HUDgroup = game.add.group();
		game.add.existing(game.HUDgroup);

		// bar for speedup
		game.barFill = game.add.sprite(game.world.width / 2, 20, 'barFill');		
		game.barOutline = game.add.sprite(game.world.width / 2, 20, 'barOutline');
		game.barFill.anchor.setTo(0);
		game.barOutline.anchor.setTo(0);
		game.barFillWidthDest = 0;
		game.barFill.width = 0;
		game.HUDgroup.add(game.barFill);
		game.HUDgroup.add(game.barOutline);

		// text for leveling up
		game.speedupText = game.add.text(game.world.width / 2, 55, 'LEVEL ' + game.level, {font: 'Impact', fontStyle: 'italic', fontSize: '30px', fill: '#fff', align: 'center'});
		game.speedupText2 = game.add.text(game.world.width / 2 - 2, 55 - 2, 'LEVEL ' + game.level, {font: 'Impact', fontStyle: 'italic', fontSize: '30px', fill: '#000', align: 'center'});
		game.speedupText.anchor.setTo(0.5);
		game.speedupText2.anchor.setTo(0.5);
		game.HUDgroup.add(game.speedupText);
		game.HUDgroup.add(game.speedupText2);

		// text for score
		game.scoreTextArrLength = 5;
		game.scoreTextArr = [game.scoreTextArrLength];

		game.scoreTextDisplay = 0;
		for (var i = 0; i < game.scoreTextArrLength; i++) {
			var currentFill = '#26D100';
			if (i == game.scoreTextArrLength - 1) {
				currentFill = '#0f7200';
			}
			game.scoreTextArr[i] = game.add.text(game.world.width - 60, 75, game.currentScore, {font: 'Impact', fontStyle: 'italic', fontSize: '50px', fill: currentFill, align: 'center'});
			game.scoreTextArr[i].anchor.setTo(1);
			game.HUDgroup.add(game.scoreTextArr[i]);
		}

		// text for Multiplier
		game.multiTextArrLength = 5;
		game.multiTextArr = [game.multiTextArrLength];
		for (var i = 0; i < game.multiTextArrLength; i++) {
			var currentFill = game.multiColor2;
			if (i == game.scoreTextArrLength - 1) {
				currentFill = game.multiColor1;
			}
			game.multiTextArr[i] = game.add.text(80, 50, "x  "+game.heartMulti+"  ", {font: 'Impact', fontStyle: 'italic', fontSize: '25px', fill: currentFill, align: 'center'});
			game.multiTextArr[i].anchor.setTo(0);
			game.HUDgroup.add(game.multiTextArr[i]);
		}
		
		

		// text for stars
		game.starCountMenuSprite = game.add.sprite(game.world.width - 90, 80, 'star');
		game.starCountMenuSprite.scale.setTo(0.25);
		game.starCountMenuSprite.anchor.setTo(0.5);
		game.starCountMenuText = game.add.text(game.world.width - 110, 95, '0  ', {font: 'Impact', fontStyle: 'italic', fontSize: '20px', fill: '#333', align: 'center'});
		game.starCountMenuText.anchor.setTo(1);
		game.HUDgroup.add(game.starCountMenuSprite);
		game.HUDgroup.add(game.starCountMenuText);


		// text for FPS
		game.fpsText = game.add.text(game.world.width / 2, 90, 'fps: ' + game.time.fps, {fontStyle: 'italic', fontSize: '15px', fill: '#000', align: 'center'});
		game.fpsText.anchor.setTo(0.5);
		game.fpsText.alpha = 0;
		if (game.debugControls) {
			game.fpsText.alpha = 1;
		}
		game.HUDgroup.add(game.fpsText);



		game.plussesToLevelUp = 4;
		game.currentPlussesToLevelUp = game.plussesToLevelUp;
		game.level = 1;


		// add sounds to game
		game.hitEnemySound = game.add.audio('hitEnemySound');
		game.hitPlusSound = game.add.audio('hitPlusSound');
		game.hitHeartSound = game.add.audio('hitHeartSound');
		game.hitStarSound = game.add.audio('hitStarSound');
		game.levelUpSound = game.add.audio('levelUpSound');
		game.levelUpSound.volume = 0.75;

		//sprite scaling variables for player
		game.minScale = 0.6;
		game.maxScale = 0.8;
		game.scaleFactor = .01;
		game.isBig = false;

		//sprite scaling variables for waves
		game.playerPosChanged = 0;
		game.waveScaleDest = .2;

		game.hasStarted = false;

		game.currentScore = 0;

		// add group for BG sprites
		game.bgGroup = game.add.group();
		game.add.existing(game.bgGroup);
		game.bgFlashGroup = game.add.group();
		game.add.existing(game.bgFlashGroup);

		// background angle starts at 0 but will rotate
		game.bgAngle = 0;
		game.bgAngleIncr = 0.75;
		game.bgAngleIncrDest = 0.75;

		game.bgCircleTimer = 0;
		game.bgCircleTimerFull = 60 / 2;

		arrowKeyInstructionsCreate();
		modeUnlockedTextCreate();

	},
	update: function() {

		// spawn background animation every 0.25 seconds
		if (game.hasStarted) {
			game.bgCircleTimer++;
			if (game.bgCircleTimer >= game.bgCircleTimerFull) {
				spawnBGCircle();
				game.bgCircleTimer = 0;
			}
		}

		// rotate background animations
		game.bgAngle += game.bgAngleIncr;
		game.bgAngleIncr = approach(game.bgAngleIncr, game.bgAngleIncrDest, 0.04);
		
		// track FPS if we are in debug mode
		game.fpsText.text = "fps: " + (game.time.fps);
		

		buldge();
		buldgeWaves();


		game.playerEmitter.emitX = game.player.x;
		game.playerEmitter.emitY = game.player.y;
		
		// Game Over checking
		if(game.currentHearts == 0) {
			game.state.start("GameOver");
		}

		game.heartMulti = game.level;
		if(game.currentHearts >= 7){
			game.multiActive =true;
		}
		else{
			game.multiActive =false;
		}

		if(game.multiActive){
			game.multiPos = approachSmooth(game.multiPos, 0, 8);
		}
		else{
			game.multiPos = approachSmooth(game.multiPos, -200,8);
		}

		// resize speedup bar
		game.barOutline.x = (game.world.width / 2) - (game.barOutline.width / 2);
		game.barFill.x = game.barOutline.x;
		game.barFillWidthDest = ((game.plussesToLevelUp - game.currentPlussesToLevelUp) / game.plussesToLevelUp) * game.barOutline.width;
		game.barFill.width = approachSmooth(game.barFill.width, game.barFillWidthDest, 6);

		//slowdown while approach
		if (game.player.x > game.world.width / 2 + 250 && game.playerPos == 0) {

			game.playerXSpeed -= Math.abs((game.playerXSpeed)) / 12;
		}
		else if (game.player.x < game.world.width / 2 - 250 &&  game.playerPos == 1) {

			game.playerXSpeed -= Math.abs((game.playerXSpeed)) / 12;
		}
		else {
			game.playerXSpeed = game.playerXSpeedTarget;
		}



		//waveform scrolling
 		rightside.tilePosition.y -= 0.33;
 		leftside.tilePosition.y -= 0.33;


		 //screen size changing
		if (game.debugControls) {
			if(game.input.keyboard.isDown(Phaser.Keyboard.W)){
				game.posLeft--;
				leftside.x --;
				rightside.x ++;

			}
			if(game.input.keyboard.isDown(Phaser.Keyboard.S)){
				game.posLeft++;
				leftside.x ++;
				rightside.x --;
			}
			if(game.input.keyboard.justPressed(Phaser.Keyboard.T)){
				game.currentHearts--;
			}
			if(game.input.keyboard.justPressed(Phaser.Keyboard.P)){
				game.currentPlussesToLevelUp--;
			}
			
		}
		game.posRight = game.world.width - game.posLeft;






		// player input control to start game
		if ((game.input.keyboard.isDown(Phaser.Keyboard.UP)
		|| game.input.keyboard.isDown(Phaser.Keyboard.DOWN)
		|| game.input.keyboard.isDown(Phaser.Keyboard.W)
		|| game.input.keyboard.isDown(Phaser.Keyboard.S)
		|| game.input.pointer1.isDown)
		&& !game.hasStarted) {

			//timer to switch sides
			game.time.events.repeat(Phaser.Timer.SECOND * game.switchRate, 1, switchSides, this);
			//game.time.events.repeat(Phaser.Timer.SECOND *8, 1, moveWaves, this);

			//timers to spawn objects
			game.time.events.repeat(Phaser.Timer.SECOND * 1, 1, spawnEnemy, this);
			game.time.events.repeat(Phaser.Timer.SECOND * 5, 1, spawnCollect, this);
			game.time.events.repeat(Phaser.Timer.SECOND * 10, 1, spawnHealth, this);
			game.time.events.repeat(Phaser.Timer.SECOND * 30, 1, spawnStar, this);
						

			game.waveScaleDest = game.maxScale;	

			if(game.musicOn){
				game.song1.play('',0,1,true);
				game.song1._sound.playbackRate.value = 1;
			}	
			if(game.sfxOn){
				this.beat.play('',0,.5,false);
			}
			game.hasStarted = true;
		}


		//player input control for movement
		if (game.input.keyboard.isDown(Phaser.Keyboard.UP)
		|| game.input.keyboard.isDown(Phaser.Keyboard.W)) {
			game.player.y -= game.playerYSpeed;
		}
		if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)
		|| game.input.keyboard.isDown(Phaser.Keyboard.S)) {
			game.player.y += game.playerYSpeed;
		}

		//touch controls

		//player input for mobile
		if(game.input.pointer1.isDown){
			if (game.input.y > game.world.height/2){
				game.player.y += game.playerYSpeed;
			}
			else{
				game.player.y -= game.playerYSpeed;
			}
		}
		else if(game.input.pointer2.isDown){
			if (game.input.y > game.world.height/2){
				game.player.y += game.playerYSpeed;
			}
			else{
				game.player.y -= game.playerYSpeed;
			}
		}


		//player bounds checking
		game.player.y = Phaser.Math.clamp(game.player.y,0,game.world.height);



		//player move speed determination
		if (game.playerPos == 1 && game.hasStarted) {
			game.player.x = approach(game.player.x, game.posLeft, game.playerXSpeed);
		}
		else if (game.playerPos == 0 && game.hasStarted) {
			game.player.x = approach(game.player.x, game.posRight, game.playerXSpeed);	
		}
		else {
		}

		game.posLeft = approachSmooth(game.posLeft,game.posLeftDest,20);
		game.posRight = game.world.width - game.posLeft;

		leftside.x = game.posLeft;
		rightside.x  = game.posRight;



		blinkPlayer(game.player);
		game.playerEmitter.alpha = game.player.alpha;


		levelUpCheck(0.05);


		//esc key also goes back to main menu
		if (game.input.keyboard.justPressed(Phaser.Keyboard.ESC)) {
			game.sound.stopAll();
			game.state.start("GameOver");
		}


		// control HUD elements
		gameplayHUD();

		// show arrow key controls if necessary
		arrowKeyInstructionsUpdate();
		modeUnlockedTextUpdate();
	}
	
}