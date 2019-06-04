// bg Circle constructor
function BGIcons(game, key, frame, scale, rotation, goingUp, ySpeed) {

	this.goingUp = goingUp;

	xPos = Math.random() * game.world.width;
	xPos = Phaser.Math.clamp(xPos,-50, game.world.width + 50);

	var xPosTries = 0;
	while (Math.abs(xPos - game.lastSpawnX) < 60 && xPosTries < 10) {
		xPos = Math.random() * game.world.width;
		xPos = Phaser.Math.clamp(xPos, -50, game.world.width + 50);
		xPosTries++;
	}
	game.lastSpawnX = xPos;

	if (goingUp) {
		yPos = game.world.height + 100;
		this.yVelocity = -ySpeed; 
	}
	else {
		yPos = -100;
		this.yVelocity = ySpeed; 	
	}


	game.physics.enable(this);

	/*

	// setup particle effcts from colliders
	this.colliderEmitter = game.add.emitter(xPos,yPos, 50);
	this.colliderEmitter.minParticleScale = 0.2;
	this.colliderEmitter.maxParticleScale = 0.5;
	if (key == 'heart') {
		this.colliderEmitter.makeParticles('heartP');
	}
	else if (key == 'plus') {
		this.colliderEmitter.makeParticles('plusP');
	}
	else if (key == 'star') {
		this.colliderEmitter.makeParticles('starP');
	}
	else {
		this.colliderEmitter.makeParticles('skullP');
	}
	this.colliderEmitter.setAlpha(1, 0, 500);
	this.colliderEmitter.start(false, 5000, 250);
*/

	// call Phaser constructor
	Phaser.Sprite.call(this, game, xPos, yPos, key, frame);

	// set other essential variables for this object
	this.anchor.set(0.5);
	this.scale.x = scale;
	this.scale.y = scale;
	this.rotation = rotation;
	this.alpha = 1;

	this.collisionRad = this.width / 2;
	this.hasHitPlayer = false;
	this.rotate = Math.random()*2;


}


BGIcons.prototype = Object.create(Phaser.Sprite.prototype);
BGIcons.prototype.constructor = Avoid;

// override update function
BGIcons.prototype.update = function() {

/*
	// particle emitter should follow this object
	this.colliderEmitter.y = this.y;
*/

	
	// make this move forward
	this.y += this.yVelocity;

	if(this.rotate < 1){
		this.angle += .5;
	}
	else{
		this.angle += -.5;	
	}
	// destroy this obstacle if it is out of bounds
	if (this.goingUp && this.y < -100) {
		this.destroy();
	}
	else if (!this.goingUp && this.y > game.world.height + 100) {
		this.destroy();
	}

}