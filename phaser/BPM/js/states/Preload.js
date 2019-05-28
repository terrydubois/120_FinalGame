// define preload state and methods
var Preload = function(game) {};
Preload.prototype = {
	preload: function() {
		console.log('Preload: preload');

		//LOAD IMAGES
		game.load.image('sky', 'assets/img/background.png');
		game.load.image('goscreen', 'assets/img/gameOver.png');
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
		game.load.image('skullP','assets/img/skullCut.png');
		game.load.image('heartP','assets/img/heart1Cut.png');
		game.load.image('plusP','assets/img/plusCut.png');	
		game.load.image('starP','assets/img/starCut.png');	
		game.load.image('bgAnimatedCircle', 'assets/img/bgAnimatedCircle.png');
		game.load.image('flashYellow', 'assets/img/flashYellow.png');
		game.load.image('flashBlack', 'assets/img/flashBlack.png');
		game.load.image('flashGreen', 'assets/img/flashGreen.png');
		game.load.image('flashHeart', 'assets/img/flashHeart.png');
		game.load.image('menuLock', 'assets/img/lock.png');



		//LOAD AUDIO
		game.load.path = 'assets/audio/';
		game.load.audio('ALPHA', ['ALPHA TRACK.mp3']);
		game.load.audio('BETA', ['BETA TRACK.mp3']);
		game.load.audio('BEAT', ['BETA BEAT.mp3']);

		game.load.audio('hitEnemySound', 'hitEnemy.mp3');
		game.load.audio('hitPlusSound', 'hitPlus.mp3');
		game.load.audio('hitHeartSound', 'hitHeart.mp3');
		game.load.audio('hitPlusSound', 'hitPlus.mp3');
		game.load.audio('menuBlipSound', 'menuBlip.mp3');
		game.load.audio('modeStartSound', 'modeStart.mp3');
		game.load.audio('modeLockedSound', 'modeLocked.mp3');
		game.load.audio('levelUpSound', 'levelUp.mp3');
		game.load.audio('dieSound', 'die.mp3');
	},
	create: function() {
		console.log('Preload: create');

		saveStarsColl();

		game.state.start("LogoScreen");
	},
	update: function() {

	}
}
