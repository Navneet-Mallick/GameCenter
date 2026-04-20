/**
 * tetris.js — Tetris Game
 */

let tetrisRaf, tetrisRunning = false;

function stopTetrisGame() {
  tetrisRunning = false;
  cancelAnimationFrame(tetrisRaf);
}

function startTetrisGame() {
  const canvas = document.getElementById('tetris-canvas') || document.getElementById('game-canvas') || document.querySelector('canvas');
  if (!canvas) return;

  // Use a wider canvas: board + side panel
  const COLS = 10, ROWS = 20, B = 26;
  const BOARD_W = COLS * B;
  const PANEL_W = 110;
  const W = BOARD_W + PANEL_W;
  const H = ROWS * B;
  canvas.width  = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  const COLORS = {
    I:'#00d9ff', O:'#f59e0b', T:'#a855f7',
    S:'#22c55e', Z:'#ef4444', J:'#3b82f6', L:'#f97316',
    empty:'#05081a', grid:'rgba(255,255,255,0.03)',
    panel:'#080c1e', border:'rgba(0,217,255,0.2)',
  };

  // SRS wall kick data
  const KICKS = {
    normal: [[[0,0],[-1,0],[1,0],[0,-1],[-1,-1],[1,-1]],
             [[0,0],[1,0],[-1,0],[0,1],[1,1],[-1,1]]],
    I:      [[[0,0],[-2,0],[1,0],[-2,1],[1,-2]],
             [[0,0],[-1,0],[2,0],[-1,-2],[2,1]]]
  };

  const PIECES = {
    I:[[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
    O:[[1,1],[1,1]],
    T:[[0,1,0],[1,1,1],[0,0,0]],
    S:[[0,1,1],[1,1,0],[0,0,0]],
    Z:[[1,1,0],[0,1,1],[0,0,0]],
    J:[[1,0,0],[1,1,1],[0,0,0]],
    L:[[0,0,1],[1,1,1],[0,0,0]],
  };
  const KEYS = Object.keys(PIECES);

  // 7-bag randomizer
  let bag = [];
  function nextBag() {
    if (!bag.length) bag = [...KEYS].sort(() => Math.random() - 0.5);
    return bag.pop();
  }

  function makePiece(key) {
    return { key, shape: PIECES[key].map(r=>[...r]), x: Math.floor(COLS/2)-Math.floor(PIECES[key][0].length/2), y: 0, rot: 0 };
  }

  let board, piece, nextPiece, held, canHold, score, hiScore, lines, level, dead, started, dropTimer, dropInterval, lockTimer, lockDelay;
  let dasTimer = 0, dasDir = 0, dasActive = false;
  const DAS = 170, ARR = 50, LOCK_DELAY = 500;
  hiScore = parseInt(localStorage.getItem('nm_tetris_hi') || '0');

  const hiDisplay    = document.getElementById('asteroid-hi-display');
  const scoreDisplay = document.getElementById('asteroid-score-display');
  const msgDisplay   = document.getElementById('asteroid-personality-msg');

  function newBoard() { return Array.from({length:ROWS}, ()=>Array(COLS).fill(null)); }

  function valid(shape, ox, oy) {
    for (let r=0; r<shape.length; r++)
      for (let c=0; c<shape[r].length; c++)
        if (shape[r][c]) {
          const nx=ox+c, ny=oy+r;
          if (nx<0||nx>=COLS||ny>=ROWS) return false;
          if (ny>=0 && board[ny][nx]) return false;
        }
    return true;
  }

  function rotate(shape) {
    return shape[0].map((_,i)=>shape.map(r=>r[i]).reverse());
  }

  function tryRotate() {
    const rot = rotate(piece.shape);
    const kicks = piece.key==='I' ? KICKS.I : KICKS.normal;
    const set = kicks[piece.rot % 2];
    for (const [dx,dy] of set) {
      if (valid(rot, piece.x+dx, piece.y+dy)) {
        piece.shape = rot;
        piece.x += dx; piece.y += dy;
        piece.rot = (piece.rot+1)%4;
        lockTimer = 0;
        return;
      }
    }
  }

  function ghostY() {
    let gy = piece.y;
    while (valid(piece.shape, piece.x, gy+1)) gy++;
    return gy;
  }

  function place() {
    piece.shape.forEach((r,ri)=>r.forEach((v,ci)=>{
      if (v && piece.y+ri>=0) board[piece.y+ri][piece.x+ci]=piece.key;
    }));

    // Find cleared lines
    const cleared = [];
    for (let r=ROWS-1; r>=0; r--) {
      if (board[r].every(c=>c)) { cleared.push(r); }
    }

    if (cleared.length) {
      // Remove cleared lines
      cleared.forEach(r => { board.splice(r,1); board.unshift(Array(COLS).fill(null)); });
      const pts = [0,100,300,500,800];
      score += (pts[cleared.length]||800)*level;
      lines += cleared.length;
      level = Math.floor(lines/10)+1;
      dropInterval = Math.max(80, 1000 - (level-1)*90);
      if (scoreDisplay) scoreDisplay.textContent = `SCORE: ${score}`;
      if (score>hiScore) {
        hiScore=score;
        localStorage.setItem('nm_tetris_hi', hiScore);
        if (hiDisplay) hiDisplay.textContent=`HI: ${hiScore}`;
      }
      const msgs={1:'SINGLE',2:'DOUBLE!',3:'TRIPLE!',4:'TETRIS!!'};
      if (msgDisplay) {
        msgDisplay.textContent = msgs[cleared.length]||'';
        setTimeout(()=>{ if(msgDisplay) msgDisplay.textContent=`LVL ${level}`; },900);
      }
    }

    canHold = true;
    piece = nextPiece;
    nextPiece = makePiece(nextBag());
    lockTimer = 0;

    if (!valid(piece.shape, piece.x, piece.y)) {
      dead = true;
      if (msgDisplay) msgDisplay.textContent='GAME OVER';
    }
  }

  function holdPiece() {
    if (!canHold) return;
    canHold = false;
    if (held) {
      const tmp = held;
      held = makePiece(piece.key);
      piece = makePiece(tmp.key);
    } else {
      held = makePiece(piece.key);
      piece = nextPiece;
      nextPiece = makePiece(nextBag());
    }
    lockTimer = 0;
  }

  function initState() {
    board = newBoard();
    bag = [];
    piece = makePiece(nextBag());
    nextPiece = makePiece(nextBag());
    held = null; canHold = true;
    score=0; lines=0; level=1;
    dead=false; started=false;
    dropTimer=0; dropInterval=1000;
    lockTimer=0; lockDelay=LOCK_DELAY;
    dasTimer=0; dasDir=0; dasActive=false;
    if (scoreDisplay) scoreDisplay.textContent='SCORE: 0';
    if (hiDisplay)    hiDisplay.textContent=`HI: ${hiScore}`;
    if (msgDisplay)   msgDisplay.textContent='';
  }

  // ── Draw helpers ──
  function drawBlock(x, y, color, alpha=1, size=B) {
    if (alpha<=0) return;
    ctx.globalAlpha = alpha;
    // Main fill
    ctx.fillStyle = color;
    ctx.fillRect(x+1, y+1, size-2, size-2);
    // Top highlight
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.fillRect(x+2, y+2, size-4, 3);
    // Left highlight
    ctx.fillRect(x+2, y+2, 3, size-4);
    // Bottom shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(x+2, y+size-4, size-4, 3);
    ctx.globalAlpha = 1;
  }

  function drawBoard() {
    // Board background
    ctx.fillStyle = COLORS.empty;
    ctx.fillRect(0, 0, BOARD_W, H);
    // Grid lines
    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 0.5;
    for (let r=0; r<ROWS; r++) for (let c=0; c<COLS; c++) {
      ctx.strokeRect(c*B, r*B, B, B);
    }
    // Board border
    ctx.strokeStyle = COLORS.border;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(0, 0, BOARD_W, H);
    // Placed blocks
    board.forEach((row,r)=>row.forEach((v,c)=>{
      if (v) drawBlock(c*B, r*B, COLORS[v]);
    }));
  }

  function drawGhost() {
    const gy = ghostY();
    piece.shape.forEach((row,r)=>row.forEach((v,c)=>{
      if (v) {
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = COLORS[piece.key];
        ctx.fillRect((piece.x+c)*B+1, (gy+r)*B+1, B-2, B-2);
        ctx.strokeStyle = COLORS[piece.key];
        ctx.lineWidth = 1;
        ctx.strokeRect((piece.x+c)*B+1, (gy+r)*B+1, B-2, B-2);
        ctx.globalAlpha = 1;
      }
    }));
  }

  function drawActivePiece() {
    piece.shape.forEach((row,r)=>row.forEach((v,c)=>{
      if (v) drawBlock((piece.x+c)*B, (piece.y+r)*B, COLORS[piece.key]);
    }));
  }

  function drawMiniPiece(p, cx, cy, blockSize=14) {
    if (!p) return;
    const sh = p.shape || PIECES[p.key];
    const rows = sh.length, cols = sh[0].length;
    const ox = cx - (cols*blockSize)/2;
    const oy = cy - (rows*blockSize)/2;
    sh.forEach((row,r)=>row.forEach((v,c)=>{
      if (v) drawBlock(ox+c*blockSize, oy+r*blockSize, COLORS[p.key], 1, blockSize);
    }));
  }

  function drawPanel() {
    const px = BOARD_W;
    // Panel background
    ctx.fillStyle = COLORS.panel;
    ctx.fillRect(px, 0, PANEL_W, H);
    ctx.strokeStyle = COLORS.border;
    ctx.lineWidth = 1;
    ctx.strokeRect(px, 0, PANEL_W, H);

    ctx.textAlign = 'center';
    const cx = px + PANEL_W/2;

    // NEXT
    ctx.fillStyle = 'rgba(0,217,255,0.5)';
    ctx.font = 'bold 10px monospace';
    ctx.fillText('NEXT', cx, 18);
    ctx.strokeStyle = 'rgba(0,217,255,0.15)';
    ctx.strokeRect(px+8, 22, PANEL_W-16, 60);
    drawMiniPiece(nextPiece, cx, 52);

    // HOLD
    ctx.fillStyle = canHold ? 'rgba(0,217,255,0.5)' : 'rgba(255,255,255,0.2)';
    ctx.font = 'bold 10px monospace';
    ctx.fillText('HOLD', cx, 100);
    ctx.strokeStyle = 'rgba(0,217,255,0.15)';
    ctx.strokeRect(px+8, 104, PANEL_W-16, 60);
    if (held) drawMiniPiece(held, cx, 134, canHold ? 14 : 12);

    // SCORE
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '9px monospace';
    ctx.fillText('SCORE', cx, 185);
    ctx.fillStyle = '#00d9ff';
    ctx.font = 'bold 13px monospace';
    ctx.fillText(score, cx, 200);

    // LINES
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '9px monospace';
    ctx.fillText('LINES', cx, 222);
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 13px monospace';
    ctx.fillText(lines, cx, 237);

    // LEVEL
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '9px monospace';
    ctx.fillText('LEVEL', cx, 259);
    ctx.fillStyle = '#a855f7';
    ctx.font = 'bold 13px monospace';
    ctx.fillText(level, cx, 274);

    // Controls hint
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.font = '8px monospace';
    ctx.fillText('← → move', cx, H-80);
    ctx.fillText('↑ rotate', cx, H-68);
    ctx.fillText('↓ soft drop', cx, H-56);
    ctx.fillText('SPC hard drop', cx, H-44);
    ctx.fillText('C = hold', cx, H-32);

    ctx.textAlign = 'left';
  }

  // ── Input ──
  const keysDown = new Set();

  const keyHandler = e => {
    if (!started || dead) {
      if (e.code==='Space'||e.key==='Enter') {
        if (dead) initState();
        started=true;
        if (msgDisplay) msgDisplay.textContent=`LVL ${level}`;
      }
      return;
    }
    if (keysDown.has(e.code)) return;
    keysDown.add(e.code);

    switch(e.code) {
      case 'ArrowLeft':
        e.preventDefault();
        if (valid(piece.shape, piece.x-1, piece.y)) { piece.x--; lockTimer=0; }
        dasDir=-1; dasTimer=0; dasActive=false;
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (valid(piece.shape, piece.x+1, piece.y)) { piece.x++; lockTimer=0; }
        dasDir=1; dasTimer=0; dasActive=false;
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (valid(piece.shape, piece.x, piece.y+1)) { piece.y++; dropTimer=0; lockTimer=0; }
        break;
      case 'ArrowUp': case 'KeyX':
        e.preventDefault(); tryRotate(); break;
      case 'KeyZ':
        e.preventDefault();
        // Counter-clockwise: rotate 3 times
        tryRotate(); tryRotate(); tryRotate(); break;
      case 'Space':
        e.preventDefault();
        piece.y = ghostY(); place(); break;
      case 'KeyC': case 'ShiftLeft': case 'ShiftRight':
        e.preventDefault(); holdPiece(); break;
    }
  };

  const keyUpHandler = e => {
    keysDown.delete(e.code);
    if (e.code==='ArrowLeft'||e.code==='ArrowRight') { dasDir=0; dasActive=false; dasTimer=0; }
  };

  document.addEventListener('keydown', keyHandler);
  document.addEventListener('keyup',   keyUpHandler);

  // Touch swipe
  let tx0=0, ty0=0, tTime=0;
  const touchStart = e => { tx0=e.touches[0].clientX; ty0=e.touches[0].clientY; tTime=Date.now(); };
  const touchEnd   = e => {
    if (!started||dead) { started=true; if(dead) initState(); return; }
    const dx=e.changedTouches[0].clientX-tx0;
    const dy=e.changedTouches[0].clientY-ty0;
    const dt=Date.now()-tTime;
    if (Math.abs(dx)<15&&Math.abs(dy)<15&&dt<200) { tryRotate(); }
    else if (Math.abs(dx)>Math.abs(dy)) {
      const steps = Math.floor(Math.abs(dx)/30);
      for (let i=0;i<steps;i++) {
        if (dx>0&&valid(piece.shape,piece.x+1,piece.y)) piece.x++;
        if (dx<0&&valid(piece.shape,piece.x-1,piece.y)) piece.x--;
      }
    } else if (dy>40) { piece.y=ghostY(); place(); }
    else if (dy<-40) { holdPiece(); }
  };
  canvas.addEventListener('touchstart', touchStart, {passive:true});
  canvas.addEventListener('touchend',   touchEnd);

  // ── Main loop ──
  let last=0;
  function loop(ts) {
    if (!tetrisRunning) {
      document.removeEventListener('keydown', keyHandler);
      document.removeEventListener('keyup',   keyUpHandler);
      canvas.removeEventListener('touchstart', touchStart);
      canvas.removeEventListener('touchend',   touchEnd);
      return;
    }

    const dt = Math.min(ts - last, 50); last = ts;

    drawBoard();
    drawPanel();

    if (!started) {
      ctx.fillStyle='rgba(0,0,0,0.75)';
      ctx.fillRect(0,0,BOARD_W,H);
      ctx.fillStyle='#00d9ff';
      ctx.font='bold 22px monospace';
      ctx.textAlign='center';
      ctx.fillText('🧩 TETRIS', BOARD_W/2, H/2-40);
      ctx.font='12px monospace';
      ctx.fillStyle='rgba(255,255,255,0.6)';
      ctx.fillText('← → move  ↑ rotate', BOARD_W/2, H/2-10);
      ctx.fillText('↓ soft  Space hard drop', BOARD_W/2, H/2+10);
      ctx.fillText('C = hold piece', BOARD_W/2, H/2+30);
      ctx.fillStyle='rgba(255,255,255,0.35)';
      ctx.fillText(`BEST: ${hiScore}`, BOARD_W/2, H/2+55);
      ctx.fillStyle='#f59e0b';
      ctx.font='bold 13px monospace';
      ctx.fillText('SPACE / TAP to start', BOARD_W/2, H/2+80);
      ctx.textAlign='left';
      tetrisRaf=requestAnimationFrame(loop);
      return;
    }

    if (!dead) {
      // DAS (delayed auto-shift)
      if (dasDir!==0) {
        dasTimer+=dt;
        if (!dasActive && dasTimer>=DAS) { dasActive=true; dasTimer=0; }
        if (dasActive) {
          dasTimer+=dt;
          if (dasTimer>=ARR) {
            dasTimer=0;
            if (dasDir===-1&&valid(piece.shape,piece.x-1,piece.y)) { piece.x--; lockTimer=0; }
            if (dasDir===1 &&valid(piece.shape,piece.x+1,piece.y)) { piece.x++; lockTimer=0; }
          }
        }
      }

      // Soft drop (hold down)
      if (keysDown.has('ArrowDown')) {
        dropTimer+=dt*4;
      } else {
        dropTimer+=dt;
      }

      if (dropTimer>=dropInterval) {
        dropTimer=0;
        if (valid(piece.shape,piece.x,piece.y+1)) {
          piece.y++;
          lockTimer=0;
        } else {
          // Lock delay
          lockTimer+=dt;
          if (lockTimer>=lockDelay) { lockTimer=0; place(); }
        }
      } else if (!valid(piece.shape,piece.x,piece.y+1)) {
        lockTimer+=dt;
        if (lockTimer>=lockDelay) { lockTimer=0; place(); }
      }

      drawGhost();
      drawActivePiece();
    }

    if (dead) {
      ctx.fillStyle='rgba(0,0,0,0.8)';
      ctx.fillRect(0,0,BOARD_W,H);
      ctx.fillStyle='#ef4444';
      ctx.font='bold 24px monospace';
      ctx.textAlign='center';
      ctx.fillText('GAME OVER', BOARD_W/2, H/2-24);
      ctx.fillStyle='#fff';
      ctx.font='14px monospace';
      ctx.fillText(`SCORE: ${score}`, BOARD_W/2, H/2+4);
      ctx.fillText(`BEST:  ${hiScore}`, BOARD_W/2, H/2+24);
      ctx.fillStyle='rgba(255,255,255,0.45)';
      ctx.font='11px monospace';
      ctx.fillText('SPACE / TAP to restart', BOARD_W/2, H/2+52);
      ctx.textAlign='left';
    }

    tetrisRaf=requestAnimationFrame(loop);
  }

  initState();
  tetrisRunning=true;
  tetrisRaf=requestAnimationFrame(loop);
}

function openTetrisGame() {
  const modal = document.getElementById('game-modal');
  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden', 'false');
  switchGame('asteroid');
}
