/**
 * Breakout Game
 * Classic brick breaker with modern styling
 */

let breakoutRunning = false;
let breakoutRaf;

function startBreakoutGame() {
  const canvas = document.getElementById('breakout-canvas') || document.getElementById('game-canvas') || document.querySelector('canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  
  // Game objects
  const paddle = {
    x: W / 2 - 40,
    y: H - 20,
    w: 80,
    h: 10,
    speed: 6
  };
  
  const ball = {
    x: W / 2,
    y: H - 40,
    r: 5,
    vx: 3,
    vy: -3
  };
  
  const bricks = [];
  const brickW = 60;
  const brickH = 15;
  const brickPadding = 5;
  const brickCols = 10;
  const brickRows = 4;
  
  let score = 0;
  let lives = 3;
  let gameOver = false;
  let gameWon = false;
  let gameStarted = false;
  
  // Create bricks
  for (let r = 0; r < brickRows; r++) {
    for (let c = 0; c < brickCols; c++) {
      bricks.push({
        x: c * (brickW + brickPadding) + 10,
        y: r * (brickH + brickPadding) + 30,
        w: brickW,
        h: brickH,
        active: true,
        color: ['#00e5ff', '#8b5cf6', '#f59e0b', '#22c55e'][r % 4]
      });
    }
  }
  
  let keys = {};
  
  const keyHandler = (e) => {
    keys[e.key] = e.type === 'keydown';
    if (!gameStarted && e.key === ' ') {
      gameStarted = true;
      e.preventDefault();
    }
  };
  
  document.addEventListener('keydown', keyHandler);
  document.addEventListener('keyup', keyHandler);
  
  function update() {
    if (!gameStarted || gameOver || gameWon) return;
    
    // Paddle movement
    if (keys['ArrowLeft'] && paddle.x > 0) paddle.x -= paddle.speed;
    if (keys['ArrowRight'] && paddle.x < W - paddle.w) paddle.x += paddle.speed;
    
    // Ball movement
    ball.x += ball.vx;
    ball.y += ball.vy;
    
    // Ball collision with walls
    if (ball.x - ball.r < 0 || ball.x + ball.r > W) ball.vx *= -1;
    if (ball.y - ball.r < 0) ball.vy *= -1;
    
    // Ball collision with paddle
    if (ball.y + ball.r > paddle.y &&
        ball.x > paddle.x &&
        ball.x < paddle.x + paddle.w) {
      ball.vy *= -1;
      ball.y = paddle.y - ball.r;
    }
    
    // Ball collision with bricks
    bricks.forEach(brick => {
      if (!brick.active) return;
      
      if (ball.x > brick.x &&
          ball.x < brick.x + brick.w &&
          ball.y > brick.y &&
          ball.y < brick.y + brick.h) {
        brick.active = false;
        ball.vy *= -1;
        score += 10;
        updateScore(score);
      }
    });
    
    // Ball out of bounds
    if (ball.y > H) {
      lives--;
      if (lives <= 0) {
        gameOver = true;
      } else {
        ball.x = W / 2;
        ball.y = H - 40;
        ball.vx = 3;
        ball.vy = -3;
      }
    }
    
    // Check win condition
    if (bricks.every(b => !b.active)) {
      gameWon = true;
    }
  }
  
  function draw() {
    // Background
    ctx.fillStyle = '#0a0e27';
    ctx.fillRect(0, 0, W, H);
    
    // Bricks
    bricks.forEach(brick => {
      if (brick.active) {
        ctx.fillStyle = brick.color;
        ctx.shadowColor = brick.color;
        ctx.shadowBlur = 10;
        ctx.fillRect(brick.x, brick.y, brick.w, brick.h);
        ctx.shadowBlur = 0;
      }
    });
    
    // Paddle
    ctx.fillStyle = '#00e5ff';
    ctx.shadowColor = '#00e5ff';
    ctx.shadowBlur = 10;
    ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
    ctx.shadowBlur = 0;
    
    // Ball
    ctx.fillStyle = '#f59e0b';
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Lives
    ctx.fillStyle = '#fff';
    ctx.font = '14px Orbitron';
    ctx.fillText(`Lives: ${lives}`, 10, 20);
    
    // Start screen
    if (!gameStarted) {
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#00e5ff';
      ctx.font = 'bold 24px Orbitron';
      ctx.textAlign = 'center';
      ctx.fillText('BREAKOUT', W/2, H/2 - 40);
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.font = '14px Orbitron';
      ctx.fillText('Use Arrow Keys to move', W/2, H/2);
      ctx.fillText('Press SPACE to start', W/2, H/2 + 30);
    }
    
    // Game over
    if (gameOver) {
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 24px Orbitron';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', W/2, H/2);
      ctx.fillStyle = '#fff';
      ctx.font = '16px Orbitron';
      ctx.fillText(`Score: ${score}`, W/2, H/2 + 40);
    }
    
    // Game won
    if (gameWon) {
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#22c55e';
      ctx.font = 'bold 24px Orbitron';
      ctx.textAlign = 'center';
      ctx.fillText('YOU WIN!', W/2, H/2);
      ctx.fillStyle = '#fff';
      ctx.font = '16px Orbitron';
      ctx.fillText(`Score: ${score}`, W/2, H/2 + 40);
    }
  }
  
  function loop() {
    if (!breakoutRunning) {
      document.removeEventListener('keydown', keyHandler);
      document.removeEventListener('keyup', keyHandler);
      return;
    }
    
    update();
    draw();
    breakoutRaf = requestAnimationFrame(loop);
  }
  
  breakoutRunning = true;
  loop();
}

function stopBreakoutGame() {
  breakoutRunning = false;
  cancelAnimationFrame(breakoutRaf);
}
