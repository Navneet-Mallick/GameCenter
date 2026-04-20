/**
 * Minesweeper Game
 */

let minesweeperGame = null;
let minesweeperRunning = false;

function stopMinesweeperGame() {
  minesweeperRunning = false;
  if (minesweeperGame) {
    minesweeperGame.cleanup();
  }
}

function startMinesweeperGame() {
  const canvas = document.getElementById('minesweeper-canvas') || document.querySelector('canvas');
  if (!canvas) {
    console.error('Canvas not found for minesweeper');
    return;
  }

  const ctx = canvas.getContext('2d');
  const config = difficultyManager.getMinesweeperConfig();
  
  minesweeperGame = new MinesweeperGame(canvas, ctx, config);
  minesweeperRunning = true;
  minesweeperGame.start();
}

class MinesweeperGame {
  constructor(canvas, ctx, config) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.config = config;
    this.gridSize = config.gridSize;
    this.mineCount = config.mineCount;
    this.cellSize = Math.floor(Math.min(canvas.width, canvas.height) / this.gridSize);
    this.grid = [];
    this.revealed = [];
    this.flagged = [];
    this.gameOver = false;
    this.won = false;
    this.score = 0;
    this.startTime = Date.now();
    this.timeLimit = config.timeLimit;
    
    this.initGrid();
    this.setupEventListeners();
  }

  initGrid() {
    // Initialize grid
    for (let i = 0; i < this.gridSize; i++) {
      this.grid[i] = [];
      this.revealed[i] = [];
      this.flagged[i] = [];
      for (let j = 0; j < this.gridSize; j++) {
        this.grid[i][j] = 0;
        this.revealed[i][j] = false;
        this.flagged[i][j] = false;
      }
    }

    // Place mines
    let minesPlaced = 0;
    while (minesPlaced < this.mineCount) {
      const x = Math.floor(Math.random() * this.gridSize);
      const y = Math.floor(Math.random() * this.gridSize);
      if (this.grid[x][y] !== 'M') {
        this.grid[x][y] = 'M';
        minesPlaced++;
      }
    }

    // Calculate numbers
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        if (this.grid[i][j] !== 'M') {
          let count = 0;
          for (let di = -1; di <= 1; di++) {
            for (let dj = -1; dj <= 1; dj++) {
              const ni = i + di, nj = j + dj;
              if (ni >= 0 && ni < this.gridSize && nj >= 0 && nj < this.gridSize) {
                if (this.grid[ni][nj] === 'M') count++;
              }
            }
          }
          this.grid[i][j] = count;
        }
      }
    }
  }

  setupEventListeners() {
    this.canvas.addEventListener('click', (e) => this.handleClick(e));
    this.canvas.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.handleRightClick(e);
    });
  }

  handleClick(e) {
    if (this.gameOver || this.won) return;
    const rect = this.canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / this.cellSize);
    const y = Math.floor((e.clientY - rect.top) / this.cellSize);
    this.reveal(x, y);
  }

  handleRightClick(e) {
    if (this.gameOver || this.won) return;
    const rect = this.canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / this.cellSize);
    const y = Math.floor((e.clientY - rect.top) / this.cellSize);
    this.toggleFlag(x, y);
  }

  reveal(x, y) {
    if (x < 0 || x >= this.gridSize || y < 0 || y >= this.gridSize) return;
    if (this.revealed[x][y] || this.flagged[x][y]) return;

    this.revealed[x][y] = true;

    if (this.grid[x][y] === 'M') {
      this.gameOver = true;
      soundEffects.gameOver();
      this.revealAll();
      updateScore(this.score);
      showToast('💣 Game Over!', 'error');
      return;
    }

    this.score += 10;

    if (this.grid[x][y] === 0) {
      for (let di = -1; di <= 1; di++) {
        for (let dj = -1; dj <= 1; dj++) {
          this.reveal(x + di, y + dj);
        }
      }
    }

    this.checkWin();
  }

  toggleFlag(x, y) {
    if (x < 0 || x >= this.gridSize || y < 0 || y >= this.gridSize) return;
    if (this.revealed[x][y]) return;
    this.flagged[x][y] = !this.flagged[x][y];
    soundEffects.click();
  }

  revealAll() {
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        this.revealed[i][j] = true;
      }
    }
  }

  checkWin() {
    let revealedCount = 0;
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        if (this.revealed[i][j]) revealedCount++;
      }
    }

    if (revealedCount === this.gridSize * this.gridSize - this.mineCount) {
      this.won = true;
      soundEffects.levelUp();
      this.score += 500;
      updateScore(this.score);
      showToast('🎉 You Won!', 'success');
    }
  }

  draw() {
    const W = this.canvas.width;
    const H = this.canvas.height;

    // Background - DARK for visibility
    this.ctx.fillStyle = '#0a0e27';
    this.ctx.fillRect(0, 0, W, H);

    // Grid
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        const x = i * this.cellSize;
        const y = j * this.cellSize;

        if (this.revealed[i][j]) {
          this.ctx.fillStyle = '#1b2345';
          this.ctx.fillRect(x, y, this.cellSize, this.cellSize);

          if (this.grid[i][j] === 'M') {
            this.ctx.fillStyle = '#ef4444';
            this.ctx.font = 'bold 20px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText('💣', x + this.cellSize / 2, y + this.cellSize / 2);
          } else if (this.grid[i][j] > 0) {
            this.ctx.fillStyle = '#00e5ff';
            this.ctx.font = 'bold 16px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(this.grid[i][j], x + this.cellSize / 2, y + this.cellSize / 2);
          }
        } else {
          this.ctx.fillStyle = this.flagged[i][j] ? '#f59e0b' : '#141a33';
          this.ctx.fillRect(x, y, this.cellSize, this.cellSize);

          if (this.flagged[i][j]) {
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = 'bold 16px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText('🚩', x + this.cellSize / 2, y + this.cellSize / 2);
          }
        }

        // Border
        this.ctx.strokeStyle = '#00e5ff';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x, y, this.cellSize, this.cellSize);
      }
    }

    // Score
    this.ctx.fillStyle = '#00e5ff';
    this.ctx.font = 'bold 16px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`Score: ${this.score}`, 10, H - 10);

    // Time
    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    this.ctx.fillText(`Time: ${elapsed}s`, W - 150, H - 10);
  }

  start() {
    const gameLoop = () => {
      this.draw();
      updateScore(this.score);

      if (!this.gameOver && !this.won) {
        requestAnimationFrame(gameLoop);
      }
    };
    gameLoop();
  }

  cleanup() {
    this.canvas.removeEventListener('click', this.handleClick);
    this.canvas.removeEventListener('contextmenu', this.handleRightClick);
  }
}
