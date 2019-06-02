// define gameplay state and methods
var Intro = function(game) {};
Intro.prototype = {
	init: function() {
		console.log('Intro: init');

	},
	preload: function() {
		console.log('Intro: preload');

	},
	create: function() {
		console.log('Intro: create');

		game.time.advancedTiming = true;

		game.bgFill = game.add.sprite(0,0,'sky');

        // add music
		game.song1 = game.add.audio('BETA');
		this.beat = game.add.audio('BEAT');
		this.beat.volume = 0.1;


		game.playerEmitter = game.add.emitter(game.world.width/2,game.world.height+300, 250);
		game.playerEmitter.makeParticles('player');

		game.playerEmitter.minParticleScale = 0.3;
		game.playerEmitter.maxParticleScale = 0.5;
		game.playerEmitter.setAlpha(1, 0.0, 250);
    	game.playerEmitter.start(false, 5000, 50);


		game.posLeft = 50;
		game.posRight = game.world.width - game.posLeft;



		rightside = game.add.tileSprite(game.posRight+100, 600, 127, 1800, 'waveformR');
		rightside.anchor.setTo(.5);
		rightside.scale.x  = .2;
        leftside = game.add.tileSprite(game.posLeft-100, 600, 127, 1800, 'waveformL');
        leftside.anchor.setTo(.5);
        leftside.scale.x  = .2;

		game.player = game.add.sprite(game.world.width/2,game.world.height+300,'player');
		game.player.anchor.setTo(.5);
		game.player.scale.setTo(0.7);

		game.player.animations.add('squiggle', [0,1,2,3,4,5,6,7,8,9],8,true);
		game.player.animations.play('squiggle');

		game.switchRate = 1;
		game.playerXSpeedTarget = 20;
		game.playerXSpeed = game.playerXSpeedTarget;
		game.playerYSpeed = 12;
		game.playerPos = 1;
		game.playerCollisionRad = game.player.width / 4;

		game.lastSpawnX = -1;
		game.hasHitPlayer = false;

/*
		//timer to switch sides
		game.time.events.repeat(Phaser.Timer.SECOND * game.switchRate, 1, switchSides, this);

		//timers to spawn objects
		game.time.events.repeat(Phaser.Timer.SECOND * 1, 1, spawnEnemy, this);
		game.time.events.repeat(Phaser.Timer.SECOND * 5, 1, spawnCollect, this);
		game.time.events.repeat(Phaser.Timer.SECOND * 10, 1, spawnHealth, this);

*/

		
/*
		// setup hearts
		game.maxHearts = 7;
		game.startingHearts = 5;
		game.currentHearts = game.startingHearts;
		game.heartSprite = [];
		for (var i = 0; i < game.maxHearts; i++) {
			game.heartSprite[i] = -1;
		}
*/
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

/*

		// text for score
		game.scoreTextArrLength = 5;
		game.scoreTextArr = [game.scoreTextArrLength];

		game.scoreTextDisplay = 0;
		for (var i = 0; i < game.scoreTextArrLength; i++) {
			var currentFill = game.scoreColor2;
			if (i == game.scoreTextArrLength - 1) {
				currentFill = game.scoreColor1;
			}
			game.scoreTextArr[i] = game.add.text(game.world.width - 60, 75, game.currentScore, {font: 'Impact', fontStyle: 'italic', fontSize: '50px', fill: currentFill, align: 'center'});
			game.scoreTextArr[i].anchor.setTo(1);
			game.HUDgroup.add(game.scoreTextArr[i]);
		}
		//text to exit
		game.escapeText = game.add.text(170, 30, 'PRESS ESC TO EXIT    ', {font: 'Impact',fontStyle: 'italic', fontSize: '25px', fill: '#000', align: 'center'});
		game.escapeText.anchor.setTo(0.5);
		game.HUDgroup.add(game.escapeText);

*/
		// text for stars
		game.starCountMenuSprite = game.add.sprite(game.world.width - 90, 50, 'star');
		game.starCountMenuSprite.scale.setTo(0.25);
		game.starCountMenuSprite.anchor.setTo(0.5);
		game.starCountMenuText = game.add.text(game.world.width - 110, 65, '0  ', {font: 'Impact', fontStyle: 'italic', fontSize: '20px', fill: '#333', align: 'center'});
		game.starCountMenuText.anchor.setTo(1);
		game.HUDgroup.add(game.starCountMenuSprite);
		game.HUDgroup.add(game.starCountMenuText);

		game.HUDgroup.y = -300;
		game.HUGgroupDest = 0;
/*
		// text for PRACTICE
		game.practiceText = game.add.text(game.world.width / 2, 90, 'PRACTICE     ', {font: 'Impact',fontStyle: 'italic', fontSize: '20px', fill: '#000', align: 'center'});
		game.practiceText.anchor.setTo(0.5);
		game.practiceTextFadeOut = true;

		game.HUDgroup.add(game.practiceText);

*/

		game.plussesToLevelUp = 4;
		game.currentPlussesToLevelUp = game.plussesToLevelUp;
		game.level = 1;


		// add sounds to game
		game.hitEnemySound = game.add.audio('hitEnemySound');
		game.hitPlusSound = game.add.audio('hitPlusSound');
		game.hitHeartSound = game.add.audio('hitHeartSound');
		game.hitStarSound = game.add.audio('hitStarSound');
		game.levelUpSound = game.add.audio('levelUpSound');
		game.levelUpSound.volume = 0.5;

		//sprite scaling variables for player
		game.minScale = 0.6;
		game.maxScale = 0.8;
		game.scaleFactor = .01;
		game.isBig = false;

		//sprite scaling variables for waves
		game.playerPosChanged = 0;
		game.waveScaleDest = .2;

		game.hasStarted = false;
		game.allowMovement = false;
		game.introPlayed = true;

		game.currentScore = 0;

		// add group for BG sprites
		game.bgGroup = game.add.group();
		game.add.existing(game.bgGroup);
		game.bgFlashGroup = game.add.group();
		game.add.existing(game.bgFlashGroup);

		game.bgAngle = 0;

		game.bgCircleTimer = 0;
		game.bgCircleTimerFull = 60 / 4;

		game.pause = false;

		arrowKeyInstructionsCreate();

			//timer to allow movement
			game.time.events.repeat(Phaser.Timer.SECOND * 5, 1, unlockPlayer, this);


		// variables for bringing in text instructions
		game.spawnedFirstSkull = false;
		game.introInstructionsTimer = 0;

		// add sprites for text instructions
		game.introInstructionsXDest = [game.world.width * 1.5, game.world.width * 1.5, game.world.width * 1.5];
		game.introInstructions1 = game.add.sprite(game.introInstructionsXDest[0], game.world.height * 0.75, 'introInstructions1');
		game.introInstructions1.scale.setTo(0.5);
		game.introInstructions1.anchor.setTo(0.5);
		game.HUDgroup.add(game.introInstructions1);
		game.introInstructions2 = game.add.sprite(game.introInstructionsXDest[1], game.world.height * 0.75, 'introInstructions2');
		game.introInstructions2.scale.setTo(0.5);
		game.introInstructions2.anchor.setTo(0.5);
		game.HUDgroup.add(game.introInstructions2);
		game.introInstructions3 = game.add.sprite(game.introInstructionsXDest[2], game.world.height * 0.75, 'introInstructions3');
		game.introInstructions3.scale.setTo(0.5);
		game.introInstructions3.anchor.setTo(0.5);
		game.HUDgroup.add(game.introInstructions3);


		resetColliderCounts();

	},
	update: function() {

		// slide instructions in smoothly
		game.introInstructions1.x = approachSmooth(game.introInstructions1.x, game.introInstructionsXDest[0], 12);
		game.introInstructions2.x = approachSmooth(game.introInstructions2.x, game.introInstructionsXDest[1], 12);
		game.introInstructions3.x = approachSmooth(game.introInstructions3.x, game.introInstructionsXDest[2], 12);

		// X-position destinations of instruction text
		if (game.skullCount > 0) {
			game.introInstructionsXDest[0] = game.world.width * 0.5;
			game.introInstructionsXDest[1] = game.world.width * 1.5;
			game.introInstructionsXDest[2] = game.world.width * 1.5;
		}
		if (game.plusCount > 0) {
			game.introInstructionsXDest[0] = game.world.width * -0.5;
			game.introInstructionsXDest[1] = game.world.width * 0.5;
			game.introInstructionsXDest[2] = game.world.width * 1.5;
		}
		if (game.level > 1) {
			game.introInstructionsXDest[0] = game.world.width * -0.5;
			game.introInstructionsXDest[1] = game.world.width * -0.5;
			game.introInstructionsXDest[2] = game.world.width * 0.5;
		}




		if (!game.allowMovement) {
			game.player.y -= 1.5;
 
			game.HUDgroup.y = approach(game.HUDgroup.y,game.HUGgroupDest, 1);
			leftside.x = approach(leftside.x, game.posLeft,.5);
			rightside.x = approach(rightside.x,game.posRight,.5);
		}

		// spawn background animation every 0.25 seconds
		if (game.hasStarted) {
			game.bgCircleTimer++;
			if (game.bgCircleTimer >= game.bgCircleTimerFull) {
				//spawnBGCircle();
				game.bgCircleTimer = 0;
			}
		}

/*
		// fade "PRACTICE" text in and out
		if (game.practiceTextFadeOut) {
			if (game.practiceText.alpha > 0) {
				game.practiceText.alpha -= 0.015;
			}
			else {
				game.practiceTextFadeOut = false;
			}
		}
		else {
			if (game.practiceText.alpha < 1) {
				game.practiceText.alpha += 0.03;
			}
			else {
				game.practiceTextFadeOut = true;
			}
		}
		game.practiceText.alpha = Phaser.Math.clamp(game.practiceText.alpha, 0, 1);
*/		

		buldge();
		buldgeWaves();

		game.playerEmitter.emitX = game.player.x;
		game.playerEmitter.emitY = game.player.y;


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
 		rightside.tilePosition.y -= .33;
 		leftside.tilePosition.y -= .33;


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
			
		}
		game.posRight = game.world.width - game.posLeft;


		if(game.allowMovement) {
			//player bounds checking
			game.player.y = Phaser.Math.clamp(game.player.y,0,game.world.height);
		}



		// player input control to start game
		if ((game.input.keyboard.isDown(Phaser.Keyboard.UP)
		|| game.input.keyboard.isDown(Phaser.Keyboard.DOWN)
		|| game.input.keyboard.isDown(Phaser.Keyboard.W)
		|| game.input.keyboard.isDown(Phaser.Keyboard.S))
		&& !game.hasStarted && game.allowMovement) {



			//timer to switch sides
			game.time.events.repeat(Phaser.Timer.SECOND * game.switchRate +7, 1, switchSides, this);

			//timers to spawn objects
			game.time.events.repeat(Phaser.Timer.SECOND * 10, 1, spawnEnemy, this);
			game.time.events.repeat(Phaser.Timer.SECOND * 15, 1, spawnCollect, this);
			//game.time.events.repeat(Phaser.Timer.SECOND * 10, 1, spawnHealth, this);

						

			game.waveScaleDest = game.maxScale;	


			game.song1.play('',0,1,true);
			game.song1._sound.playbackRate.value = 1;
			this.beat.play('',0,.5,false);
			game.hasStarted = true;
		}


		//player input control for movement
		if (!game.pause) {
			if (game.input.keyboard.isDown(Phaser.Keyboard.UP) && game.allowMovement
			|| game.input.keyboard.isDown(Phaser.Keyboard.W) && game.allowMovement) {
				game.player.y -= game.playerYSpeed;
			}
			if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN) && game.allowMovement
			|| game.input.keyboard.isDown(Phaser.Keyboard.S) &&game.allowMovement) {
				game.player.y += game.playerYSpeed;
			}
		}



		//player bounds checking
		//game.player.y = Phaser.Math.clamp(game.player.y,0,game.world.height);

		var currentPlayerXSpeed = game.playerXSpeed;
		game.pause = (game.input.keyboard.isDown(Phaser.Keyboard.Q));
		if (game.pause) {
			currentPlayerXSpeed = 0;
		}

		//player move speed determination
		if (game.playerPos == 1 && game.hasStarted) {
			game.player.x = approach(game.player.x, game.posLeft, currentPlayerXSpeed);
		}
		else if (game.playerPos == 0 && game.hasStarted) {
			game.player.x = approach(game.player.x, game.posRight, currentPlayerXSpeed);	
		}
		else{
		}

		

		blinkPlayer(game.player);
		game.playerEmitter.alpha = game.player.alpha;



		// level up every time currentPlussesToLevelUp hits zero
		if (game.currentPlussesToLevelUp <= 0
		|| (game.debugControls && game.input.keyboard.justPressed(Phaser.Keyboard.O))) {
			game.level++;
			game.plussesToLevelUp++;
			game.currentPlussesToLevelUp = game.plussesToLevelUp;
			if(game.level <= 20){
				game.playerXSpeedTarget += 1;
				game.playerYSpeed += 1.5;
				game.switchRate -=.03;
				game.song1._sound.playbackRate.value +=  .05;
			}
			game.levelUpSound.play();
			game.time.events.repeat(Phaser.Timer.SECOND *2, 1, spawnStar, this);

			//game.posLeft += 20;
			//leftside.x += 20;
			//rightside.x -= 20;
		}


		//esc key also goes back to main menu
		if(game.input.keyboard.justPressed(Phaser.Keyboard.ESC)){
			game.sound.stopAll();
			game.state.start("MainMenu");
		}
		if(game.starsColl > 0){
			game.sound.stopAll();
			game.state.start("MainMenu");	
		}


		// control HUD elements (for practice mode specifically)
		gameplayHUDPractice();
		arrowKeyInstructionsUpdate();

		
	}
	
}