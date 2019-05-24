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

		game.menuTitle = game.add.sprite(game.world.width / 2, 200 + game.menuTitlePlusY, 'title');
		game.menuTitle.anchor.setTo(0.5);

		
		game.menuOptionCurrent = 0;
		game.menuGraphics = game.add.graphics(0, 400);
		game.menuGraphics.beginFill(0x3361E2);
		game.menuRect = game.menuGraphics.drawRoundedRect((game.world.width / 2) - 150, 0, 300, 50, 10);
		game.menuRect.anchor.setTo(0.5);
		game.menuRectWidthOriginal = game.menuRect.width;
		game.menuRectWidthDest = 1;
		game.menuGraphics.endFill();
		game.menuGraphics.alpha = 0.8;
		game.menuGraphicsYDest = 0;
		game.menuGraphics.anchor.setTo(0.5);
		window.graphics = game.menuGraphics;

		game.menuModes = ['PRACTICE  ', 'MODE 1  ', 'MODE 2  ', 'MODE 3  '];
		game.menuOptions = ['PLAY  ', 'MODE  ', 'CREDITS  '];
		game.menuOptionsText = [game.menuOptions.length];

		for (var i = 0; i < game.menuOptions.length; i++) {
			game.menuOptionsText[i] = game.add.text(game.world.width / 2, 400 + (i * 50), game.menuOptions[i], {font: 'Impact', fontStyle: 'italic', fontSize: '30px', fill: '#000', align: 'center'});
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

		game.modeStarsToUnlock = [0, 1, 5, 10];
		game.starCountMenuSprite = game.add.sprite(40, 40, 'star');
		game.starCountMenuSprite.scale.setTo(0.4);
		game.starCountMenuSprite.anchor.setTo(0.5);
		game.starCountMenuText = game.add.text(60, 35, 'x 0', {font: 'Impact', fontStyle: 'italic', fontSize: '25px', fill: '#333', align: 'center'});

		game.flavorTextPlusY = 100;
		game.flavorTextPlusYDest = 0;
		game.flavorText = game.add.text(game.world.width / 2, game.world.height + game.flavorTextPlusY, "FLAVOR TEXT", {font: 'Impact', fontStyle: 'italic', fontSize: '20px', fill: '#333', align: 'center'});
		game.flavorText.anchor.setTo(0.5);
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

			}
			if (game.input.keyboard.justPressed(Phaser.Keyboard.K)) {
				game.starsColl--;
			}

			localStorage.setItem('starsColl', game.starsColl.toString());
		}

		game.starCountMenuText.text = 'x ' + game.starsColl + '  ';
		
		game.menuTitlePlusY = approachSmooth(game.menuTitlePlusY, 0, 8);
		game.menuTitle.y = 150 + game.menuTitlePlusY;

		for (var i = 0; i < game.menuOptionsText.length; i++) {
			game.menuOptionsText[i].y = 400 + (i * 50) - game.menuTitlePlusY;
			if (game.menuOptionCurrent == i) {
				game.menuGraphicsYDest = game.menuOptionsText[i].y - 30;
			}
		}
		game.menuGraphics.anchor.setTo(0.5);
		//game.menuGraphics.x = (game.world.width / 2);
		game.menuGraphics.y = approachSmooth(game.menuGraphics.y, game.menuGraphicsYDest, 6);


		// show arrows if on option 1 (mode select)
		if (game.menuOptionCurrent == 1) {
			game.menuRectWidthDest = 1;

			game.menuTriangleAlphaDest = 1;
			game.menuTriangleAlphaDest = 1;

			// change modes if player presses LEFT while on option 1
			if (game.input.keyboard.justPressed(Phaser.Keyboard.LEFT)) {
				if (game.currentMode > 0) {
					game.currentMode--;
				}
				else {
					game.currentMode = game.menuModes.length - 1;
				}
				game.menuTriangleLeftPlusX += 20;
			}

			// change modes if player presses RIGHT while on option 1
			if (game.input.keyboard.justPressed(Phaser.Keyboard.RIGHT)) {
				if (game.currentMode < game.menuModes.length - 1) {
					game.currentMode++;
				}
				else {
					game.currentMode = 0;
				}
				game.menuTriangleRightPlusX += 20;
			}

			game.flavorTextPlusYDest = 0;
		}
		else {
			game.menuRectWidthDest = 0.6;
			game.menuTriangleAlphaDest = 0;
			game.menuTriangleAlphaDest = 0;

			game.flavorTextPlusYDest = 100;
		}
		
		game.menuOptionsText[1].text = game.menuModes[game.currentMode];

		//game.menuRect.width = approachSmooth(game.menuRect.width, game.menuRectWidthDest * game.menuRectWidthOriginal, 8);
		game.menuTriangleLeftPlusX = approachSmooth(game.menuTriangleLeftPlusX, 0, 8);
		game.menuTriangleRightPlusX = approachSmooth(game.menuTriangleRightPlusX, 0, 8);
		game.menuTriangleLeft.alpha = Phaser.Math.clamp(approach(game.menuTriangleLeft.alpha, game.menuTriangleAlphaDest, 0.25), 0, 1);
		game.menuTriangleRight.alpha = game.menuTriangleLeft.alpha;

		game.menuTriangleLeft.x = (game.world.width / 2) - 100 - game.menuTriangleLeftPlusX;
		game.menuTriangleLeft.y = game.menuGraphics.y + (game.menuGraphics.height / 2);
		game.menuTriangleRight.x = (game.world.width / 2) + 100 + game.menuTriangleRightPlusX;
		game.menuTriangleRight.y = game.menuGraphics.y + (game.menuGraphics.height / 2);


		if (game.modeStarsToUnlock[game.currentMode] > game.starsColl) {
			game.flavorText.text = "COLLECT " + game.modeStarsToUnlock[game.currentMode] + " TO UNLOCK! ";
		}
		else {
			game.flavorTextPlusYDest = 100;
		}
		game.flavorTextPlusY = approachSmooth(game.flavorTextPlusY, game.flavorTextPlusYDest, 8);
		game.flavorText.y = (game.world.height - 30) + game.flavorTextPlusY;





		
		// player cycles through options using UP and DOWN
		if (game.input.keyboard.justPressed(Phaser.Keyboard.DOWN)) {
			if (game.menuOptionCurrent < game.menuOptions.length - 1) {
				game.menuOptionCurrent++;
			}
			else {
				game.menuOptionCurrent = 0;
			}
		}
		else if (game.input.keyboard.justPressed(Phaser.Keyboard.UP)) {
			if (game.menuOptionCurrent > 0) {
				game.menuOptionCurrent--;
			}
			else {
				game.menuOptionCurrent = game.menuOptions.length - 1;
			}
		}

		// player selects option with SPACE
		if (game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)
		|| game.input.keyboard.justPressed(Phaser.Keyboard.ENTER)) {
			console.log("menuOptionCurrent: " + game.menuOptionCurrent);
			if (game.menuOptionCurrent == 0) {
				// play game
				game.state.start('Play');
			}
			else if (game.menuOptionCurrent == 2) {
				// show credits
			}
		}


	}
}