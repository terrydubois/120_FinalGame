// define preload state and methods
var Preload = function(game) {};
Preload.prototype = {
	preload: function() {
		console.log('Preload: preload');

		game.load.image('sky', 'assets/img/background.png');
		game.load.image('heart', 'assets/img/heart.png');
		game.load.image('skull', 'assets/img/skull.png');
		game.load.image('plus', 'assets/img/plus.png');
		game.load.image('player', 'assets/img/player.png');
	},
	create: function() {
		console.log('Preload: create');

		game.state.start("LogoScreen");
	},
	update: function() {

	}
}
