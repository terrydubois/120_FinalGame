// define Boot state and methods
var Boot = function(game) {};
Boot.prototype = {
	preload: function() {
		console.log('Boot: preload');

		// loading screen assets
		game.load.image('loadingBar', 'assets/img/loadingBar.png');
		game.load.image('loading', 'assets/img/loading.png');

		// align game to center of screen
		game.scale.pageAlignHorizontally = true;
		game.scale.pageAlignVertically = true;
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
