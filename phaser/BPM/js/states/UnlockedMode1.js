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
var UnlockedMode1 = function(game) {};
UnlockedMode1.prototype = {
	preload: function() {
		console.log('UnlockedMode1: preload');	
	},
	create: function() {
		console.log('UnlockedMode1: create');
		game.add.sprite(0, 0, 'sky');

		game.HUDgroup = game.add.group();
		game.add.existing(game.HUDgroup);

		modeUnlockedTextCreate();

		// show text telling player they've unlocked mode 1
		game.mode1UnlockedAlert = true;
		game.modeUnlockedTextPos = 1;
		game.modeUnlockedTextPosCounter = 300;
		if(game.introPlayed){
			game.bgFlashGroup = game.add.group();
			game.add.existing(game.bgFlashGroup);
			spawnFlash(3);
			game.hitStarSound.play('', 0, 0.5, false);

		}

		spawnFlash(3);
	},
	update: function() {

		// go to menu after the text has gone by
		if (game.modeUnlockedTextArr[0].x < -300) {
			game.state.start("MainMenu");
		}

		//esc key also goes back to main menu
		if(game.input.keyboard.justPressed(Phaser.Keyboard.ESC)){
			game.sound.stopAll();
			game.state.start("MainMenu");
		}

		modeUnlockedTextUpdate();
	}
}
