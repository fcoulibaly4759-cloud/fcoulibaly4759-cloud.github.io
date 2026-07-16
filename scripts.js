const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const stageEl = document.getElementById('stage');
const factEl = document.getElementById('fact');
const factList = document.getElementById('fact-list');
const restartBtn = document.getElementById('restart-btn');
const startBtn = document.getElementById('start-btn');
const factsBtn = document.getElementById('facts-btn');
const factsSection = document.getElementById('facts-section');

const facts = [
  { title: 'Mercury', detail: 'Mercury is the smallest planet and closest to the Sun.' },
  { title: 'Venus', detail: 'Venus spins backward compared to most planets.' },
  { title: 'Earth', detail: 'Our planet is the only one known to host life.' },
  { title: 'Mars', detail: 'Mars has the tallest volcano in the solar system.' },
  { title: 'Jupiter', detail: 'Jupiter is so large it could fit 1,300 Earths inside.' },
  { title: 'Saturn', detail: 'Saturn has more than 80 moons and bright rings.' },
  { title: 'Uranus', detail: 'Uranus rotates on its side like a rolling ball.' },
  { title: 'Neptune', detail: 'Neptune appears blue because of methane in its atmosphere.' },
];

const gameState = {
  score: 0,
  lives: 3,
  stage: 1,
  objects: [],
  keys: {},
  frame: 0,
  running: false,
  unlocked: [],
};

const player = {
  x: 360,
  y: 360,
  width: 44,
  height: 24,
  speed: 6,
};

const backgroundStars = Array.from({ length: 80 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  radius: Math.random() * 1.4 + 0.4,
  alpha: Math.random() * 0.6 + 0.3,
}));

function resizeCanvas() {
  const containerWidth = canvas.parentElement.offsetWidth;
  const ratio = canvas.width / canvas.height;
  canvas.style.width = `${containerWidth}px`;
  canvas.style.height = `${containerWidth / ratio}px`;
}

function resetGame() {
  gameState.score = 0;
  gameState.lives = 3;
  gameState.stage = 1;
  gameState.objects = [];
  gameState.frame = 0;
  gameState.running = true;
  gameState.unlocked = [];
  player.x = canvas.width / 2 - player.width / 2;
  updateHud();
  updateFact('Collect star clusters to unlock solar system facts.');
  renderFacts();
}

function updateHud() {
  scoreEl.textContent = gameState.score;
  livesEl.textContent = gameState.lives;
  stageEl.textContent = gameState.stage;
}

function updateFact(text) {
  factEl.textContent = text;
}

function renderFacts() {
  factList.innerHTML = '';
  gameState.unlocked.forEach((fact) => {
    const pill = document.createElement('div');
    pill.className = 'fact-pill';
    pill.innerHTML = `<strong>${fact.title}</strong>${fact.detail}`;
    factList.appendChild(pill);
  });
}

function spawnObject() {
  const type = Math.random() < 0.7 ? 'star' : 'comet';
  const size = type === 'star' ? 14 : 20;
  gameState.objects.push({
    x: Math.random() * (canvas.width - size) + size / 2,
    y: -size,
    size,
    type,
    speed: 2.1 + gameState.stage * 0.35 + Math.random() * 1.2,
  });
}

function unlockFact() {
  if (gameState.unlocked.length >= facts.length) return;
  const nextFact = facts[gameState.unlocked.length];
  gameState.unlocked.push(nextFact);
  updateFact(`${nextFact.title}: ${nextFact.detail}`);
  renderFacts();
}

function drawBackground() {
  ctx.fillStyle = '#04111f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  backgroundStars.forEach((star, index) => {
    star.y += 0.3;
    if (star.y > canvas.height) {
      star.y = 0;
      star.x = Math.random() * canvas.width;
    }
    ctx.globalAlpha = star.alpha;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    if (index % 12 === 0) {
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
      ctx.beginPath();
      ctx.moveTo(star.x - 5, star.y);
      ctx.lineTo(star.x + 5, star.y);
      ctx.stroke();
    }
  });
}

function drawPlayer() {
  ctx.fillStyle = '#7dd3fc';
  ctx.beginPath();
  ctx.moveTo(player.x, player.y + player.height);
  ctx.lineTo(player.x + player.width / 2, player.y);
  ctx.lineTo(player.x + player.width, player.y + player.height);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#cffafe';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawObjects() {
  gameState.objects.forEach((obj) => {
    if (obj.type === 'star') {
      ctx.fillStyle = '#f8b4d9';
      ctx.beginPath();
      ctx.arc(obj.x, obj.y, obj.size / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fed7aa';
      ctx.stroke();
    } else {
      ctx.fillStyle = '#fb923c';
      ctx.beginPath();
      ctx.moveTo(obj.x - obj.size / 2, obj.y + obj.size / 2);
      ctx.lineTo(obj.x + obj.size / 2, obj.y);
      ctx.lineTo(obj.x + obj.size / 2, obj.y + obj.size);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#fef08a';
      ctx.stroke();
    }
  });
}

function movePlayer() {
  const left = gameState.keys.ArrowLeft || gameState.keys.KeyA;
  const right = gameState.keys.ArrowRight || gameState.keys.KeyD;
  if (left && player.x > 0) {
    player.x -= player.speed;
  }
  if (right && player.x + player.width < canvas.width) {
    player.x += player.speed;
  }
}

function checkCollisions() {
  gameState.objects = gameState.objects.filter((obj) => {
    const dx = Math.abs(obj.x - (player.x + player.width / 2));
    const dy = Math.abs(obj.y - (player.y + player.height / 2));
    const distance = Math.hypot(dx, dy);
    if (distance < obj.size / 1.5) {
      if (obj.type === 'star') {
        gameState.score += 10;
        if (gameState.score % 50 === 0) {
          unlockFact();
        }
      } else {
        gameState.lives -= 1;
      }
      updateHud();
      return false;
    }
    return obj.y < canvas.height + obj.size;
  });
}

function drawOverlay() {
  if (!gameState.running) {
    ctx.fillStyle = 'rgba(2, 10, 28, 0.82)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ffffff';
    ctx.font = '22px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Press Start to launch the mission', canvas.width / 2, canvas.height / 2 - 12);
    ctx.font = '16px Inter, sans-serif';
    ctx.fillText('Use arrow keys or A/D. Press R to restart.', canvas.width / 2, canvas.height / 2 + 22);
  }
}

function endGame() {
  gameState.running = false;
  updateFact('Mission complete. Restart to explore again.');
}

function updateStage() {
  const stage = Math.floor(gameState.score / 80) + 1;
  if (stage !== gameState.stage) {
    gameState.stage = stage;
    updateHud();
  }
}

function animate() {
  if (!canvas || !ctx) return;
  if (gameState.running) {
    movePlayer();
    if (gameState.frame % 50 === 0) spawnObject();
    gameState.objects.forEach((obj) => {
      obj.y += obj.speed;
    });
    checkCollisions();
    updateStage();
    if (gameState.lives <= 0) {
      endGame();
    }
  }

  drawBackground();
  drawObjects();
  drawPlayer();
  drawOverlay();

  gameState.frame += 1;
  requestAnimationFrame(animate);
}

function attachControls() {
  window.addEventListener('keydown', (event) => {
    gameState.keys[event.code] = true;
    if (event.code === 'KeyR') {
      resetGame();
    }
  });
  window.addEventListener('keyup', (event) => {
    gameState.keys[event.code] = false;
  });

  restartBtn.addEventListener('click', resetGame);
  startBtn.addEventListener('click', () => {
    if (!gameState.running) {
      gameState.running = true;
      updateFact('Mission started. Collect stars and stay alive!');
    }
    if (gameState.score === 0 && gameState.lives === 3 && gameState.unlocked.length === 0) {
      resetGame();
    }
  });

  factsBtn.addEventListener('click', () => {
    factsSection.scrollIntoView({ behavior: 'smooth' });
  });
}

function init() {
  resizeCanvas();
  resetGame();
  attachControls();
  animate();
}

window.addEventListener('load', init);
window.addEventListener('resize', resizeCanvas);
