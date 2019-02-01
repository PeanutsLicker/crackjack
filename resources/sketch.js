var dx;
var dy;
var restart = true;

function setup() {
  width = 700;
  height = 700;
  createCanvas(width, height);

  player1 = new player(30, mouseX,mouseY, 6, 6);
  ball1 = new ball(30, 350, 50, 4, 4);

}

function draw() {
  background(0, 0, 0);
  player1.render();
  ball1.render();
  ball1.collide();
  if (ball1.xpos < 16){
    ball1.xspeed = 0;
    ball1.yspeed = 0;
    ball1.xpos = -40;
    ball1.ypos = -40;
    background(214, 4, 70);
    textSize(250);
    fill(255,255,255);
    text("YOU LOST", 10, 10, width, height);
    new Audio('./goat.mp3').play()
    delay(99999999);

  }

}

function ball(size, xpos, ypos, xspeed, yspeed){
  this.size = size;
  this.xpos = xpos;
  this.ypos = ypos;
  this.xspeed = xspeed;
  this.yspeed = yspeed;


  this.render = function(){
    noStroke();
		fill (106, 216, 32);
    ellipse(this.xpos, this.ypos, this.size, this.size);
  }
  this.collide = function(){
    var dx = this.xpos - mouseX;
    var dy = this.ypos - mouseY;
    this.xpos += this.xspeed;
    this.ypos += this.yspeed;

    if (this.xpos > width - this.size/2 || this.xpos < 0 + this.size/2){
      this.xspeed = -this.xspeed;
    }
    if (this.ypos > height - this.size/2 || this.ypos < 0 + this.size/2){
      this.yspeed = -this.yspeed;
    }

    if (sqrt(dx*dx + dy*dy) <+ player1.size/2 + this.size/2){
      ball1.xspeed = -ball1.xspeed;
      ball1.yspeed = -ball1.yspeed;
			ball1.xpos = ball1.xpos + dx/1.5;
			ball1.ypos = ball1.ypos + dy/1.5;
      ball1.xspeed = ball1.xspeed +0.8;
      ball1.yspeed = ball1.yspeed +0.8;

    }
  }
}
function player(size, xspeed, yspeed){
  this.size = size;
  this.xspeed = xspeed;
  this.yspeed = yspeed;


  this.render = function(){
    noStroke();
		fill (106, 216, 32);
    ellipse(mouseX, mouseY, this.size, this.size);
  }
}
