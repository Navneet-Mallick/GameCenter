/**
 * flappy.js — Flappy Bird Game
 */

let flappyRaf, flappyRunning = false;

function stopFlappyGame() {
  flappyRunning = false;
  cancelAnimationFrame(flappyRaf);
}

function startFlappyGame() {
  const canvas = document.getElementById('flappy-canvas') || document.getElementById('game-canvas') || document.querySelector('canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  const CLR = {
    bg1: '#0a0e27', bg2: '#0d1535',
    bird: '#f59e0b', birdGlow: 'rgba(245,158,11,0.6)',
    pipe: '#7c3aed', pipeGlow: 'rgba(124,58,237,0.5)',
    ground: '#00d9ff', text: '#00d9ff', dead: '#ff4500',
    star: 'rgba(255,255,255,0.6)',
  };

  const GRAVITY   = 0.35;   // less gravity = floatier, easier
  const JUMP_V    = -7;     // softer jump
  const PIPE_W    = 48;
  const PIPE_GAP  = 165;    // wider gap = easier
  const PIPE_SPD  = 2.2;    // slower pipes
  const GROUND_H  = 30;

  let bird, pipes, particles, score, hiScore, dead, started, frame, stars;
  hiScore = parseInt(localStorage.getItem('nm_flappy_hi') || '0');

  const hiDisplay    = document.getElementById('snake-hi-display');
  const scoreDisplay = document.getElementById('snake-score-display');
  const msgDisplay   = document.getElementById('snake-personality-msg');

  const MSGS = { 1:'FIRST PIPE!', 5:'GETTING GOOD', 10:'IMPRESSIVE', 20:'FLAPPY GOD?', 50:'LEGENDARY' };

  function initState() {
    bird = { x: 80, y: H / 2, vy: 0, r: 14, angle: 0, flap: 0 };
    pipes = [];
    particles = [];
    score = 0;
    dead = false;
    started = false;
    frame = 0;
    stars = Array.from({ length: 40 }, () => ({
      x: Math.random() * W, y: Math.random() * (H - GROUND_H),
      s: Math.random() * 1.5 + 0.5, sp: Math.random() * 0.3 + 0.1,
    }));
    if (scoreDisplay) scoreDisplay.textContent = 'SCORE: 0';
    if (hiDisplay)    hiDisplay.textContent    = `HI: ${hiScore}`;
    if (msgDisplay)   msgDisplay.textContent   = '';
  }

  function spawnPipe() {
    const minY = 50, maxY = H - GROUND_H - PIPE_GAP - 50;
    const topH = Math.floor(Math.random() * (maxY - minY) + minY);
    pipes.push({ x: W + 10, topH, passed: false });
  }

  function flap() {
    if (dead) { initState(); started = true; if (msgDisplay) msgDisplay.textContent = 'RETRY...'; return; }
    if (!started) { started = true; if (msgDisplay) msgDisplay.textContent = 'FLAPPING...'; }
    bird.vy = JUMP_V;
    bird.flap = 8;
    spawnFeathers();
  }

  function spawnFeathers() {
    for (let i = 0; i < 5; i++) {
      particles.push({
        x: bird.x, y: bird.y,
        vx: (Math.random() - 0.5) * 3,
        vy: Math.random() * 2 + 1,
        life: 1, decay: 0.07,
        color: CLR.birdGlow, size: 3 + Math.random() * 3,
      });
    }
  }

  function spawnDeathParticles() {
    for (let i = 0; i < 20; i++) {
      const a = (i / 20) * Math.PI * 2;
      particles.push({
        x: bird.x, y: bird.y,
        vx: Math.cos(a) * (2 + Math.random() * 4),
        vy: Math.sin(a) * (2 + Math.random() * 4),
        life: 1, decay: 0.03,
        color: [CLR.bird, '#ff00c1', '#00fff9'][i % 3], size: 4 + Math.random() * 4,
      });
    }
  }

  // Input
  const keyHandler = e => { if (e.code === 'Space' || e.code === 'ArrowUp') { e.preventDefault(); flap(); } };
  const tapHandler = () => flap();
  document.addEventListener('keydown', keyHandler);
  canvas.addEventListener('pointerdown', tapHandler);

  // Draw helpers
  function drawBg() {
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, CLR.bg1);
    grad.addColorStop(1, CLR.bg2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Stars
    stars.forEach(s => {
      if (!dead) s.x -= s.sp;
      if (s.x < 0) s.x = W;
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = CLR.star;
      ctx.fillRect(s.x, s.y, s.s, s.s);
    });
    ctx.globalAlpha = 1;
  }

  function drawGround() {
    ctx.fillStyle = CLR.ground;
    ctx.shadowColor = CLR.ground;
    ctx.shadowBlur = 8;
    ctx.fillRect(0, H - GROUND_H, W, GROUND_H);
    ctx.shadowBlur = 0;
    // Ground detail lines
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.lineWidth = 1;
    for (let x = (frame * PIPE_SPD) % 40; x < W; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, H - GROUND_H); ctx.lineTo(x, H); ctx.stroke();
    }
  }

  function drawPipes() {
    pipes.forEach(p => {
      const botY = p.topH + PIPE_GAP;

      // Top pipe
      ctx.fillStyle = CLR.pipe;
      ctx.shadowColor = CLR.pipeGlow;
      ctx.shadowBlur = 12;
      ctx.fillRect(p.x, 0, PIPE_W, p.topH);
      // Cap
      ctx.fillRect(p.x - 4, p.topH - 20, PIPE_W + 8, 20);

      // Bottom pipe
      ctx.fillRect(p.x, botY, PIPE_W, H - GROUND_H - botY);
      // Cap
      ctx.fillRect(p.x - 4, botY, PIPE_W + 8, 20);

      // Highlight stripe
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      ctx.fillRect(p.x + 6, 0, 8, p.topH);
      ctx.fillRect(p.x + 6, botY + 20, 8, H - GROUND_H - botY - 20);

      ctx.shadowBlur = 0;
    });
  }

  function drawBird() {
    ctx.save();
    ctx.translate(bird.x, bird.y);
    // Tilt based on velocity
    bird.angle = Math.min(Math.max(bird.vy * 3, -30), 70) * Math.PI / 180;
    ctx.rotate(bird.angle);

    // Glow
    ctx.shadowColor = CLR.birdGlow;
    ctx.shadowBlur = 16;

    // Body
    ctx.fillStyle = dead ? CLR.dead : CLR.bird;
    ctx.beginPath();
    ctx.ellipse(0, 0, bird.r, bird.r * 0.85, 0, 0, Math.PI * 2);
    ctx.fill();

    // Wing flap
    const wingY = Math.sin(bird.flap * 0.8) * 4;
    ctx.fillStyle = dead ? '#cc3300' : '#e08800';
    ctx.beginPath();
    ctx.ellipse(-4, wingY, 8, 5, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // Eye
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(6, -3, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.arc(7, -3, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(8, -4, 1, 0, Math.PI * 2); ctx.fill();

    // Beak
    ctx.fillStyle = '#ff8c00';
    ctx.beginPath();
    ctx.moveTo(bird.r - 2, -2); ctx.lineTo(bird.r + 7, 0); ctx.lineTo(bird.r - 2, 3);
    ctx.closePath(); ctx.fill();

    ctx.restore();
    if (bird.flap > 0) bird.flap--;
  }

  function drawParticles() {
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.1; p.life -= p.decay;
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = 1;
    particles = particles.filter(p => p.life > 0);
  }

  // Main loop
  let pipeTimer = 0;

  function loop() {
    if (!flappyRunning) {
      document.removeEventListener('keydown', keyHandler);
      canvas.removeEventListener('pointerdown', tapHandler);
      return;
    }

    frame++;
    drawBg();
    drawPipes();
    drawGround();
    drawParticles();

    if (!started) {
      drawBird();
      ctx.fillStyle = CLR.text;
      ctx.font = 'bold 16px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('🐦 FLAPPY BIRD', W / 2, H / 2 - 20);
      ctx.font = '12px monospace';
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.fillText('SPACE / TAP to flap', W / 2, H / 2 + 5);
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.fillText(`HI: ${hiScore}`, W / 2, H / 2 + 25);
      ctx.textAlign = 'left';
      flappyRaf = requestAnimationFrame(loop);
      return;
    }

    if (!dead) {
      // Physics
      bird.vy += GRAVITY;
      bird.y  += bird.vy;

      // Pipe spawning
      pipeTimer++;
      if (pipeTimer > 110) { spawnPipe(); pipeTimer = 0; }

      // Move pipes
      pipes.forEach(p => {
        p.x -= PIPE_SPD;
        // Score
        if (!p.passed && p.x + PIPE_W < bird.x) {
          p.passed = true;
          score++;
          if (scoreDisplay) scoreDisplay.textContent = `SCORE: ${score}`;
          if (score > hiScore) {
            hiScore = score;
            localStorage.setItem('nm_flappy_hi', hiScore);
            if (hiDisplay) hiDisplay.textContent = `HI: ${hiScore}`;
          }
          if (MSGS[score] && msgDisplay) msgDisplay.textContent = MSGS[score];
        }
        // Collision
        const bx = bird.x, by = bird.y, br = bird.r - 3;
        if (bx + br > p.x && bx - br < p.x + PIPE_W) {
          if (by - br < p.topH || by + br > p.topH + PIPE_GAP) {
            dead = true; spawnDeathParticles();
            if (msgDisplay) msgDisplay.textContent = 'CRASHED!';
          }
        }
      });
      pipes = pipes.filter(p => p.x + PIPE_W > -10);

      // Ground / ceiling collision
      if (bird.y + bird.r >= H - GROUND_H || bird.y - bird.r <= 0) {
        dead = true; spawnDeathParticles();
        if (msgDisplay) msgDisplay.textContent = 'CRASHED!';
      }
    }

    drawBird();

    // HUD score
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(W / 2 - 35, 10, 70, 26);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 18px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(score, W / 2, 30);
    ctx.textAlign = 'left';

    if (dead) {
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = CLR.dead;
      ctx.font = 'bold 20px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', W / 2, H / 2 - 20);
      ctx.fillStyle = '#fff';
      ctx.font = '13px monospace';
      ctx.fillText(`SCORE: ${score}   HI: ${hiScore}`, W / 2, H / 2 + 5);
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.font = '11px monospace';
      ctx.fillText('SPACE / TAP to retry', W / 2, H / 2 + 25);
      ctx.textAlign = 'left';
    }

    flappyRaf = requestAnimationFrame(loop);
  }

  initState();
  flappyRunning = true;
  flappyRaf = requestAnimationFrame(loop);
}

function openFlappyGame() {
  const modal = document.getElementById('game-modal');
  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden', 'false');
  switchGame('snake');
}
