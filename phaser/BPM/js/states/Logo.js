// define logo state and methods
var LogoScreen = function(game) {};
LogoScreen.prototype = {
	preload: function() {
		console.log('LogoScreen: preload');

	},
	create: function() {
		console.log('LogoScreen: create');
	game.add.sprite(0,0,'sky');
	game.menu = game.add.sprite(0,0,'title');
	game.modes = game.add.sprite (0,0,'title');
	game.modes.frameName = 'titlep';
	game.arrows = game.add.sprite(0,0,'title');


	game.choice = 0;
	game.playingr = false;
	game.playingl = false;
	game.mode = 0;
	game.currmode = 1;


	game.arrows.animations.add('left', ['titlel1','titlel2','titlel3','titlel4','titlel5','titlel6','titlel5','titlel4','titlel3','titlel2','titlel1'],30,false);
	game.arrows.animations.add('right', ['titler1','titler2','titler3','titler4','titler5','titler6','titler5','titler4','titler3','titler2','titler1'],30,false);

	//game.arrows.animations.play('left');

	//game.instructionText = game.add.text(game.world.width / 2, game.world.height - 25, "UP and DOWN arrows to move!", { fontSize: '24px',fill:'#4669FE',fontStyle: 'italic'});
	//game.instructionText.anchor.setTo(0.5);

	game.song1 = game.add.audio('BETA');

	},



	update: function() {
console.log(game.choice);

//console.log(game.currmode);

//play button selection
if(game.choice == 0){
	//game.menu.animations.play('play');
	game.menu.frameName = 'title0';
	game.arrows.frameName = 'titlee';

if (game.input.keyboard.justPressed(Phaser.Keyboard.DOWN)){
game.choice = 1;
}
}



//gamemode select section
if(game.choice == 1){




	game.menu.frameName = 'title1';
	game.arrows.frameName = 'titlesd';

if(game.mode == 0){
	game.modes.frameName = 'titlep';
}


if(game.input.keyboard.justPressed(Phaser.Keyboard.RIGHT)){
	game.playingr = true;
	game.choice = 10;
	game.mode += 1;
}

if(game.input.keyboard.justPressed(Phaser.Keyboard.LEFT)){
	game.playingl = true;
	game.choice = 11;
}


//menu control
if (game.input.keyboard.justPressed(Phaser.Keyboard.UP)){
game.choice = 0;
}

if (game.input.keyboard.justPressed(Phaser.Keyboard.DOWN,100)){
game.choice = 2;
}

}




if(game.choice == 10){
	game.arrows.animations.play('right');
	game.time.events.repeat(Phaser.Timer.SECOND * .4, 0, resetFrame, this);

}
if(game.choice == 11){
	game.arrows.animations.play('left');
	game.time.events.repeat(Phaser.Timer.SECOND * .4, 0, resetFrame, this);
}





//credits selection
if(game.choice == 2){
	game.arrows.frameName = 'title2';
	game.menu.frameName = 'titlee';

	//menu control
if (game.input.keyboard.justPressed(Phaser.Keyboard.UP)){
game.choice = 1;
}

}



//mode1 selection
if(game.choice == 3){
	game.menu.frameName = 'title1';
	game.modes.frameName = 'titlem1';

	if(game.input.keyboard.justPressed(Phaser.Keyboard.RIGHT)){
	game.playingr = true;
	game.choice = 10;
	game.mode += 1;
}

if(game.input.keyboard.justPressed(Phaser.Keyboard.LEFT)){
	game.playingl = true;
	game.choice = 11;
	game.mode -= 1;
}

//menu control
if (game.input.keyboard.justPressed(Phaser.Keyboard.UP)){
game.choice = 0;
}

if (game.input.keyboard.justPressed(Phaser.Keyboard.DOWN)){
game.choice = 2;
}


}




//mode2 selection
if(game.choice == 4){
	game.menu.frameName = 'title1';
	game.modes.frameName = 'titlem2';
	if(game.input.keyboard.justPressed(Phaser.Keyboard.RIGHT)){
	game.playingr = true;
	game.choice = 10;
	game.mode += 1;
}

if(game.input.keyboard.justPressed(Phaser.Keyboard.LEFT)){
	game.playingl = true;
	game.choice = 11;
	game.mode -= 1;
}

//menu control
if (game.input.keyboard.justPressed(Phaser.Keyboard.UP)){
game.choice = 0;
}

if (game.input.keyboard.justPressed(Phaser.Keyboard.DOWN)){
game.choice = 2;
}

}

//mode3 selection
if(game.choice == 5){
	game.menu.frameName = 'title1';
	game.modes.frameName = 'titlem3';
		if(game.input.keyboard.justPressed(Phaser.Keyboard.RIGHT)){
	game.playingr = true;
	game.choice = 10;
}

if(game.input.keyboard.justPressed(Phaser.Keyboard.LEFT)){
	game.playingl = true;
	game.choice = 11;
	game.mode -= 1;
}

//menu control
if (game.input.keyboard.justPressed(Phaser.Keyboard.UP)){
game.choice = 0;
}

if (game.input.keyboard.justPressed(Phaser.Keyboard.DOWN)){
game.choice = 2;
}

}


		
		//start game
		if(game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR) && game.choice == 0){
			    			game.sound.stopAll();
			game.state.start('Play');
		}
	}
}

function resetFrame() {

game.playingr = false;
if(game.mode == 0){
game.currmode = 1;
game.choice = 1;
}
if(game.mode == 1){
game.currmode = 3;
game.choice = 3;
}
if(game.mode == 2){
game.currmode = 4;
game.choice = 4;
}
if(game.mode == 3){	
game.currmode = 5;
game.choice = 5;
}
if(game.mode == 4){	
game.currmode = 5;
game.choice = 5;
}
}
	