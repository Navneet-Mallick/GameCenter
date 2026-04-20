/**
 * Snake Game
 * Classic snake gameplay with modern styling
 */

let snakeRunning = false;
let snakeRaf;

function startSnakeGame() {
  const canvas = document.getElementById('snake-canvas') || document.getElementById('game-canvas') || document.querySelector('canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  const CELL = 20;
  const COLS = Math.floor(W / CELL);
  const ROWS = Math.floor(H / CELL);
  
  let snake = [{ x: Math.floor(COLS / 2), y: Math.floor(ROWS / 2) }];
  let food = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
  let dir = { x: 1, y: 0 };
  let nextDir = { x: 1, y: 0 };
  let score = 0;
  let dead = false;
  let gameStarted = false;
  
  const hiDisplay = document.getElementById('high-score');
  const scoreDisplay = document.getElementById('current-score');
  
  function spawnFood() {
    food = {
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS)
    };
  }
  
  function update() {
    if (dead || !gameStarted) return;
    
    dir = nextDir;
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
    
    // Check collision with walls
    if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
      dead = true;
      return;
    }
    
    // Check collision with self
    if (snake.some(s => s.x === head.x && s.y === head.y)) {
      dead = true;
      return;
    }
    
    snake.unshift(head);
    
    // Check food
    if (head.x === food.x && head.y === food.y) {
      score += 10;
      updateScore(score);
      spawnFood();
    } else {
      snake.pop();
    }
  }
  
  function draw() {
    // Background - DARK for visibility
    ctx.fillStyle = '#0a0e27';
    ctx.fillRect(0, 0, W, H);
    
    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= COLS; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL, 0);
      ctx.lineTo(i * CELL, H);
      ctx.stroke();
    }
    for (let i = 0; i <= ROWS; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * CELL);
      ctx.lineTo(W, i * CELL);
      ctx.stroke();
    }
    
    // Food
    ctx.fillStyle = '#f59e0b';
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 10;
    ctx.fillRect(food.x * CELL + 2, food.y * CELL + 2, CELL - 4, CELL - 4);
    ctx.shadowBlur = 0;
    
    // Snake
    snake.forEach((s, i) => {
      if (i === 0) {
        ctx.fillStyle = '#00e5ff';
        ctx.shadowColor = '#00e5ff';
        ctx.shadowBlur = 10;
      } else {
        ctx.fillStyle = '#8b5cf6';
        ctx.shadowBlur = 0;
      }
      ctx.fillRect(s.x * CELL + 2, s.y * CELL + 2, CELL - 4, CELL - 4);
    });
    ctx.shadowBlur = 0;
    
    // Game over screen
    if (dead) {
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 30px Orbitron';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', W/2, H/2 - 20);
      ctx.fillStyle = '#fff';
      ctx.font = '16px Orbitron';
      ctx.fillText(`Score: ${score}`, W/2, H/2 + 20);
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = '12px Orbitron';
      ctx.fillText('Refresh to play again', W/2, H/2 + 50);
    }
    
    // Start screen
    if (!gameStarted) {
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#00e5ff';
      ctx.font = 'bold 24px Orbitron';
      ctx.textAlign = 'center';
      ctx.fillText('SNAKE', W/2, H/2 - 40);
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.font = '14px Orbitron';
      ctx.fillText('Use Arrow Keys or WASD', W/2, H/2);
      ctx.fillText('Press any key to start', W/2, H/2 + 30);
    }
  }
  
  // Input
  const keyHandler = (e) => {
    if (!gameStarted) {
      gameStarted = true;
      return;
    }
    
    if (dead) return;
    
    switch(e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (dir.y === 0) nextDir = { x: 0, y: -1 };
        e.preventDefault();
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (dir.y === 0) nextDir = { x: 0, y: 1 };
        e.preventDefault();
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (dir.x === 0) nextDir = { x: -1, y: 0 };
        e.preventDefault();
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (dir.x === 0) nextDir = { x: 1, y: 0 };
        e.preventDefault();
        break;
    }
  };
  
  document.addEventListener('keydown', keyHandler);
  
  let lastTime = 0;
  const gameSpeed = 100;
  
  function loop(time) {
    if (!snakeRunning) {
      document.removeEventListener('keydown', keyHandler);
      return;
    }
    
    if (time - lastTime > gameSpeed) {
      update();
      lastTime = time;
    }
    
    draw();
    snakeRaf = requestAnimationFrame(loop);
  }
  
  snakeRunning = true;
  loop(0);
}

function stopSnakeGame() {
  snakeRunning = false;
  cancelAnimationFrame(snakeRaf);
}
