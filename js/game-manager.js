/**
 * GameCenter - Game Manager
 * Handles game loading, modal, and game lifecycle
 */

let currentGame = null;
let currentGameInstance = null;

// ═══════════════════════════════════════════════════════════════════
//  GAME CONFIGURATION
// ═══════════════════════════════════════════════════════════════════

const GAMES = {
  runner: {
    title: '🏃 Runner',
    start: 'startRunnerGame',
    stop: 'stopRunnerGame',
    canvasId: 'runner-canvas',
    width: 620,
    height: 180
  },
  flappy: {
    title: '🐦 Flappy Bird',
    start: 'startFlappyGame',
    stop: 'stopFlappyGame',
    canvasId: 'flappy-canvas',
    width: 620,
    height: 400
  },
  tetris: {
    title: '🧩 Tetris',
    start: 'startTetrisGame',
    stop: 'stopTetrisGame',
    canvasId: 'tetris-canvas',
    width: 400,
    height: 600
  },
  minesweeper: {
    title: '💣 Minesweeper',
    start: 'startMinesweeperGame',
    stop: 'stopMinesweeperGame',
    canvasId: 'minesweeper-canvas',
    width: 600,
    height: 600
  },
  snake: {
    title: '🐍 Snake',
    start: 'startSnakeGame',
    stop: 'stopSnakeGame',
    canvasId: 'snake-canvas',
    width: 600,
    height: 600
  },
  breakout: {
    title: '🎯 Breakout',
    start: 'startBreakoutGame',
    stop: 'stopBreakoutGame',
    canvasId: 'breakout-canvas',
    width: 600,
    height: 500
  },
  space: {
    title: '👾 Space Invaders',
    start: 'startSpaceGame',
    stop: 'stopSpaceGame',
    canvasId: 'space-canvas',
    width: 600,
    height: 600
  }
};

// ═══════════════════════════════════════════════════════════════════
//  OPEN GAME
// ═══════════════════════════════════════════════════════════════════

function openGame(gameName) {
  if (!GAMES[gameName]) {
    showToast('Game not found!', 'error');
    return;
  }

  currentGame = gameName;
  const game = GAMES[gameName];
  
  // Show loading indicator
  const container = document.getElementById('game-container');
  container.innerHTML = `
    <div class="game-loading">
      <div class="loading-spinner"></div>
      <p>Loading ${game.title}...</p>
    </div>
  `;
  
  // Show modal immediately
  const modal = document.getElementById('game-modal');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Update modal title
  document.getElementById('modal-game-title').textContent = game.title;
  
  // Load game asynchronously
  setTimeout(() => {
    // Create game container
    container.innerHTML = `
      <div class="game-container">
        <div class="game-info">
          <div class="game-score">
            <i class="fas fa-star"></i> Score: <span id="current-score">0</span>
          </div>
          <div class="game-high-score">
            <i class="fas fa-trophy"></i> Best: <span id="high-score">0</span>
          </div>
          <div class="game-difficulty-indicator">
            <i class="fas fa-sliders-h"></i>
            <span>Difficulty:</span>
            <button class="difficulty-selector-btn" onclick="difficultyManager.showDifficultySelector()">
              ${difficultyManager.getDifficultyConfig().icon} ${difficultyManager.getDifficultyConfig().name}
            </button>
          </div>
        </div>
        <div class="game-canvas-wrapper">
          <canvas id="${game.canvasId}" width="${game.width}" height="${game.height}"></canvas>
        </div>
        <div class="game-controls" id="game-controls">
          Loading controls...
        </div>
        <!-- Hidden elements for games that need them -->
        <div id="game-score-display" style="display:none;"></div>
        <div id="game-hi-display" style="display:none;"></div>
        <div id="game-personality-msg" style="display:none;"></div>
      </div>
    `;
    
    // Load high score
    const stats = JSON.parse(localStorage.getItem(`gc_${gameName}_stats`) || '{}');
    document.getElementById('high-score').textContent = stats.highScore || 0;
    
    // Start game
    difficultyManager.applyDifficultyToGame(gameName);
    pauseSystem.startGame();
    startGame(gameName);
    updatePlayCount(gameName);
    checkNewAchievements();
    
    // Preload next game
    performanceOptimizer.preloadNextGame(gameName);
  }, 100);
}

// ═══════════════════════════════════════════════════════════════════
//  CLOSE GAME
// ═══════════════════════════════════════════════════════════════════

function closeGame() {
  if (currentGame && GAMES[currentGame]) {
    stopGame(currentGame);
  }
  
  pauseSystem.endGame();
  
  const modal = document.getElementById('game-modal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
  
  currentGame = null;
  currentGameInstance = null;
}

// ═══════════════════════════════════════════════════════════════════
//  START GAME
// ═══════════════════════════════════════════════════════════════════

function startGame(gameName) {
  const game = GAMES[gameName];
  console.log(`🎮 Starting game: ${gameName}`, game);
  
  try {
    // Verify canvas exists
    const canvas = document.getElementById(game.canvasId);
    if (!canvas) {
      throw new Error(`Canvas not found: ${game.canvasId}`);
    }
    console.log(`✓ Canvas found:`, canvas.id, canvas.width, canvas.height);
    
    // Verify game function exists
    if (typeof window[game.start] !== 'function') {
      throw new Error(`Game start function not found: ${game.start}`);
    }
    console.log(`✓ Game function found: ${game.start}`);
    
    // Start the game
    window[game.start]();
    updateGameControls(gameName);
    console.log(`✓ Game ${gameName} started successfully`);
    
    // Verify canvas is rendering
    setTimeout(() => {
      const ctx = canvas.getContext('2d');
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const hasContent = Array.from(imageData.data).some(v => v !== 0);
      console.log(`Canvas rendering check: ${hasContent ? '✓ Content detected' : '⚠ No content yet'}`);
    }, 500);
    
  } catch (error) {
    console.error('❌ Game start error:', error);
    showToast(`Game failed to load: ${error.message}`, 'error');
    
    // Show error in game container
    const container = document.getElementById('game-container');
    container.innerHTML = `
      <div class="game-loading">
        <div style="color: #ff4500; font-size: 3rem;">❌</div>
        <p style="color: #ff4500;">Failed to load game</p>
        <p style="color: #888; font-size: 0.9rem;">${error.message}</p>
        <button class="btn btn-primary" onclick="closeGame()">Close</button>
      </div>
    `;
  }
}

// ═══════════════════════════════════════════════════════════════════
//  STOP GAME
// ═══════════════════════════════════════════════════════════════════

function stopGame(gameName) {
  const game = GAMES[gameName];
  
  // Try to stop game with loader
  if (!gameLoader.stopGame(gameName)) {
    // Fallback to direct function call
    if (typeof window[game.stop] === 'function') {
      window[game.stop]();
    }
  }
}

// ═══════════════════════════════════════════════════════════════════
//  UPDATE GAME CONTROLS
// ═══════════════════════════════════════════════════════════════════

function updateGameControls(gameName) {
  const controlsEl = document.getElementById('game-controls');
  
  const controls = {
    runner: '<kbd>Space</kbd> or <kbd>Tap</kbd> to jump • Double jump enabled',
    flappy: '<kbd>Space</kbd> or <kbd>Tap</kbd> to flap • Avoid the pipes',
    tetris: '<kbd>← →</kbd> Move • <kbd>↑</kbd> Rotate • <kbd>Space</kbd> Drop • <kbd>C</kbd> Hold',
    minesweeper: '<kbd>Left Click</kbd> Reveal • <kbd>Right Click</kbd> Flag • <kbd>Long Press</kbd> Flag (mobile)',
    snake: '<kbd>Arrow Keys</kbd> or <kbd>WASD</kbd> to move • <kbd>Swipe</kbd> on mobile',
    breakout: '<kbd>← →</kbd> or <kbd>Mouse</kbd> to move paddle • <kbd>Touch</kbd> on mobile',
    space: '<kbd>← →</kbd> Move • <kbd>Space</kbd> Shoot • <kbd>Touch</kbd> controls on mobile'
  };
  
  controlsEl.innerHTML = controls[gameName] || 'Use keyboard or touch controls';
}

// ═══════════════════════════════════════════════════════════════════
//  UPDATE PLAY COUNT
// ═══════════════════════════════════════════════════════════════════

function updatePlayCount(gameName) {
  const stats = JSON.parse(localStorage.getItem(`gc_${gameName}_stats`) || '{}');
  stats.plays = (stats.plays || 0) + 1;
  localStorage.setItem(`gc_${gameName}_stats`, JSON.stringify(stats));
  
  // Update UI
  const playCountEl = document.querySelector(`.play-count[data-game="${gameName}"]`);
  if (playCountEl) {
    playCountEl.textContent = stats.plays;
  }
  
  // Update total plays
  updateTotalPlays();
}

// ═══════════════════════════════════════════════════════════════════
//  UPDATE SCORE
// ═══════════════════════════════════════════════════════════════════

function updateScore(score) {
  const scoreEl = document.getElementById('current-score');
  if (scoreEl) {
    scoreEl.textContent = score;
  }
  
  // Check for new high score
  if (currentGame) {
    const stats = JSON.parse(localStorage.getItem(`gc_${currentGame}_stats`) || '{}');
    if (score > (stats.highScore || 0)) {
      stats.highScore = score;
      localStorage.setItem(`gc_${currentGame}_stats`, JSON.stringify(stats));
      
      // Update UI
      const highScoreEl = document.getElementById('high-score');
      if (highScoreEl) {
        highScoreEl.textContent = score;
      }
      
      // Update card
      const cardHighScore = document.querySelector(`.high-score[data-game="${currentGame}"]`);
      if (cardHighScore) {
        cardHighScore.textContent = score;
      }
      
      // Play sound and show notification
      soundEffects.success();
      showToast('🎉 New High Score!', 'success');
    }
    
    // Track difficulty stats
    difficultyManager.trackDifficultyStats(currentGame, score);
  }
}

// ═══════════════════════════════════════════════════════════════════
//  KEYBOARD SHORTCUTS
// ═══════════════════════════════════════════════════════════════════

document.addEventListener('keydown', (e) => {
  // ESC to close game
  if (e.key === 'Escape' && currentGame) {
    closeGame();
  }
});

// ═══════════════════════════════════════════════════════════════════
//  EXPORT FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

window.openGame = openGame;
window.closeGame = closeGame;
window.updateScore = updateScore;
