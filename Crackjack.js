//variables
var player;
var enemy;
var xSize = 1920 * 0.5;
var ySize = 1080 * 0.5;
var playonce = true;
var startWalkingSound = true;
var distx = 0;
distx
//setup
function setup() {
  crackjack = loadGif('characterwalk.gif');
  gopnik = loadGif('enemy1.gif')
  doll = loadGif('enemy2.gif')
  death = loadImage('death.jpeg');
  background1 = loadImage('background.jpg')
  deaths = loadSound('death sound.mp3');
  soundtrack = loadSound('soundtrack.mp3');
  walking = loadSound('footsteps.mp3');
  hit = loadSound('hit.mp3');
  createCanvas(xSize, ySize);
    background(220);
  player = new fish(xSize/4, 0, 0.3, 0, 0, 100, 3);
  enemy = new obstacle(xSize+40, ySize-40, 3, 80, 1);
  enemy2 = new obstacle(xSize*1.5+40, ySize-40, 3, 80, 2);
  wall = new Background();
  lives = new Textobj("Lives: ", "player.lives", 1);
  distance = new Textobj("Distance walked:", "distx10", 2);
}

//player
function fish(_x, _y, _a, _xv, _yv, _size, _lives) {
  //variables for fish
  this.x = _x;
  this.y = _y;
  this.a = _a;
  this.xv = _xv;
  this.yv = _yv;
  this.size = _size;
  this.xsize = this.size*1.375 //xsize with the right proportians compared to size
  this.dead = false;
  this.stopAtStart = true;
  this.lives = _lives;
  this.ground = 0;

  this.move = function() {
    //playing soundtrack once
    if (soundtrack.isLoaded() && soundtrack.isPlaying() == false) {
      soundtrack.play();
    }
    //updating x and y
    this.x += this.xv;
    this.y += this.yv;
    //controls
    if (keyIsDown(UP_ARROW) && this.yv == 0) {
        this.yv = -8;
    }
    else {
      //gravity
      this.yv += this.a;
    }

    if (keyIsDown(RIGHT_ARROW) && !keyIsDown(LEFT_ARROW)) {
      //animation when going right
      this.mirrored = false;
      crackjack.play();
      //acceleration when RIGHT_ARROW is pressed
      this.xv += 1;
    }
    else if (this.xv > 0) {
      //deaccelerate when RIGHT_ARROW is not pressed AND xv is more than 0
      this.xv -= 0.3;
    }
    if (keyIsDown(LEFT_ARROW) && !keyIsDown(RIGHT_ARROW)) {
      //acceleration when LEFT_ARROW is pressed
      this.xv -= 1;
      //flipping animation and running animation
      this.mirrored = true;
      crackjack.play();
    }
    else if (this.xv < 0) {
      //deacceleration when LEFT_ARROW is not pressed AND xv is less than 0
      this.xv += 0.3
    }
    //speed cap
    if (this.xv > 3) {
      this.xv = 3;
    }
    else if (this.xv < -3) {
      this.xv = -3;
    }
    //failsafe to make sure xv defaults to 0
    if (this.xv > -0.3 && this.xv < 0.3) {
        this.xv = 0;
    }
  }

  //collisions with walls and floor.
  this.collision = function() {
    //ground
    if (this.y > ySize - this.size/2) {
      this.y = ySize - this.size/2;
      this.yv = 0;
      this.ground += 1;
    }
    //left wall
    if (this.x+15 < 0 + this.size/2) {
      this.x = -15 + this.size/2;
      console.log("left wall");
    }
    //right wall
    else if (this.x-15 > xSize - this.size/2 - 1) {
      this.x = xSize - this.size/2 + 14;
      console.log("right wall");
    }
  }

  //drawing the player
  this.draw = function() {
    //final gif version of character
    //mirroring gif when moving left
    if (this.mirrored) {
      push();
      scale(-1, 1);
      this.x *= -1;
    }
    imageMode(CENTER);
    image(crackjack, this.x /* * (this.mirrored ? 1 : -1) */, this.y, this.xsize, this.size);
    if (this.mirrored) {
      pop();
      this.x *= -1;
    }
  }
}

//enemy
function obstacle(xx, yy, xxv, _size, _number) {
  //variables for obstacle
  this.x = xx;
  this.y = yy;
  this.xv = xxv;
  this.size = _size;
  this.hit = false;
  this.start = true;
  this.number = _number

  //enemy moving
  this.move = function() {
    //making sure the enemy doesn't move and the walking sound doesn't play untill the player hit the ground
    if (player.ground > 0 && startWalkingSound) {
      walking.play();
      walking.loop();
      /*this.*/startWalkingSound = false;
    }
    if (player.ground > 0) {
      this.x -= this.xv;
      if (this.x < -this.size) {
        this.x = xSize + this.size/2;
        this.hit = false;
      }
    }
  }
  //collision with the player
  this.collision = function() {
    if (/* if there are y coordinates of the player within the y coordinates of the enemy */ player.y - player.size/2 <= this.y + this.size/2 && player.y + player.size/2 >= this.y - this.size/2 && /* if there are x coordinates of the player within the x coordinates of the enemy */ player.x+15 - player.size/2 <= this.x + this.size/4 && player.x + player.size/2 >= this.x+15 - this.size/4 && this.hit == false) {
      player.lives -= 1;
      hit.setVolume(10);
      hit.play();
      this.hit = true;
      console.log("hit")
      if (player.lives == 0) {
        player.dead = true;
      }
    }
  }

  //drawing enemy
  this.draw = function() {
    //rectangle placeholder
    if (this.number == 1) {
      image(gopnik, this.x, this.y, this.size*0.680952381, this.size)
    }
    else if (this.number == 2) {
      image(doll, this.x, this.y, this.size*0.694214876, this.size)
    }
  }
}

//scrolling background
function Background() {
  this.xPos = xSize/2;
  this.yPos = ySize/2;
  this.image = background1;
  this.scrollSpeed = 1;
  this.imageAmount = ceil(xSize / this.image.width) * 2;

  this.draw = function() {
    if (this.image != null) {
      for (i = 0; i < this.imageAmount; i++) {
        image(this.image, this.xPos + i*this.image.width, this.yPos, this.image.width, this.image.height);
      }
    }
  }
  this.move = function() {
    this.xPos -= this.scrollSpeed;
    distx += this.scrollSpeed/10;
    distx10 = round(distx);
    if (this.xPos <= -this.image.width) {
      this.xPos += this.image.width;
    }
  }
}

//text
function Textobj(_text, _textVar, _align) {
  this.text = _text;
  this.showText = true;
  this.yPos = 0;
  this.xPos = 0;
  this.align = _align;

  if (this.align == 1) {
    this.horizAlign = LEFT;
  }
  else if (this.align == 2) {
    this.horizAlign = RIGHT;
    this.xPos = xSize;
  }
  this.vertAlign = TOP;
  this.textSize = 16;

  this.draw = function() {
    if (this.showText) {
      if (_textVar) {this.text = _text.toString() + eval(_textVar);}
      fill(255);
      textSize(this.textSize);
      textAlign(this.horizAlign, this.vertAlign);
      text(this.text, this.xPos, this.yPos);
    }
  }
  this.show = function() {this.showText = true}
  this.hide = function() {this.showText = false}
}

//main loop
function draw() {
  //starting only after everything loaded
  if (soundtrack.isLoaded() && crackjack.loaded() && walking.isLoaded()) {
    //only doing the main loop if the player isn't dead.
    if (player.dead == false) {
      wall.move();
      wall.draw();
      player.move();
      enemy.move();
      enemy2.move();
      player.collision();
      enemy.collision();
      enemy2.collision();
      enemy.draw();
      enemy2.draw();
      player.draw();
      lives.draw();
      distance.draw();
    }
    //death sequence
    else {
      background(100);
      imageMode(CENTER);
      image(death, xSize/2, ySize/2);
      //making sure death sequence only played once
      if (playonce == true) {
        deaths.play();
        soundtrack.pause();
        walking.pause();
        walking.stop();
        walking.setVolume(0);
        playonce = false;
      }
    }
  }
}
