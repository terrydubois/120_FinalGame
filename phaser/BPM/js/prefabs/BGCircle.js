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

// bg Circle constructor
function BGCircle(game, key, frame, scale, rotation) {

	Phaser.Sprite.call(this, game, game.world.width / 2, game.world.height / 2, key, frame);

	// set other essential variables for this object
	this.anchor.set(0.5);
	this.scale.x = scale;
	this.scale.y = scale;
	this.rotation = rotation;
	this.alpha = 0.35;
	this.maxScale = 1;
	this.scaleIncr = 0.005;

	if (key == 'bgAnimatedTriangle'
	|| key == 'bgAnimatedStar') {
		this.maxScale = 2;
		this.scaleIncr = 0.0075;
	}
}

BGCircle.prototype = Object.create(Phaser.Sprite.prototype);
BGCircle.prototype.constructor = Avoid;

// override update function
BGCircle.prototype.update = function() {

	if (this.scale.x < this.maxScale) {
		this.scale.x += this.scaleIncr;
		this.scale.y = this.scale.x;
	}
	else {
		this.destroy();
	}

	if (this.alpha < 1) {
		this.alpha += 0.001;
	}
	else {
		this.alpha = 1;
	}

	this.angle = game.bgAngle;
}