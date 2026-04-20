/**
 * Space Invaders Game
 * Defend Earth from alien invasion
 */

let spaceRunning = false;
let spaceRaf;

function startSpaceGame() {
  const canvas = document.getElementById('space-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  
  // Player ship
  const player = {
    x: W / 2 - 15,
    y: H - 40,
    w: 30,
    h: 30,
    speed: 5
  };
  
  const bullets = [];
  const enemies = [];
  const explosions = [];
  
  let score = 0;
  let lives = 3;
  let gameOver = false;
  let gameStarted = false;
  let level = 1;
  let enemySpeed = 1;
  
  let keys = {};
  
  // Create enemies
  function spawnEnemies() {
    enemies.length = 0;
    const rows = 2 + Math.floor(level / 2);
    const cols = 8;
    
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        enemies.push({
          x: c * 60 + 20,
          y: r * 50 + 20,
          w: 30,
          h: 30,
          vx: enemySpeed,
          active: true
        });
      }
    }
  }
  
  spawnEnemies();
  
  const keyHandler = (e) => {
    keys[e.key] = e.type === 'keydown';
    
    if (!gameStarted && e.key === ' ') {
      gameStarted = true;
      e.preventDefault();
    }
    
    if (e.key === ' ' && gameStarted) {
      bullets.push({
        x: player.x + player.w / 2 - 2,
        y: player.y,
        w: 4,
        h: 10,
        vy: -7
      });
      e.preventDefault();
    }
  };
  
  document.addEventListener('keydown', keyHandler);
  document.addEventListener('keyup', keyHandler);
  
  function update() {
    if (!gameStarted || gameOver) return;
    
    // Player movement
    if (keys['ArrowLeft'] && player.x > 0) player.x -= player.speed;
    if (keys['ArrowRight'] && player.x < W - player.w) player.x += player.speed;
    
    // Update bullets
    for (let i = bullets.length - 1; i >= 0; i--) {
      bullets[i].y += bullets[i].vy;
      if (bullets[i].y < 0) {
        bullets.splice(i, 1);
      }
    }
    
    // Update enemies
    let moveDown = false;
    enemies.forEach(enemy => {
      if (!enemy.active) return;
      enemy.x += enemy.vx;
      
      if (enemy.x < 0 || enemy.x + enemy.w > W) {
        moveDown = true;
      }
    });
    
    if (moveDown) {
      enemies.forEach(enemy => {
        if (enemy.active) {
          enemy.vx *= -1;
          enemy.y += 30;
        }
      });
    }
    
    // Collision detection
    for (let i = bullets.length - 1; i >= 0; i--) {
      for (let j = enemies.length - 1; j >= 0; j--) {
        const bullet = bullets[i];
        const enemy = enemies[j];
        
        if (enemy.active &&
            bullet.x < enemy.x + enemy.w &&
            bullet.x + bullet.w > enemy.x &&
            bullet.y < enemy.y + enemy.h &&
            bullet.y + bullet.h > enemy.y) {
          
          enemy.active = false;
          bullets.splice(i, 1);
          score += 10;
          updateScore(score);
          
          explosions.push({
            x: enemy.x + enemy.w / 2,
            y: enemy.y + enemy.h / 2,
            life: 10
          });
          break;
        }
      }
    }
    
    // Enemy collision with player
    enemies.forEach(enemy => {
      if (enemy.active &&
          enemy.x < player.x + player.w &&
          enemy.x + enemy.w > player.x &&
          enemy.y < player.y + player.h &&
          enemy.y + enemy.h > player.y) {
        lives--;
        if (lives <= 0) gameOver = true;
      }
    });
    
    // Enemy reached bottom
    enemies.forEach(enemy => {
      if (enemy.active && enemy.y > H) {
        lives--;
        if (lives <= 0) gameOver = true;
      }
    });
    
    // Check level complete
    if (enemies.every(e => !e.active)) {
      level++;
      enemySpeed += 0.5;
      spawnEnemies();
    }
    
    // Update explosions
    explosions.forEach(exp => exp.life--);
    explosions = explosions.filter(exp => exp.life > 0);
  }
  
  function draw() {
    // Background
    ctx.fillStyle = '#0a0e27';
    ctx.fillRect(0, 0, W, H);
    
    // Stars
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    for (let i = 0; i < 50; i++) {
      const x = (i * 123) % W;
      const y = (i * 456) % H;
      ctx.fillRect(x, y, 1, 1);
    }
    
    // Enemies
    enemies.forEach(enemy => {
      if (enemy.active) {
        ctx.fillStyle = '#ef4444';
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 10;
        ctx.fillRect(enemy.x, enemy.y, enemy.w, enemy.h);
        ctx.shadowBlur = 0;
      }
    });
    
    // Bullets
    ctx.fillStyle = '#00e5ff';
    bullets.forEach(bullet => {
      ctx.fillRect(bullet.x, bullet.y, bullet.w, bullet.h);
    });
    
    // Player
    ctx.fillStyle = '#00e5ff';
    ctx.shadowColor = '#00e5ff';
    ctx.shadowBlur = 10;
    ctx.fillRect(player.x, player.y, player.w, player.h);
    ctx.shadowBlur = 0;
    
    // Explosions
    explosions.forEach(exp => {
      ctx.fillStyle = `rgba(245, 158, 11, ${exp.life / 10})`;
      ctx.beginPath();
      ctx.arc(exp.x, exp.y, 15, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // HUD
    ctx.fillStyle = '#fff';
    ctx.font = '14px Orbitron';
    ctx.fillText(`Lives: ${lives}`, 10, 20);
    ctx.fillText(`Level: ${level}`, W - 100, 20);
    
    // Start screen
    if (!gameStarted) {
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#00e5ff';
      ctx.font = 'bold 24px Orbitron';
      ctx.textAlign = 'center';
      ctx.fillText('SPACE INVADERS', W/2, H/2 - 40);
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.font = '14px Orbitron';
      ctx.fillText('Use Arrow Keys to move', W/2, H/2);
      ctx.fillText('Press SPACE to shoot', W/2, H/2 + 30);
      ctx.fillText('Press SPACE to start', W/2, H/2 + 70);
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
      ctx.fillText(`Level: ${level}`, W/2, H/2 + 70);
    }
  }
  
  function loop() {
    if (!spaceRunning) {
      document.removeEventListener('keydown', keyHandler);
      document.removeEventListener('keyup', keyHandler);
      return;
    }
    
    update();
    draw();
    spaceRaf = requestAnimationFrame(loop);
  }
  
  spaceRunning = true;
  loop();
}

function stopSpaceGame() {
  spaceRunning = false;
  cancelAnimationFrame(spaceRaf);
}
