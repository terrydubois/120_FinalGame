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


		// add blue rectangle for selection
		game.optionsGraphics = game.add.graphics(0, 400);
		game.optionsGraphics.beginFill(0x3361E2);
		game.menuRect = game.optionsGraphics.drawRoundedRect((game.world.width / 2) - 150, 0, 300, 50, 10);
		game.menuRect.anchor.setTo(0.5);
		game.menuRectWidthOriginal = game.menuRect.width;
		game.menuRectWidthDest = 1;
		game.optionsGraphics.endFill();
		game.optionsGraphicsAlphaDest = 0;
		game.optionsGraphics.alpha = 0.8;
		game.optionsGraphicsYDest = 0;
		game.optionsGraphics.anchor.setTo(0.5);
		window.graphics = game.optionsGraphics;
		

		// setup options text
		for (var i = 0; i < game.optionsOptions.length; i++) {
			game.optionsOptionsText[i] = game.add.text(game.world.width / 2, 350 + (i * 50), game.optionsOptions[i], {font: 'Impact', fontStyle: 'italic', fontSize: '30px', fill: '#000', align: 'center'});
			game.optionsOptionsText[i].anchor.setTo(0.5);
		}
		game.optionsTextPlusY = 700;

		// add sprites for "sound icons" and "no symbols"
		game.optionsMusicIcon = game.add.sprite(0, 0, 'soundIcon');
		game.optionsSFXIcon = game.add.sprite(0, 0, 'soundIcon');
		game.optionsNoSymbol1 = game.add.sprite(0, 0, 'noSymbol');
		game.optionsNoSymbol2 = game.add.sprite(0, 0, 'noSymbol');
		game.optionsMusicIcon.scale.setTo(0.2);
		game.optionsMusicIcon.anchor.setTo(0.5);
		game.optionsSFXIcon.scale.setTo(0.2);
		game.optionsSFXIcon.anchor.setTo(0.5);
		game.optionsNoSymbol1.scale.setTo(0.2);
		game.optionsNoSymbol1.anchor.setTo(0.5);
		game.optionsNoSymbol2.scale.setTo(0.2);
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
	},
	update: function() {
		game.optionsIntroFlash.alpha -= 0.05;
		game.optionsIntroFlash.alpha = Math.max(game.optionsIntroFlash.alpha, 0);

		// slide options text into screen from bottom
		game.optionsTextPlusY = approachSmooth(game.optionsTextPlusY, 0, 8);
		game.optionsGraphics.y = approachSmooth(game.optionsGraphics.y, game.optionsGraphicsYDest, 6);

		// set Y position for text in menu
		for (var i = 0; i < game.optionsOptionsText.length; i++) {
			game.optionsOptionsText[i].y = 180 + (i * 70) + game.optionsTextPlusY;
			if (game.optionsOptionCurrent == i) {
				game.optionsGraphicsYDest = game.optionsOptionsText[i].y - 30;
			}
		}

		// set position for "sound icons" and "no symbols"
		game.optionsMusicIcon.x = game.optionsOptionsText[0].x + 50;
		game.optionsMusicIcon.y = game.optionsOptionsText[0].y;
		game.optionsNoSymbol1.x = game.optionsMusicIcon.x;
		game.optionsNoSymbol1.y = game.optionsMusicIcon.y;
		game.optionsSFXIcon.x = game.optionsOptionsText[1].x + 50;
		game.optionsSFXIcon.y = game.optionsOptionsText[1].y;
		game.optionsNoSymbol2.x = game.optionsSFXIcon.x;
		game.optionsNoSymbol2.y = game.optionsSFXIcon.y;

		// set position for star icon
		game.optionsStarIcon.x = game.optionsOptionsText[3].x + 85;
		game.optionsStarIcon.y = game.optionsOptionsText[3].y - 5;

		// set proper alpha values for "no symbols"
		game.optionsNoSymbol1.alpha = (game.musicOn) ? 0 : 1;
		game.optionsNoSymbol2.alpha = (game.sfxOn) ? 0 : 1;


		// player cycles through options using UP and DOWN
		if (game.input.keyboard.justPressed(Phaser.Keyboard.DOWN)
		|| game.input.keyboard.justPressed(Phaser.Keyboard.S)) {
			if(game.sfxOn){
				game.menuBlipSound.play();
			}
			if (game.optionsOptionCurrent < game.optionsOptions.length - 1) {
				game.optionsOptionCurrent++;
			}
			else {
				game.optionsOptionCurrent = 0;
			}
		}
		if (game.input.keyboard.justPressed(Phaser.Keyboard.UP)
		|| game.input.keyboard.justPressed(Phaser.Keyboard.W)) {
			if(game.sfxOn){
				game.menuBlipSound.play();
			}
			if (game.optionsOptionCurrent > 0) {
				game.optionsOptionCurrent--;
			}
			else {
				game.optionsOptionCurrent = game.optionsOptions.length - 1;
			}
		}

		// player input for SPACEBAR or ENTER
		if (game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)
		|| game.input.keyboard.justPressed(Phaser.Keyboard.ENTER)) {
			if (game.optionsOptionCurrent == 0) {
				// toggle music
				game.musicOn = !game.musicOn;
			}
			else if (game.optionsOptionCurrent == 1) {
				// toggle sfx
				game.sfxOn = !game.sfxOn;
				if (game.sfxOn) {
					game.sfxOnSound.play();
				}
			}
			else if (game.optionsOptionCurrent == 4) {
				// return to Main Menu
				game.state.start("MainMenu");
			}
		}

		

		//esc key also goes back to main menu
		if (game.input.keyboard.justPressed(Phaser.Keyboard.ESC)) {
			game.state.start("MainMenu");
		}

	}
}
