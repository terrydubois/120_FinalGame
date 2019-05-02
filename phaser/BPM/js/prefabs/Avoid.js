// avoid constructor
function Avoid(game, key, frame, scale, rotation, pos, criticalY, bad) {

	this.pos = pos;

	// set x & y position of this object
	var xPos = 900 + (this.pos * 3);
	var yPos = game.world.height / 2;

	Phaser.Sprite.call(this, game, xPos, yPos, key, frame);

	// set other essential variables for this object
	this.anchor.set(0.5);
	this.scale.x = scale;
	this.scale.y = scale;
	this.rotation = rotation;
	this.alpha = 1;
	this.criticalY = criticalY;
	this.givenScore = false;
	this.testedCollision = false;
	this.game = game;
	this.bad = bad;

	// set velocity of this object
	this.xVelocity = -170 + (this.pos * 50);
	this.yVelocity = 50;

	this.rate = 0;
	this.maxRate = 2;

	game.physics.enable(this);
}

Avoid.prototype = Object.create(Phaser.Sprite.prototype);
Avoid.prototype.constructor = Avoid;

// override update function
Avoid.prototype.update = function() {

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
	this.xVelocity -= this.rate * (30 - (this.pos * 5));
	this.yVelocity += this.rate * 15;

	// test collision if at critical Y position
	if (this.body.y >= this.criticalY && !this.testedCollision) {
		this.testedCollision = true;
		collisionTest(this, this.pos, this.bad);
	}
	
	// destroy this obstacle if it is out of bounds
	if (this.body.y > game.world.height + 50) {
		this.kill();
	}
}