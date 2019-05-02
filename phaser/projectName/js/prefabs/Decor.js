// Decor constructor
function Decor(game, key, frame, scale, rotation, pos, criticalY) {

	this.pos = pos;

	// set velocity of this object
	if (this.pos == -1) {
		this.xVelocity = -120;
		var xPos = 900;
	}
	else {
		this.xVelocity = 0;
		var xPos = 925;
	}
	var yPos = game.world.height / 2 - 30;

	Phaser.Sprite.call(this, game, xPos, yPos, key, frame);

	// set essential variables for this object
	this.anchor.set(0.5);
	this.scale.x = scale;
	this.scale.y = scale;
	this.rotation = rotation;
	this.alpha = 1;
	this.criticalY = criticalY;
	this.givenScore = false;
	this.testedCollision = false;
	this.game = game;
	
	this.yVelocity = 50;

	this.rate = 0;
	this.maxRate = 2;

	game.physics.enable(this);
}

Decor.prototype = Object.create(Phaser.Sprite.prototype);
Decor.prototype.constructor = Decor;

// override Decor update function
Decor.prototype.update = function() {

	// increase rate to mimic perspective
	if (this.rate < this.maxRate) {
		this.rate += 0.005;
	}
	else {
		this.rate = this.maxRate;
	}

	// make this move forward
	this.body.velocity.x = this.xVelocity;
	this.body.velocity.y = this.yVelocity;

	// grow scale of object
	if (this.scale.x < 1) {
		this.scale.x += this.rate / 20;
	}
	else {
		this.scale.x = 1;
	}
	this.scale.y = this.scale.x;


	// change velocity
	if (this.pos == -1) {
		this.xVelocity -= (this.rate * 95);
	}
	else {
		this.xVelocity -= this.rate * (60 - (this.pos * 7));
	}
	this.yVelocity += this.rate * 15;
	
	// destroy this obstacle if it is out of bounds
	if (this.body.y > game.world.height + 50) {
		this.kill();
	}
}