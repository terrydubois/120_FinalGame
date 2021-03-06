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

// define boot state and methods
var Credits = function(game) {};
Credits.prototype = {
	preload: function() {
		console.log('credits: preload');	
	},
	create: function() {
		console.log('credits: create');
		game.add.sprite(0, 0, 'sky');
		// add cutouts background
		game.add.sprite(0, 0, 'cutoutBG');

		// add blue rectangle for selection
		game.creditsGraphics = game.add.graphics(0, 700);
		game.creditsGraphics.beginFill(0x3361E2);
		game.menuRect = game.creditsGraphics.drawRoundedRect((game.world.width / 2) - 150, 0, 300, 50, 10);
		game.menuRect.anchor.setTo(0.5);
		game.creditsGraphics.endFill();
		game.creditsGraphicsAlphaDest = 0;
		game.creditsGraphics.alpha = 0.8;
		game.creditsGraphicsXDest = 0;
		game.creditsGraphicsYDest = 0;
		game.creditsGraphics.anchor.setTo(0.5);
		window.graphics = game.creditsGraphics;

		game.creditsGraphicsLeftSide = true;

		// the different options and their respective Y-positions
		game.creditsOptionsTotal = 4;
		game.creditsOptionsYPositions = [500, 425, 225, 170];
		game.creditsCurrentOption = 0;

		// add text for back button
		game.creditsBackText = game.add.text(game.world.width / 2, game.creditsOptionsYPositions[0] + 25, 'BACK  ', {font: 'Impact', fontStyle: 'italic', fontSize: '30px', fill: '#000', align: 'center'});
		game.creditsBackText.anchor.setTo(0.5);

		// add credits sprite
		credits = game.add.sprite(0, 0, 'credits');
		
		// add intro flash
		game.creditsIntroFlash = game.add.sprite(0, 0, 'sky');

		game.menuBlipSound = game.add.audio('menuBlipSound');
		game.menuBlipSound.volume = 0.5;
	},
	update: function() {
		game.creditsIntroFlash.alpha -= 0.05;
		game.creditsIntroFlash.alpha = Math.max(game.creditsIntroFlash.alpha, 0);

		// have blue selection rectangle smoothly approach its destination position
		game.creditsGraphicsYDest = game.creditsOptionsYPositions[game.creditsCurrentOption];
		game.creditsGraphics.x = approachSmooth(game.creditsGraphics.x, game.creditsGraphicsXDest, 6);
		game.creditsGraphics.y = approachSmooth(game.creditsGraphics.y, game.creditsGraphicsYDest, 6);


		// if we are on the credits on the top, have blue rectangle slide to the side
		if (game.creditsCurrentOption >= 2) {
			if (game.creditsGraphicsLeftSide) {
				game.creditsGraphicsXDest = -250;
			}
			else {
				game.creditsGraphicsXDest = 250;
			}
		}
		else {
			game.creditsGraphicsXDest = 0;
		}

		// keyboard input for UP & DOWN
		if (game.input.keyboard.justPressed(Phaser.Keyboard.UP)
		|| game.input.keyboard.justPressed(Phaser.Keyboard.W)) {
			game.creditsCurrentOption++;
			if(game.sfxOn){
				game.menuBlipSound.play();
			}
		}
		if (game.input.keyboard.justPressed(Phaser.Keyboard.DOWN)
		|| game.input.keyboard.justPressed(Phaser.Keyboard.S)) {
			game.creditsCurrentOption--;
			if(game.sfxOn){
				game.menuBlipSound.play();
			}
		}
		if (game.creditsCurrentOption > game.creditsOptionsTotal - 1) {
			game.creditsCurrentOption = 0;
		}
		if (game.creditsCurrentOption < 0) {
			game.creditsCurrentOption = game.creditsOptionsTotal - 1;
		}
		// keyboard input for LEFT & RIGHT
		if (game.input.keyboard.justPressed(Phaser.Keyboard.LEFT)
		|| game.input.keyboard.justPressed(Phaser.Keyboard.RIGHT)
		|| game.input.keyboard.justPressed(Phaser.Keyboard.A)
		|| game.input.keyboard.justPressed(Phaser.Keyboard.D)) {
			game.creditsGraphicsLeftSide = !game.creditsGraphicsLeftSide;
			if (game.creditsCurrentOption >= 2) {
				if(game.sfxOn){
					game.menuBlipSound.play();
				}
			}
		}

		// keyboard input for SPACE
		if (game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)
		|| game.input.keyboard.justPressed(Phaser.Keyboard.ENTER)) {
			if (game.creditsCurrentOption == 0) {
				game.state.start("MainMenu");
			}
			else if (game.creditsCurrentOption == 1) {
				window.open("https://www.instagram.com/meritaart/?hl=en");
			}
			else if (game.creditsCurrentOption == 2) {
				if (game.creditsGraphicsLeftSide) {
					window.open("https://terrydubois.io/");
				}
				else {
					window.open("https://soundcloud.com/foxmode");
				}
			}
			else if (game.creditsCurrentOption == 3) {
				if (game.creditsGraphicsLeftSide) {
					window.open("https://kittynugget.itch.io/");
				}
				else {
					window.open("https://soundcloud.com/technicolormotionpicture");
				}
			}
		}

		//touch controls dev
/*
			console.log(game.input.x);
			console.log(game.input.y);
*/			
//500, 425, 225, 170
		if(game.input.pointer1.isDown){

			//back buton checks
			if(game.world.width/2-75 < game.input.x && game.input.x < game.world.width/2+75 &&
			 game.world.height/2+210 < game.input.y && game.input.y < game.world.height/2+240 
			 && game.creditsCurrentOption == 0 && !game.justTouched){	
				game.state.start("MainMenu");
			}
			if(game.world.width/2-75 < game.input.x && game.input.x < game.world.width/2+75 &&
			 game.world.height/2+210 < game.input.y && game.input.y < game.world.height/2+240 
			 && game.creditsCurrentOption != 0 && !game.justTouched){
				game.creditsCurrentOption = 0;
				if (game.sfxOn) {
					game.menuBlipSound.play();
				}
			}

			//merita link checks
			if(game.world.width/2-125 < game.input.x && game.input.x < game.world.width/2+125 &&
			 game.world.height/2+135 < game.input.y && game.input.y < game.world.height/2+165
			 && game.creditsCurrentOption == 1 && !game.justTouched){	
			 	window.open("https://www.instagram.com/meritaart/?hl=en");
			}
			if(game.world.width/2-125 < game.input.x && game.input.x < game.world.width/2+125 &&
			 game.world.height/2+135 < game.input.y && game.input.y < game.world.height/2+165 
			 && game.creditsCurrentOption != 1 && !game.justTouched){
				game.creditsCurrentOption = 1;
				if (game.sfxOn) {
					game.menuBlipSound.play();
				}
			}


			//Terry link checks
			if(game.world.width/2 - 375 < game.input.x && game.input.x < game.world.width/2 - 150 &&
			 game.world.height/2 - 65 < game.input.y && game.input.y < game.world.height/2 - 25 
			 && game.creditsCurrentOption == 2 && !game.justTouched && game.creditsGraphicsLeftSide){	
				window.open("https://terrydubois.io/");
			}
			if(game.world.width/2 - 375 < game.input.x && game.input.x < game.world.width/2 - 150 &&
			 game.world.height/2 - 65 < game.input.y && game.input.y < game.world.height/2 - 25 
			  && !game.justTouched){
				game.creditsCurrentOption = 2;
				if (game.sfxOn) {
					game.menuBlipSound.play();
				}
				game.creditsGraphicsLeftSide = true;
			}

			//Brady link checks
			if(game.world.width/2 - 350 < game.input.x && game.input.x < game.world.width/2 - 175 &&
			 game.world.height/2 - 120 < game.input.y && game.input.y < game.world.height/2 - 80 
			 && game.creditsCurrentOption == 3 && !game.justTouched  && game.creditsGraphicsLeftSide){	
				window.open("https://kittynugget.itch.io/");
			}
			if(game.world.width/2 - 350 < game.input.x && game.input.x < game.world.width/2 - 175 &&
			 game.world.height/2 - 120 < game.input.y && game.input.y < game.world.height/2 - 80 
			  && !game.justTouched){
				game.creditsCurrentOption = 3;
				if (game.sfxOn) {
					game.menuBlipSound.play();
				}
				game.creditsGraphicsLeftSide = true;
			}



			//Alex link checks
			if(game.world.width/2 + 175 < game.input.x && game.input.x < game.world.width/2 + 325 &&
			 game.world.height/2 - 65 < game.input.y && game.input.y < game.world.height/2 - 25 
			 && game.creditsCurrentOption == 2 && !game.justTouched && !game.creditsGraphicsLeftSide){	
				window.open("https://soundcloud.com/foxmode");
			}
			if(game.world.width/2 + 175 < game.input.x && game.input.x < game.world.width/2 + 325 &&
			 game.world.height/2 - 65 < game.input.y && game.input.y < game.world.height/2 - 25 
			 && !game.justTouched){
				game.creditsCurrentOption = 2;
				if (game.sfxOn) {
					game.menuBlipSound.play();
				}
				game.creditsGraphicsLeftSide = false;
			}

			//Devin link checks
			if(game.world.width/2 + 125 < game.input.x && game.input.x < game.world.width/2 + 380 &&
			 game.world.height/2 - 120 < game.input.y && game.input.y < game.world.height/2 - 80 
			 && game.creditsCurrentOption == 3 && !game.justTouched  && !game.creditsGraphicsLeftSide){	
			 	window.open("https://soundcloud.com/technicolormotionpicture");
			}
			if(game.world.width/2 + 125 < game.input.x && game.input.x < game.world.width/2 + 380 &&
			 game.world.height/2 - 120 < game.input.y && game.input.y < game.world.height/2 - 80 
			  && !game.justTouched){
				game.creditsCurrentOption = 3;
				if (game.sfxOn) {
					game.menuBlipSound.play();
				}
				game.creditsGraphicsLeftSide = false;
			}

			game.justTouched = true;

		}
		else{
			game.justTouched = false;
			
		}

		//esc key also goes back to main menu
		if (game.input.keyboard.justPressed(Phaser.Keyboard.ESC)) {
			game.state.start("MainMenu");
		}

	}
}
