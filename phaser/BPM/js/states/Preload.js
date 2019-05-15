// define preload state and methods
var Preload = function(game) {};
Preload.prototype = {
	preload: function() {
		console.log('Preload: preload');

		//LOAD IMAGES
		game.load.image('sky', 'assets/img/background.png');
		game.load.image('goscreen', 'assets/img/gameoverNew.png');
		game.load.image('heart', 'assets/img/heart.png');
		game.load.image('skull', 'assets/img/skull.png');
		game.load.image('plus', 'assets/img/plus.png');
		game.load.image('player', 'assets/img/player.png');
		game.load.image('waveformR', 'assets/img/waveformO.png');
		game.load.image('waveformL', 'assets/img/waveformB.png');
		game.load.image('title','assets/img/title.png');
		game.load.image('heartHUD','assets/img/heartHUD.png');
		game.load.image('barFill','assets/img/barFill.png');
		game.load.image('barOutline','assets/img/barOutline.png');
		game.load.image('particle','assets/img/particle.png');


		//LOAD AUDIO
		game.load.path = 'assets/audio/';
		game.load.audio('ALPHA', ['ALPHA TRACK.mp3']);
		game.load.audio('BETA', ['BETA TRACK.mp3']);
		game.load.audio('BEAT', ['BETA BEAT.mp3']);

		game.load.audio('hitEnemySound', 'hitEnemy.mp3');
		game.load.audio('hitPlusSound', 'hitPlus.mp3');
		game.load.audio('hitHeartSound', 'hitHeart.mp3');

	},
	create: function() {
		console.log('Preload: create');

		game.state.start("LogoScreen");
	},
	update: function() {

	}
}
