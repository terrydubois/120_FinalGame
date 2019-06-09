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

// ScoreAddText constructor
function ScoreAddText(game, key, frame, scale, rotation, x, y, text) {

	Phaser.Sprite.call(this, game, x, y, key, frame);

	// set other essential variables for this object
	this.anchor.set(0.5);
	this.scale.x = scale;
	this.scale.y = scale;
	this.rotation = rotation;
	this.alpha = 1;
	this.text = text;
	this.xSpeed = Math.max(Math.random() * 3, 1);
	this.ySpeed = Math.max(Math.random() * 3, 1);
	if (Math.random() > 0.5) {
		this.xSpeed *= -1;
	}
	if (Math.random() > 0.5) {
		this.ySpeed *= -1;
	}

	this.fadeTimer = 30;

	this.text = game.add.text(this.x, this.y, text, {font: 'Impact', fontStyle: 'italic', fontSize: '25px', fill: game.scoreColor1, align: 'center'});
	this.text.alpha = 1;
}

ScoreAddText.prototype = Object.create(Phaser.Sprite.prototype);
ScoreAddText.prototype.constructor = ScoreAddText;

// override update function
ScoreAddText.prototype.update = function() {

	this.xSpeed = approachSmooth(this.xSpeed, 0, 12);
	this.ySpeed = approachSmooth(this.ySpeed, 0, 12);
	this.x += this.xSpeed;
	this.y += this.ySpeed;
	this.text.x = this.x;
	this.text.y = this.y;

	this.fadeTimer--;

	if (this.fadeTimer <= 0) {
		this.text.alpha -= 0.03;
	}
	if (this.text.alpha <= 0) {
		this.destroy();
	}
}