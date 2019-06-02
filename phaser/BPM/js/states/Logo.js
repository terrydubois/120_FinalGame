// define logo state and methods
var LogoScreen = function(game) {};
LogoScreen.prototype = {
	preload: function() {
		console.log('LogoScreen: preload');

	},
	create: function() {
		console.log('LogoScreen: create');
		// background
		game.logoBG = game.add.sprite(0, 0, 'sky');

		// add logo
		game.logoSprite = game.add.sprite(game.world.width / 2, game.world.height / 2, 'WBLogo');
		game.logoSprite.anchor.setTo(0.5);
		game.logoSprite.alpha = 0;
		game.logoSpriteScale = 1;

		// foreground for fade-out effect
		game.logoFG = game.add.sprite(0, 0, 'sky');
		game.logoFG.alpha = 0;


		//game.choice = 0;
		//game.playingr = false;
		//game.playingl = false;
		//game.mode = 0;
		game.currentMode = 1;
		game.logoTimer = 140;

		game.song1 = game.add.audio('BETA');
		
		resetColliderCounts();

	},



	update: function() {
		
		// shrink and fade logo
		game.logoSprite.alpha += 0.02;
		game.logoSprite.alpha = Math.min(game.logoSprite.alpha, 1);
		game.logoSpriteScale -= 0.001;
		game.logoSprite.scale.setTo(game.logoSpriteScale);

		// fade into Main Menu after logo is seen
		game.logoTimer--;
		if (game.logoTimer <= 0) {
			if (game.logoFG.alpha < 1) {
				game.logoFG.alpha += 0.05;
			}
			else {
				if(game.starsColl == 0){
					game.state.start('Intro');
				}
				else{
					game.state.start('MainMenu');
				}
			}
		}

		if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			game.logoTimer = 0;
		}
	}
}
	