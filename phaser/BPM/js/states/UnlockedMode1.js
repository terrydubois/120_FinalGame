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
		game.modeUnlockedTextPosCounter = 200;
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
