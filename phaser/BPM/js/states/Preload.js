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
		game.load.image('star', 'assets/img/star.png');
		game.load.atlas('player', 'assets/img/player.png', 'assets/img/player.json');
		game.load.image('waveformR', 'assets/img/waveformO.png');
		game.load.image('waveformL', 'assets/img/waveformB.png');
		//game.load.image('title','assets/img/title.png');
		game.load.image('title', 'assets/img/bpmTitle.png');
		game.load.image('menuTriangle', 'assets/img/menuTriangle.png');
		game.load.image('heartHUD','assets/img/heartHUD.png');
		game.load.image('barFill','assets/img/barFill.png');
		game.load.image('barOutline','assets/img/barOutline.png');
		game.load.image('particle','assets/img/particle.png');
		game.load.image('bgAnimatedCircle', 'assets/img/bgAnimatedCircle.png');


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

		// save highscore to browser (credit to Nathan Altice's Paddle Parkour)
		if (localStorage.getItem('starsColl') == null) {
			
			// in this case, we don't have a saved browser highscore yet, so we set this score as the new highscore
			game.starsColl = 0;
			localStorage.setItem('starsColl', game.starsColl.toString());
			
			console.log("first time playing game, setting starsColl to 0");
		}
		else {

			game.starsColl = parseInt(localStorage.getItem('starsColl'));	
			console.log("loading in previous stars");
			
		}


		game.state.start("LogoScreen");
	},
	update: function() {

	}
}
