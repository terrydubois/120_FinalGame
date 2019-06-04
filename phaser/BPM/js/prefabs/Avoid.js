// Avoid constructor (used for all colliders, except when in Mode 3)
function Avoid(game, key, frame, scale, rotation, goingUp, ySpeed) {

	this.goingUp = goingUp;

	xPos = Math.random() * game.world.width;
	xPos = Phaser.Math.clamp(xPos, game.posLeft + 150, game.posRight - 150);

	var xPosTries = 0;
	while (Math.abs(xPos - game.lastSpawnX) < 60 && xPosTries < 10) {
		xPos = Math.random() * game.world.width;
		xPos = Phaser.Math.clamp(xPos, game.posLeft + 150, game.posRight - 150);
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

	this.heart = (key == 'heart');
	this.plus = (key == 'plus');
	this.star = (key =='star');


	// increase count of collider
	if (this.heart) {
		game.heartCount++;
	}
	else if (this.plus) {
		game.plusCount++;
	}
	else if (this.star) {
		game.starCount++;
	}
	else {
		game.skullCount++;
	}



	game.physics.enable(this);

	// if game is "paused" then destroy immediately
	this.destroyMe = false;
	if (game.pause && game.state.getCurrentState().key == 'Intro') {
		this.destroyMe = true;
	}
}

Avoid.prototype = Object.create(Phaser.Sprite.prototype);
Avoid.prototype.constructor = Avoid;

// override update function
Avoid.prototype.update = function() {

	// make this move forward
	this.body.velocity.y = this.yVelocity;
	if (game.pause && game.state.getCurrentState().key == 'Intro') {
		this.body.velocity.y = 0;
		console.log("here in avoid")
	}

	// particle emitter should follow this object
	this.colliderEmitter.y = this.y;

	// destroy this obstacle if it is out of bounds
	if (this.goingUp && this.y < -100) {
		this.destroy();
			this.colliderEmitter.destroy();
	}
	else if (!this.goingUp && this.y > game.world.height + 100) {
		this.destroy();
		this.colliderEmitter.destroy();
	}

	// collision with player
	// all colliders will destroy on collision with player
	if (Math.abs(game.player.x - this.x) < this.collisionRad + game.playerCollisionRad
	&& Math.abs(game.player.y - this.y) < this.collisionRad + game.playerCollisionRad
	&& !game.hasHitPlayer && !this.hasHitPlayer) {
		
		this.hasHitPlayer = true;
		this.destroy();
		this.colliderEmitter.destroy();

		if (this.heart) {
			console.log("collision with heart");
			if(game.currentHearts == 7 ){
				game.currentScore += 10 * game.heartMulti;
				game.scoreAddText = new ScoreAddText(game, '', '', 0, 0, this.x, this.y, '+'+ 10*game.heartMulti +'  ');
				game.add.existing(game.scoreAddText);
				game.heartMulti += 1 ;
			}
			game.currentHearts++;
			if(game.sfxOn){
				game.hitHeartSound.play('', 0, 0.5, false);
			}
			spawnFlash(2);
		}
		else if (this.plus) {
			console.log("collision with levelup");
			game.currentPlussesToLevelUp--;
			game.currentScore += 10*game.heartMulti;
			if (game.currentPlussesToLevelUp > 0) {
				if(game.sfxOn){
					game.hitPlusSound.play('', 0, 0.5, false);
				}
			}
			spawnFlash(1);
			game.scoreAddText = new ScoreAddText(game, '', '', 0, 0, this.x, this.y, '+'+ 10*game.heartMulti +'  ');
			game.add.existing(game.scoreAddText);
		}
		else if (this.star) {
			console.log("collision with star");

			game.starsColl++;
			saveStarsColl();
			game.currentScore += 50* game.heartMulti;
			if(game.sfxOn){
			game.hitStarSound.play('', 0, 0.5, false);
			}
			spawnFlash(3);
			game.scoreAddText = new ScoreAddText(game, '', '', 0, 0, this.x, this.y, '+'+ 50*game.heartMulti +'  ');
			game.add.existing(game.scoreAddText);
		}
		else {
			console.log("collision with skull");
			game.heartMulti = 1;
			game.hasHitPlayer = true;
			game.currentHearts--;
			if(game.sfxOn){
			game.hitEnemySound.play('', 0, 0.3, false);
			}
			spawnFlash(0);
		}
	}

	if (this.destroyMe) {
		this.destroy();
	}
}