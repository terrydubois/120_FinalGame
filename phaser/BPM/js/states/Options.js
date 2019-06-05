// define boot state and methods
var Options = function(game) {};
Options.prototype = {
	preload: function() {
		console.log('options: preload');

		
	},
	create: function() {
		console.log('options: create');
		game.add.sprite(0, 0, 'sky');

		// add cutouts background
		options = game.add.sprite(0, 0, 'cutoutBG');

		// setup the options for the options menu
		game.optionsOptions = ['MUSIC             ', 'SFX             ', 'RESET HIGHSCORES  ', 'RESET STARS             ', 'BACK  '];
		game.optionsOptionsText = [game.optionsOptions.length];
		game.optionsOptionCurrent = game.optionsOptions.length - 1;

		// set options for confirmation
		game.optionsConfirm = ['YES  ', 'NO  '];
		game.optionsConfirmText = [game.optionsConfirm.length];
		game.optionsConfirmCurrent = game.optionsConfirmText.length - 1;


		// add blue rectangle for selection
		game.optionsGraphics = game.add.graphics(0, 400);
		game.optionsGraphics.beginFill(0x3361E2);
		game.menuRect = game.optionsGraphics.drawRoundedRect((game.world.width / 2) - 150, 0, 300, 50, 10);
		game.menuRect.anchor.setTo(0.5);
		game.menuRectWidthOriginal = game.menuRect.width;
		game.menuRectWidthDest = 1;
		game.optionsGraphics.endFill();
		game.optionsGraphics.alpha = 0;
		game.optionsGraphicsYDest = 0;
		game.optionsGraphics.anchor.setTo(0.5);
		window.graphics = game.optionsGraphics;

		

		// setup options text
		for (var i = 0; i < game.optionsOptions.length; i++) {
			game.optionsOptionsText[i] = game.add.text(game.world.width / 2, 350 + (i * 50), game.optionsOptions[i], {font: 'Impact', fontStyle: 'italic', fontSize: '30px', fill: '#000', align: 'center'});
			game.optionsOptionsText[i].anchor.setTo(0.5);
		}
		game.optionsTextPlusY = 700;
		game.optionsTextPlusYDest = 0;

		// seup confirm text
		for (var i = 0; i < game.optionsConfirm.length; i++) {
			game.optionsConfirmText[i] = game.add.text(game.world.width / 2, 350 + (i * 50), game.optionsConfirm[i], {font: 'Impact', fontStyle: 'italic', fontSize: '30px', fill: '#000', align: 'center'});
			game.optionsConfirmText[i].anchor.setTo(0.5);
		}
		game.confirmTextPlusY = 700;
		game.confirmTextPlusYDest = game.confirmTextPlusY;



		// add sprites for "sound icons" and "no symbols"
		game.optionsMusicIcon = game.add.sprite(0, 0, 'soundIcon');
		game.optionsSFXIcon = game.add.sprite(0, 0, 'soundIcon');
		game.optionsNoSymbol1 = game.add.sprite(0, 0, 'noSymbol');
		game.optionsNoSymbol2 = game.add.sprite(0, 0, 'noSymbol');
		game.optionsMusicIcon.scale.setTo(0.15);
		game.optionsMusicIcon.anchor.setTo(0.5);
		game.optionsSFXIcon.scale.setTo(0.15);
		game.optionsSFXIcon.anchor.setTo(0.5);
		game.optionsNoSymbol1.scale.setTo(0.15);
		game.optionsNoSymbol1.anchor.setTo(0.5);
		game.optionsNoSymbol2.scale.setTo(0.15);
		game.optionsNoSymbol2.anchor.setTo(0.5);

		// add sprite for star icon
		game.optionsStarIcon = game.add.sprite(0, 0, 'star');
		game.optionsStarIcon.scale.setTo(0.4);
		game.optionsStarIcon.anchor.setTo(0.5);

		
		// add intro flash
		game.optionsIntroFlash = game.add.sprite(0, 0, 'sky');

		game.menuBlipSound = game.add.audio('menuBlipSound');
		game.menuBlipSound.volume = 0.5;

		// sfx on sound
		game.sfxOnSound = game.add.audio('modeStartSound');

		// whether we are on the options or the confirmation
		game.optionsCurrentMenu = 0;

		// whether the player is attempting to reset stars OR reset highscores
		game.resetStarsConfirm = false;

		// set up confirm question text
		game.optionsConfirmQuestionText = game.add.text(game.world.width / 2, -100, 'ARE YOU SURE?  ', {font: 'Impact', fontStyle: 'italic', fontSize: '30px', fill: '#000', align: 'center'});
		game.optionsConfirmQuestionText.anchor.setTo(0.5);

		// add star counter to options
		game.starCountOptionsSprite = game.add.sprite(40, 40, 'star');
		game.starCountOptionsSprite.scale.setTo(0.4);
		game.starCountOptionsSprite.anchor.setTo(0.5);
		game.starCountOptionsText = game.add.text(60, 35, 'x 0', {font: 'Impact', fontStyle: 'italic', fontSize: '25px', fill: '#333', align: 'center'});

		// add reset sprites
		game.resetStarsSprite = game.add.sprite(0, 0, 'resetStars');
		game.resetHSSprite = game.add.sprite(0, 0, 'resetHS');
		game.resetStarsSprite.alpha = 0;
		game.resetHSSprite.alpha = 0;
		game.resetAlphaTimer = 0;
	},
	update: function() {
		game.optionsIntroFlash.alpha -= 0.05;
		game.optionsIntroFlash.alpha = Math.max(game.optionsIntroFlash.alpha, 0);

		// slide options text into screen from bottom
		game.optionsTextPlusY = approachSmooth(game.optionsTextPlusY, game.optionsTextPlusYDest, 8);
		game.confirmTextPlusY = approachSmooth(game.confirmTextPlusY, game.confirmTextPlusYDest, 8);
		game.optionsGraphics.y = approachSmooth(game.optionsGraphics.y, game.optionsGraphicsYDest, 6);
		game.optionsConfirmQuestionText.y = 230 - game.confirmTextPlusY;

		// fade in blue rectangle after text has entered
		var currentPlusY = game.optionsTextPlusY;
		if (game.optionsCurrentMenu == 1) {
			currentPlusY = game.confirmTextPlusY;
		}
		if (Math.abs(currentPlusY - 0) > 10) {
			game.optionsGraphics.alpha = 0;
		}
		else {
			game.optionsGraphics.alpha += 0.1;
			game.optionsGraphics.alpha = Math.min(game.optionsGraphics.alpha, 0.8);
		}




		// set text for confirm question
		if (game.resetStarsConfirm) {
			game.optionsConfirmQuestionText.text = 'ARE YOU SURE YOU WANT TO RESET STARS BACK TO 0?  \nTHIS CANNOT BE UNDONE.  ';
		}
		else {
			game.optionsConfirmQuestionText.text = 'ARE YOU SURE YOU WANT TO RESET ALL HIGHSCORES?  \nTHIS CANNOT BE UNDONE.  ';
		}

		// set Y position for text in options menu
		for (var i = 0; i < game.optionsOptionsText.length; i++) {
			game.optionsOptionsText[i].y = 180 + (i * 70) + game.optionsTextPlusY;
			if (game.optionsOptionCurrent == i && game.optionsCurrentMenu == 0) {
				game.optionsGraphicsYDest = game.optionsOptionsText[i].y - 30;
			}
		}

		// set Y position for text in confirm menu
		for (var i = 0; i < game.optionsConfirmText.length; i++) {
			game.optionsConfirmText[i].y = 400 + (i * 70) + game.confirmTextPlusY;
			if (game.optionsOptionCurrent == i && game.optionsCurrentMenu == 1) {
				game.optionsGraphicsYDest = game.optionsConfirmText[i].y - 30;
			}
		}


		// set position for "sound icons" and "no symbols"
		game.optionsMusicIcon.x = game.optionsOptionsText[0].x + 50;
		game.optionsMusicIcon.y = game.optionsOptionsText[0].y - 5;
		game.optionsNoSymbol1.x = game.optionsMusicIcon.x + 2;
		game.optionsNoSymbol1.y = game.optionsMusicIcon.y;
		game.optionsSFXIcon.x = game.optionsOptionsText[1].x + 50;
		game.optionsSFXIcon.y = game.optionsOptionsText[1].y - 5;
		game.optionsNoSymbol2.x = game.optionsSFXIcon.x + 2;
		game.optionsNoSymbol2.y = game.optionsSFXIcon.y;

		// set position for star icon
		game.optionsStarIcon.x = game.optionsOptionsText[3].x + 85;
		game.optionsStarIcon.y = game.optionsOptionsText[3].y - 5;

		// set proper alpha values for "no symbols"
		game.optionsNoSymbol1.alpha = (game.musicOn) ? 0 : 1;
		game.optionsNoSymbol2.alpha = (game.sfxOn) ? 0 : 1;

		// get how many options are there on this menu
		var currentOptionMax = 4;
		if (game.optionsCurrentMenu == 1) {
			currentOptionMax = game.optionsConfirm.length - 1;
			game.optionsTextPlusYDest = 700;
			game.confirmTextPlusYDest = 0;
		}
		else {
			game.optionsTextPlusYDest = 0;
			game.confirmTextPlusYDest = 700;
		}


		// player cycles through options using UP and DOWN
		if (game.input.keyboard.justPressed(Phaser.Keyboard.DOWN)
		|| game.input.keyboard.justPressed(Phaser.Keyboard.S)) {
			if (game.sfxOn) {
				game.menuBlipSound.play();
			}
			if (game.optionsOptionCurrent < currentOptionMax) {
				game.optionsOptionCurrent++;
			}
			else {
				game.optionsOptionCurrent = 0;
			}
		}
		if (game.input.keyboard.justPressed(Phaser.Keyboard.UP)
		|| game.input.keyboard.justPressed(Phaser.Keyboard.W)) {
			if (game.sfxOn) {
				game.menuBlipSound.play();
			}
			if (game.optionsOptionCurrent > 0) {
				game.optionsOptionCurrent--;
			}
			else {
				game.optionsOptionCurrent = currentOptionMax;
			}
		}

		// player input for SPACEBAR or ENTER
		if ((game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)
		|| game.input.keyboard.justPressed(Phaser.Keyboard.ENTER))
		&& game.optionsGraphics.alpha >= 0.5) {

			if (game.resetAlphaTimer <= 0) {

				if (game.optionsCurrentMenu == 0) {
					// if we are in options menu (as opposed to confirm menu)

					if (game.optionsOptionCurrent == 0) {
						// toggle music
						game.musicOn = !game.musicOn;
						if(game.musicOn && !game.isPlaying){
							game.song1.play('',0,1,true);
							game.isPlaying =true;
						}
						else{
							game.isPlaying = false;
							game.sound.stopAll();
						}
					}
					else if (game.optionsOptionCurrent == 1) {
						// toggle sfx
						game.sfxOn = !game.sfxOn;
						if (game.sfxOn) {
							game.sfxOnSound.play();
						}
					}
					else if (game.optionsOptionCurrent == 2) {
						// reset highscores
						game.optionsCurrentMenu = 1;
						game.optionsOptionCurrent = 1;
						game.resetStarsConfirm = false;
					}
					else if (game.optionsOptionCurrent == 3) {
						// reset stars
						game.optionsCurrentMenu = 1;
						game.optionsOptionCurrent = 1;
						game.resetStarsConfirm = true;
					}
					else if (game.optionsOptionCurrent == 4) {
						// return to Main Menu
						game.state.start("MainMenu");
					}

					if (game.optionsOptionCurrent >= currentOptionMax) {
						game.optionsOptionCurrent = 0;
					}
				}
				else {
					// if we are in confirm menu (as opposed to options menu)

					if (game.optionsOptionCurrent == 0) {
						// in this case, they've selected "YES" so we will reset highscores or stars
						if (game.resetStarsConfirm) {
							// reset stars for real!
							game.starsColl = 0;
							localStorage.setItem('starsColl', '0');
							game.mode3UnlockedAlert = false;
							game.mode2UnlockedAlert = false;
							game.resetAlphaTimer = 120;
							game.resetStarsSprite.alpha = 1;
							// go back to options menu
							game.optionsCurrentMenu = 0;
							game.optionsOptionCurrent = game.optionsOptions.length - 1;
						}
						else {
							// reset highscores for real!
							localStorage.setItem('highscore1', '0');
							localStorage.setItem('highscore2', '0');
							localStorage.setItem('highscore3', '0');
							game.resetAlphaTimer = 120;
							game.resetHSSprite.alpha = 1;
							// go back to options menu
							game.optionsCurrentMenu = 0;
							game.optionsOptionCurrent = game.optionsOptions.length - 1;
						}
					}
					else {
						// in this case, they've selected "NO" so we return to options menu
						game.optionsCurrentMenu = 0;
						game.optionsOptionCurrent = game.optionsOptions.length - 1;
					}
				}
			}

			if (game.resetAlphaTimer < 120) {
				game.resetAlphaTimer = 0;
			}
		}

		// update text for the option's star counter
		game.starCountOptionsText.text = 'x ' + game.starsColl + '  ';




		// control alpha timer
		game.resetAlphaTimer--;
		game.resetAlphaTimer = Math.max(game.resetAlphaTimer, 0);

		// bring down alpha of reset sprites if alpha timer has expired
		if (game.resetAlphaTimer <= 0) {
			game.resetStarsSprite.alpha -= 0.04;
			game.resetStarsSprite.alpha = Math.max(game.resetStarsSprite.alpha, 0);
			game.resetHSSprite.alpha -= 0.04;
			game.resetHSSprite.alpha = Math.max(game.resetHSSprite.alpha, 0);
		}

		//esc key also goes back to main menu
		if (game.input.keyboard.justPressed(Phaser.Keyboard.ESC)) {
			game.state.start("MainMenu");
		}

	}
}
