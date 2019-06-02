// define menu state and methods
var MainMenu = function(game) {};
MainMenu.prototype = {
	preload: function() {
		console.log('MainMenu: preload');
	},
	create: function() {
		console.log('MainMenu: create');

		game.add.sprite(0,0,'sky');

		game.menuTitlePlusY = -600;

		game.menuTitle = game.add.sprite(game.world.width / 2, 150 + game.menuTitlePlusY, 'title');
		game.menuTitle.anchor.setTo(0.5);

		
		game.menuOptionCurrent = 0;
		game.menuGraphics = game.add.graphics(0, 400);
		game.menuGraphics.beginFill(0x3361E2);
		game.menuRect = game.menuGraphics.drawRoundedRect((game.world.width / 2) - 150, 0, 300, 50, 10);
		game.menuRect.anchor.setTo(0.5);
		game.menuRectWidthOriginal = game.menuRect.width;
		game.menuRectWidthDest = 1;
		game.menuGraphics.endFill();
		game.menuGraphicsAlphaDest = 0;
		game.menuGraphics.alpha = 0.8;
		game.menuGraphicsYDest = 0;
		game.menuGraphics.anchor.setTo(0.5);
		game.menuGraphicsPlusX = 0;
		window.graphics = game.menuGraphics;

		game.menuModes = ['PRACTICE  ', 'MODE 1  ', 'MODE 2  ', 'MODE 3  '];
		game.menuOptions = ['PLAY  ', 'MODE  ', 'OPTIONS  ', 'CREDITS  '];
		game.menuOptionsText = [game.menuOptions.length];

		for (var i = 0; i < game.menuOptions.length; i++) {
			game.menuOptionsText[i] = game.add.text(game.world.width / 2, 350 + (i * 50), game.menuOptions[i], {font: 'Impact', fontStyle: 'italic', fontSize: '30px', fill: '#000', align: 'center'});
			game.menuOptionsText[i].anchor.setTo(0.5);
		}

		game.menuTriangleLeft = game.add.sprite((game.world.width / 2) - 100, 0, 'menuTriangle');
		game.menuTriangleRight = game.add.sprite((game.world.width / 2) + 100, 0, 'menuTriangle');
		game.menuTriangleLeft.anchor.setTo(0.5);
		game.menuTriangleRight.anchor.setTo(0.5);
		game.menuTriangleLeft.angle = 180;
		game.menuTriangleLeftPlusX = 0;
		game.menuTriangleRightPlusX = 0;
		game.menuTriangleAlphaDest = 0;

		game.currentModeUnlocked = false;
		game.starCountMenuSprite = game.add.sprite(40, 40, 'star');
		game.starCountMenuSprite.scale.setTo(0.4);
		game.starCountMenuSprite.anchor.setTo(0.5);
		game.starCountMenuText = game.add.text(60, 35, 'x 0', {font: 'Impact', fontStyle: 'italic', fontSize: '25px', fill: '#333', align: 'center'});

		game.flavorTextPlusY = 100;
		game.flavorTextPlusYDest = 0;
		game.flavorText = game.add.text(game.world.width / 2, game.world.height + game.flavorTextPlusY, "FLAVOR TEXT", {font: 'Impact', fontStyle: 'italic', fontSize: '20px', fill: '#333', align: 'center'});
		game.flavorText.anchor.setTo(0.5);
		game.flavorTextStar = game.add.sprite(game.flavorText.x, game.flavorText.y, 'star');
		game.flavorTextStar.scale.setTo(0.3);
		game.flavorTextStar.anchor.setTo(0.5);

		game.menuLock = game.add.sprite(0, 0, 'menuLock');
		game.menuLock.alpha = 0;
		game.menuLockAlphaDest = 0;
		game.menuLockScaleDest = 0.5;
		game.menuLockScaleCurrent = 0.5;
		game.menuLock.scale.setTo(game.menuLockScaleCurrent);
		game.menuLock.anchor.setTo(0.5);
		game.menuLockMaxScale = 0.75;
		game.menuLockMinScale = 0.25;

		// add menu audio
		game.menuBlipSound = game.add.audio('menuBlipSound');
		game.modeStartSound = game.add.audio('modeStartSound');
		game.modeLockedSound = game.add.audio('modeLockedSound');
		game.menuBlipSound.volume = 0.5;
		game.modeStartSound.volume = 0.5;
		game.modeLockedSound.volume = 0.5;

		// add white flash at beginning
		game.menuFlashWhite = game.add.sprite(0, 0, 'sky');
		if(game.introPlayed){
			game.bgFlashGroup = game.add.group();
			game.add.existing(game.bgFlashGroup);
			spawnFlash(3);

			game.dieSound = game.add.audio('levelUpSound');
			game.dieSound.volume = 0.5;
			game.dieSound.play();
			game.introPlayed = false;
		}

		resetColliderCounts();
	},
	update: function() {


							// take out for final game
							if (game.input.keyboard.justPressed(Phaser.Keyboard.SHIFT)) {
								game.debugControls = !game.debugControls;
								console.log("DEBUG CONTROLS: " + game.debugControls);
							}

		if (game.debugControls) {
			if (game.input.keyboard.justPressed(Phaser.Keyboard.L)) {
				game.starsColl++;
				saveStarsColl();
			}
			if (game.input.keyboard.justPressed(Phaser.Keyboard.K)) {
				game.starsColl = 0;
				localStorage.setItem('starsColl', '0');
			}
			if(game.input.keyboard.justPressed(Phaser.Keyboard.M)){
				game.musicOn = !game.musicOn;
				console.log(game.musicOn);
			}
			if(game.input.keyboard.justPressed(Phaser.Keyboard.N)){
				game.sfxOn = !game.sfxOn;
				console.log(game.sfxOn);
			}
		}

		game.starCountMenuText.text = 'x ' + game.starsColl + '  ';
		
		game.menuTitlePlusY = approachSmooth(game.menuTitlePlusY, 0, 8);
		game.menuTitle.y = 165 + game.menuTitlePlusY;
		game.menuFlashWhite.alpha = approach(game.menuFlashWhite.alpha, 0, 0.05);

		for (var i = 0; i < game.menuOptionsText.length; i++) {
			game.menuOptionsText[i].y = 360 + (i * 50) - game.menuTitlePlusY;
			if (game.menuOptionCurrent == i) {
				game.menuGraphicsYDest = game.menuOptionsText[i].y - 30;
			}
		}
		game.menuGraphics.anchor.setTo(0.5);
		// make menu rectangle shake if you select a locked mode
		var currentGraphicsPlusX = game.menuGraphicsPlusX;
		if (game.menuGraphicsPlusX > 0 && Math.random() > 0.5) {
			currentGraphicsPlusX = -currentGraphicsPlusX;
		}
		game.menuGraphics.x = approachSmooth(game.menuGraphics.x, currentGraphicsPlusX, 4);
		game.menuGraphicsPlusX = approach(game.menuGraphicsPlusX, 0, 0.5);
		game.menuOptionsText[0].x = game.menuGraphics.x + (game.world.width / 2);

		game.menuGraphics.y = approachSmooth(game.menuGraphics.y, game.menuGraphicsYDest, 6);
		if (Math.abs(game.menuTitlePlusY - 0) > 10) {
			game.menuGraphics.alpha = 0;
		}
		else {
			game.menuGraphics.alpha += 0.1;
			game.menuGraphics.alpha = Math.min(game.menuGraphics.alpha, 0.8);
		}


		// show arrows if on option 1 (mode select)
		if (game.menuOptionCurrent == 1) {
			game.menuRectWidthDest = 1;

			game.menuTriangleAlphaDest = 1;
			game.menuTriangleAlphaDest = 1;

			// change modes if player presses LEFT while on option 1
			if (game.input.keyboard.justPressed(Phaser.Keyboard.LEFT)
			|| game.input.keyboard.justPressed(Phaser.Keyboard.A)) {
				if(game.sfxOn){
					game.menuBlipSound.play();
				}
				if (game.currentMode > 0) {
					game.currentMode--;
				}
				else {
					game.currentMode = game.menuModes.length - 1;
				}
				game.menuTriangleLeftPlusX += 20;
				game.menuLockScaleDest = game.menuLockMaxScale;
				game.menuLockScaleCurrent = 1;
				game.menuLock.alpha = 0;
			}

			// change modes if player presses RIGHT while on option 1
			if (game.input.keyboard.justPressed(Phaser.Keyboard.RIGHT)
			|| game.input.keyboard.justPressed(Phaser.Keyboard.D)) {
				if(game.sfxOn){
					game.menuBlipSound.play();
				}
				if (game.currentMode < game.menuModes.length - 1) {
					game.currentMode++;
				}
				else {
					game.currentMode = 0;
				}
				game.menuTriangleRightPlusX += 20;
				game.menuLockScaleDest = game.menuLockMaxScale;
				game.menuLockScaleCurrent = 1;
				game.menuLock.alpha = 0;
			}

			game.flavorTextPlusYDest = 0;
		}
		else {
			game.menuRectWidthDest = 0.6;
			game.menuTriangleAlphaDest = 0;
			game.menuTriangleAlphaDest = 0;

			game.flavorTextPlusYDest = 100;
		}
		if (game.menuOptionCurrent == 0 && game.currentModeLocked) {
			game.flavorTextPlusYDest = 0;
		}

		
		game.menuOptionsText[1].text = game.menuModes[game.currentMode];

		//game.menuRect.width = approachSmooth(game.menuRect.width, game.menuRectWidthDest * game.menuRectWidthOriginal, 8);
		game.menuTriangleLeftPlusX = approachSmooth(game.menuTriangleLeftPlusX, 0, 8);
		game.menuTriangleRightPlusX = approachSmooth(game.menuTriangleRightPlusX, 0, 8);
		game.menuTriangleLeft.alpha = Phaser.Math.clamp(approach(game.menuTriangleLeft.alpha, game.menuTriangleAlphaDest, 0.25), 0, 1);
		if (Math.abs(game.menuTitlePlusY - 0) > 2) {
			game.menuTriangleLeft.alpha = 0;
			game.menuTriangleAlphaDest = 0;
		}
		game.menuTriangleRight.alpha = game.menuTriangleLeft.alpha;

		game.menuTriangleLeft.x = (game.world.width / 2) - 100 - game.menuTriangleLeftPlusX;
		game.menuTriangleLeft.y = game.menuGraphics.y + (game.menuGraphics.height / 2);
		game.menuTriangleRight.x = (game.world.width / 2) + 100 + game.menuTriangleRightPlusX;
		game.menuTriangleRight.y = game.menuGraphics.y + (game.menuGraphics.height / 2);

		game.currentModeLocked = (game.modeStarsToUnlock[game.currentMode] > game.starsColl);
		if (game.currentModeLocked) {
			game.flavorText.text = "COLLECT " + game.modeStarsToUnlock[game.currentMode] + "              TO UNLOCK! ";
			game.menuLockAlphaDest = 1;
			game.menuLockScaleDest = game.menuLockMinScale;
		}
		else {
			game.menuLockAlphaDest = 0;
			game.menuLockScaleDest = game.menuLockMaxScale;
			game.menuLockScaleCurrent = 1;
			game.menuLock.alpha = 0;
			game.flavorTextPlusYDest = 100;
		}

		game.menuLock.alpha = approach(game.menuLock.alpha, game.menuLockAlphaDest, 0.05);
		game.menuLockScaleCurrent = approachSmooth(game.menuLockScaleCurrent, game.menuLockScaleDest, 12);
		game.menuLock.scale.setTo(game.menuLockScaleCurrent);
		game.menuLock.x = game.menuOptionsText[1].x;
		game.menuLock.y = game.menuOptionsText[1].y;

		game.flavorTextPlusY = approachSmooth(game.flavorTextPlusY, game.flavorTextPlusYDest + currentGraphicsPlusX, 8);
		game.flavorText.y = (game.world.height - 30) + game.flavorTextPlusY;
		game.flavorTextStar.x = game.flavorText.x;
		game.flavorTextStar.y = game.flavorText.y;




		
		// player cycles through options using UP and DOWN
		if (game.input.keyboard.justPressed(Phaser.Keyboard.DOWN)
		|| game.input.keyboard.justPressed(Phaser.Keyboard.S)) {
			if(game.sfxOn){
				game.menuBlipSound.play();
			}
			if (game.menuOptionCurrent < game.menuOptions.length - 1) {
				game.menuOptionCurrent++;
			}
			else {
				game.menuOptionCurrent = 0;
			}
		}
		if (game.input.keyboard.justPressed(Phaser.Keyboard.UP)
		|| game.input.keyboard.justPressed(Phaser.Keyboard.W)) {
			if(game.sfxOn){
				game.menuBlipSound.play();
			}
			if (game.menuOptionCurrent > 0) {
				game.menuOptionCurrent--;
			}
			else {
				game.menuOptionCurrent = game.menuOptions.length - 1;
			}
		}

		// player selects option with SPACE or ENTER
		if (game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)
		|| game.input.keyboard.justPressed(Phaser.Keyboard.ENTER)) {
			console.log("menuOptionCurrent: " + game.menuOptionCurrent);
			if (game.menuOptionCurrent == 0) {

				if (game.currentModeLocked) {
					// shake blue menu rectangle
					if(game.sfxOn){
						game.modeLockedSound.play();
					}
					game.menuGraphicsPlusX = 20;
				}
				else {
					// play game
					if(game.sfxOn){
						game.modeStartSound.play();
					}
					if (game.currentMode == 0) {
						//game.state.start('Intro');
						game.state.start('Practice');
					}
					else if (game.currentMode == 1) {
						game.state.start('Mode1');
					}
					else if (game.currentMode == 2) {
						game.state.start('Mode2');
					}
					else if (game.currentMode == 3) {
						game.state.start('Mode3');
					}
				}
			}
			else if (game.menuOptionCurrent == 2) {
				// show options
				game.state.start('Options');
			}
			else if (game.menuOptionCurrent == 3) {
				// show credits
				game.state.start('Credits');
			}
		}

		if (game.currentModeLocked && game.menuOptionCurrent < 2) {
			game.menuGraphics.tint = 0xff6075;
		}
		else {
			game.menuGraphics.tint = 0xffffff;
		}


	}
}