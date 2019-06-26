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

// define Boot state and methods
var Boot = function(game) {};
Boot.prototype = {
	preload: function() {
		console.log('Boot: preload');

		// loading screen assets
		game.load.image('loadingBar', 'assets/img/loadingBar.png');
		game.load.image('loading', 'assets/img/loading.png');


		//set scale to size of screen
		//game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

		// align game to center of screen
		game.scale.pageAlignHorizontally = true;
		game.scale.pageAlignVertically = true;

		//refresh scale size
		//game.scale.setScreenSize( true );
		game.scale.refresh();
	},
	create: function() {
		console.log('Boot: create');

		// start preload state
		game.state.start('Preload');
	},
	update: function() {

	}
}
