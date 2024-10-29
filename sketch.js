let ship;
let bullets = [];
let enemies = [];
let score = 0; 
let combo = 0; 
let lives = 2; 
let gameState = "start"; 
let defeatedEnemies = 0; 

function setup() {
  createCanvas(1000, 500);
  ship = new Ship();
}

function draw() {
  background(0);

  if (gameState === "start") {
    showStartScreen(); 
  } else if (gameState === "playing") {
    
    fill(255);
    textSize(22);
    textAlign(LEFT); 
    text("スコア: " + score, 10, 20);
    text("コンボ: " + combo, 10, 45); 
    text(" 残基: " + lives, 10, 70); 

    
    ship.show();
    ship.move();

    
    for (let i = bullets.length - 1; i >= 0; i--) {
      bullets[i].show();
      bullets[i].move();

      for (let j = enemies.length - 1; j >= 0; j--) {
        if (bullets[i].hits(enemies[j])) {
          let enemy = enemies[j];
          enemies.splice(j, 1); 
          bullets.splice(i, 1); 
          combo++; 
          defeatedEnemies++; 

          
          if (enemy.type === "large") {
            score += 100 + combo * 50; 
          } else if (enemy.type === "small") {
            score += 100; 
          }

          
          if (defeatedEnemies === 250) {
            enemies.push(new Enemy(random(width), random(100), "yellow")); 
          } else {
            enemies.push(new Enemy(random(width), random(100))); 
          }
          break; 
        }
      }

      if (bullets[i] && bullets[i].offscreen()) {
        bullets.splice(i, 1); 
      }
    }

    
    for (let enemy of enemies) {
      enemy.show();
      enemy.move();

      
      if (ship.hits(enemy)) {
        lives--; 
        enemies.splice(enemies.indexOf(enemy), 1); 
        if (lives <= 0) {
          gameState = "gameover"; 
        }
      }
    }
  } else if (gameState === "gameover") {
    textAlign(CENTER); 
    textSize(32);
    fill(255);
    text("Game Over", width / 2, height / 2 - 20);
    text("Score: " + score, width / 2, height / 2 + 20);
    textSize(16);
    text("Press 'R' to Restart", width / 2, height / 2 + 60);
  }
}

function keyPressed() {
  if (key === " ") {
    
    bullets.push(new Bullet(ship.x + ship.width / 2, height - 20));
  }

  if (gameState === "start") {
    if (key === "s") {
      
      startGame();
    }
  } else if (gameState === "gameover") {
    if (key === "r") {
      
      restartGame();
    }
  }
}


function startGame() {
  bullets = [];
  enemies = [];
  score = 0; 
  combo = 0; 
  lives = 2; 
  defeatedEnemies = 0; // 
  gameState = "playing"; 
  for (let i = 0; i < 5; i++) {
    enemies.push(new Enemy(random(width), random(100))); 
  }
}

function restartGame() {
  startGame();
}

function showStartScreen() {
  fill(255);
  textSize(50);
  textAlign(CENTER, CENTER);
  text("Welcome to the Shooting Game!", width / 2, height / 2 - 20);
  textSize(25);
  text("Press 'S' to Start", width / 2, height / 2 + 20);
}

class Ship {
  constructor() {
    this.x = width / 2;
    this.width = 20;
    this.height = 20;
  }

  show() {
    fill(255);
    rect(this.x, height - this.height, this.width, this.height);
  }

  move() {
    if (keyIsDown(LEFT_ARROW)) {
      this.x -= 5;
    } else if (keyIsDown(RIGHT_ARROW)) {
      this.x += 5;
    }

    this.x = constrain(this.x, 0, width - this.width);
  }

  hits(enemy) {
    let d = dist(this.x, height - this.height, enemy.x, enemy.y);
    return d < this.width / 2 + enemy.r;
  }
}

class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 4;
  }

  show() {
    fill(50, 150, 255);
    ellipse(this.x, this.y, this.r * 2, this.r * 2);
  }

  move() {
    this.y -= 5;
  }

  offscreen() {
    return this.y < 0;
  }

  hits(enemy) {
    let d = dist(this.x, this.y, enemy.x, enemy.y);
    return d < this.r + enemy.r;
  }
}

class Enemy {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.r = random(15, 30);
    this.speed = this.r < 20 ? 4 : 2;
    this.type = type || (this.r < 20 ? "small" : "large");
    if (this.type === "yellow") {
      this.r = 25;
      this.speed = 3;
    }
  }

  show() {
    if (this.type === "large") {
      fill(255, 0, 0);
    } else if (this.type === "small") {
      fill(0, 255, 255);
    } else if (this.type === "yellow") {
      fill(255, 255, 0);
    }
    ellipse(this.x, this.y, this.r * 2, this.r * 2);
  }

  move() {
    this.y += this.speed;

    if (this.y > height) {
      this.y = 0;
      this.x = random(width);
    }
  }
}
