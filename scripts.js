const planetData = [
  { planet: 'Mercury', fact: 'Mercury is the smallest planet and the closest to the Sun.', color: [255, 204, 153] },
  { planet: 'Venus', fact: 'Venus is wrapped in thick clouds that trap heat and make it very hot.', color: [255, 175, 100] },
  { planet: 'Earth', fact: 'Earth is the only known planet to support life.', color: [92, 204, 130] },
  { planet: 'Mars', fact: 'Mars is called the Red Planet because of iron-rich dust.', color: [244, 114, 182] },
  { planet: 'Jupiter', fact: 'Jupiter is the largest planet and has a giant storm called the Great Red Spot.', color: [251, 191, 36] },
  { planet: 'Saturn', fact: 'Saturn is famous for its bright rings made of ice and rock.', color: [253, 230, 138] },
  { planet: 'Uranus', fact: 'Uranus spins on its side, making it very unusual among the planets.', color: [125, 211, 252] },
  { planet: 'Neptune', fact: 'Neptune is a cold ice giant with very fast winds.', color: [96, 165, 250] }
];

let player;
let asteroids = [];
let shots = [];
let stars = [];
let score = 0;
let lives = 3;
let lastSpawn = 0;
let spawnDelay = 900;
let gameOver = false;
let currentFact = 'Shoot asteroids to learn about the solar system.';
let unlockedFacts = [];

function setup() {
  const container = document.getElementById('game-container');
  const canvas = createCanvas(container.clientWidth, 420);
  canvas.parent('game-container');
  pixelDensity(1);

  player = {
    x: width / 2,
    y: height - 48,
    size: 26,
    speed: 6
  };

  stars = Array.from({ length: 90 }, () => ({
    x: random(width),
    y: random(height),
    size: random(1, 2.5),
    alpha: random(0.3, 1)
  }));

  resetGame();
}

function resetGame() {
  asteroids = [];
  shots = [];
  score = 0;
  lives = 3;
  lastSpawn = 0;
  spawnDelay = 900;
  gameOver = false;
  currentFact = 'Shoot asteroids to learn about the solar system.';
  unlockedFacts = [];
  updateHud();
  renderFacts();
  player.x = width / 2;
}

function draw() {
  background(3, 8, 24);
  drawStars();

  if (!gameOver) {
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
      player.x -= player.speed;
    }
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
      player.x += player.speed;
    }

    player.x = constrain(player.x, 24, width - 24);

    if (millis() - lastSpawn > spawnDelay) {
      spawnAsteroid();
      lastSpawn = millis();
      spawnDelay = max(450, spawnDelay - 20);
    }

    updateShots();
    updateAsteroids();
  }

  drawPlayer();
  drawShots();
  drawAsteroids();
  drawOverlay();
}

function drawStars() {
  for (const star of stars) {
    noStroke();
    fill(255, 255, 255, star.alpha * 255);
    circle(star.x, star.y, star.size);
  }
}

function spawnAsteroid() {
  const entry = random(planetData);
  asteroids.push({
    x: random(20, width - 20),
    y: -30,
    size: random(18, 34),
    speed: random(2.2, 4.8),
    drift: random(-1.6, 1.6),
    planet: entry.planet,
    fact: entry.fact,
    color: entry.color
  });
}

function updateShots() {
  for (let i = shots.length - 1; i >= 0; i--) {
    shots[i].y -= 8;
    if (shots[i].y < -20) {
      shots.splice(i, 1);
    }
  }
}

function updateAsteroids() {
  for (let i = asteroids.length - 1; i >= 0; i--) {
    asteroids[i].x += asteroids[i].drift;
    asteroids[i].y += asteroids[i].speed;

    if (asteroids[i].y - asteroids[i].size > height + 20) {
      asteroids.splice(i, 1);
      lives -= 1;
      if (lives <= 0) {
        gameOver = true;
        currentFact = 'Game over. Restart to explore the galaxy again.';
      }
      updateHud();
      continue;
    }

    for (let j = shots.length - 1; j >= 0; j--) {
      const shot = shots[j];
      const asteroid = asteroids[i];
      if (dist(shot.x, shot.y, asteroid.x, asteroid.y) < shot.radius + asteroid.size / 2) {
        score += 10;
        currentFact = `${asteroid.planet}: ${asteroid.fact}`;
        if (!unlockedFacts.includes(asteroid.planet)) {
          unlockedFacts.push(asteroid.planet);
          renderFacts();
        }
        shots.splice(j, 1);
        asteroids.splice(i, 1);
        updateHud();
        break;
      }
    }
  }
}

function drawPlayer() {
  push();
  translate(player.x, player.y);
  fill(56, 189, 248);
  noStroke();
  triangle(0, -20, -16, 18, 16, 18);
  fill(191, 219, 254);
  rect(-8, -6, 16, 12, 4);
  fill(15, 23, 42);
  circle(0, -2, 5);
  pop();
}

function drawShots() {
  for (const shot of shots) {
    stroke(255, 221, 102);
    strokeWeight(3);
    line(shot.x, shot.y - 8, shot.x, shot.y + 8);
  }
}

function drawAsteroids() {
  for (const asteroid of asteroids) {
    push();
    translate(asteroid.x, asteroid.y);
    fill(asteroid.color[0], asteroid.color[1], asteroid.color[2]);
    noStroke();
    circle(0, 0, asteroid.size);
    fill(30, 41, 59, 180);
    circle(-5, -4, asteroid.size * 0.35);
    fill(255, 255, 255, 90);
    circle(4, 3, asteroid.size * 0.2);
    pop();
  }
}

function drawOverlay() {
  if (gameOver) {
    fill(2, 6, 23, 180);
    rect(0, 0, width, height);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(26);
    text('Mission complete!', width / 2, height / 2 - 16);
    textSize(16);
    text('Press restart to play again.', width / 2, height / 2 + 18);
  }
}

function keyPressed() {
  if (key === ' ' || keyCode === 32) {
    if (!gameOver) {
      shots.push({ x: player.x, y: player.y - 20, radius: 5 });
    }
    return false;
  }

  if (key === 'r' || key === 'R') {
    resetGame();
  }
}

function mousePressed() {
  if (!gameOver && mouseY > 0 && mouseY < height && mouseX > 0 && mouseX < width) {
    shots.push({ x: player.x, y: player.y - 20, radius: 5 });
  }
}

function windowResized() {
  const container = document.getElementById('game-container');
  resizeCanvas(container.clientWidth, 420);
  stars = Array.from({ length: 90 }, () => ({
    x: random(width),
    y: random(height),
    size: random(1, 2.5),
    alpha: random(0.3, 1)
  }));
  player.x = width / 2;
  player.y = height - 48;
}

function updateHud() {
  document.getElementById('score').textContent = score;
  document.getElementById('lives').textContent = lives;
  document.getElementById('fact').textContent = currentFact;
}

function renderFacts() {
  const list = document.getElementById('fact-list');
  list.innerHTML = '';
  if (unlockedFacts.length === 0) {
    list.innerHTML = '<div class="fact-pill"><strong>No facts yet</strong>Start shooting asteroids to unlock planet facts.</div>';
    return;
  }

  unlockedFacts.forEach((planet) => {
    const entry = planetData.find((item) => item.planet === planet);
    const item = document.createElement('div');
    item.className = 'fact-pill';
    item.innerHTML = `<strong>${entry.planet}</strong>${entry.fact}`;
    list.appendChild(item);
  });
}

document.getElementById('restart-btn').addEventListener('click', resetGame);
