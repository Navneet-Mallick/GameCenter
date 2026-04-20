/**
 * GameCenter - Difficulty System
 * Manages game difficulty levels and modifiers
 */

class DifficultyManager {
  constructor() {
    this.currentDifficulty = localStorage.getItem('gc_difficulty') || 'normal';
    this.difficulties = {
      easy: {
        name: 'Easy',
        icon: '🟢',
        multiplier: 0.7,
        speedMultiplier: 0.8,
        healthMultiplier: 1.5,
        scoreMultiplier: 0.5,
        description: 'Relaxed gameplay, slower enemies, more health'
      },
      normal: {
        name: 'Normal',
        icon: '🟡',
        multiplier: 1.0,
        speedMultiplier: 1.0,
        healthMultiplier: 1.0,
        scoreMultiplier: 1.0,
        description: 'Balanced challenge and fun'
      },
      hard: {
        name: 'Hard',
        icon: '🔴',
        multiplier: 1.5,
        speedMultiplier: 1.3,
        healthMultiplier: 0.7,
        scoreMultiplier: 2.0,
        description: 'Intense gameplay, faster enemies, less health'
      }
    };
  }

  setDifficulty(difficulty) {
    if (this.difficulties[difficulty]) {
      this.currentDifficulty = difficulty;
      localStorage.setItem('gc_difficulty', difficulty);
      soundEffects.click();
      showToast(`Difficulty: ${this.difficulties[difficulty].name}`, 'success');
      return true;
    }
    return false;
  }

  getDifficulty() {
    return this.currentDifficulty;
  }

  getDifficultyConfig() {
    return this.difficulties[this.currentDifficulty];
  }

  getModifier(type) {
    const config = this.getDifficultyConfig();
    return config[type + 'Multiplier'] || config.multiplier;
  }

  // Game-specific difficulty adjustments
  getRunnerConfig() {
    const config = this.getDifficultyConfig();
    return {
      speed: 6 * config.speedMultiplier,
      jumpPower: 12,
      gravity: 0.6,
      obstacleFrequency: 120 / config.multiplier,
      scorePerFrame: 0.1 * config.scoreMultiplier
    };
  }

  getFlappyConfig() {
    const config = this.getDifficultyConfig();
    return {
      gravity: 0.5 * config.speedMultiplier,
      jumpPower: 10,
      pipeGap: 120 / config.multiplier,
      pipeSpeed: 4 * config.speedMultiplier,
      pipeFrequency: 100 / config.multiplier,
      scorePerPipe: 10 * config.scoreMultiplier
    };
  }

  getTetrisConfig() {
    const config = this.getDifficultyConfig();
    return {
      dropSpeed: 500 / config.speedMultiplier,
      lockDelay: 500,
      linesClearBonus: 100 * config.scoreMultiplier,
      speedIncrease: 50 / config.multiplier
    };
  }

  getSnakeConfig() {
    const config = this.getDifficultyConfig();
    return {
      speed: 100 / config.speedMultiplier,
      foodScore: 10 * config.scoreMultiplier,
      speedIncrease: 2 / config.multiplier,
      maxSpeed: 30 * config.speedMultiplier
    };
  }

  getBreakoutConfig() {
    const config = this.getDifficultyConfig();
    return {
      ballSpeed: 5 * config.speedMultiplier,
      paddleSpeed: 6,
      brickScore: 10 * config.scoreMultiplier,
      lives: Math.ceil(3 * config.healthMultiplier),
      powerUpChance: 0.1 * config.multiplier
    };
  }

  getSpaceConfig() {
    const config = this.getDifficultyConfig();
    return {
      enemySpeed: 2 * config.speedMultiplier,
      shootSpeed: 5,
      enemyShootChance: 0.02 * config.multiplier,
      enemySpawnRate: 100 / config.multiplier,
      scorePerEnemy: 10 * config.scoreMultiplier,
      lives: Math.ceil(3 * config.healthMultiplier)
    };
  }

  getMinesweeperConfig() {
    const config = this.getDifficultyConfig();
    return {
      gridSize: this.currentDifficulty === 'easy' ? 8 : this.currentDifficulty === 'normal' ? 10 : 12,
      mineCount: this.currentDifficulty === 'easy' ? 10 : this.currentDifficulty === 'normal' ? 20 : 40,
      timeLimit: this.currentDifficulty === 'easy' ? 600 : this.currentDifficulty === 'normal' ? 300 : 180,
      scoreMultiplier: config.scoreMultiplier
    };
  }

  createDifficultySelector() {
    const selectorHTML = `
      <div id="difficulty-selector" class="difficulty-selector">
        <div class="difficulty-header">
          <h3>Select Difficulty</h3>
          <p>Choose your challenge level</p>
        </div>
        <div class="difficulty-options">
          ${Object.entries(this.difficulties).map(([key, diff]) => `
            <button class="difficulty-option ${key === this.currentDifficulty ? 'active' : ''}" 
                    onclick="difficultyManager.selectDifficulty('${key}')">
              <div class="difficulty-icon">${diff.icon}</div>
              <div class="difficulty-name">${diff.name}</div>
              <div class="difficulty-desc">${diff.description}</div>
              <div class="difficulty-multiplier">
                ${key === 'easy' ? '0.5x - 1.5x Score' : key === 'normal' ? '1x Score' : '2x Score'}
              </div>
            </button>
          `).join('')}
        </div>
      </div>
    `;
    return selectorHTML;
  }

  selectDifficulty(difficulty) {
    this.setDifficulty(difficulty);
    const options = document.querySelectorAll('.difficulty-option');
    options.forEach(opt => opt.classList.remove('active'));
    event.target.closest('.difficulty-option').classList.add('active');
  }

  showDifficultySelector() {
    const modal = document.createElement('div');
    modal.className = 'difficulty-modal';
    modal.innerHTML = this.createDifficultySelector();
    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }

  getDifficultyBadge() {
    const config = this.getDifficultyConfig();
    return `<span class="difficulty-badge">${config.icon} ${config.name}</span>`;
  }

  applyDifficultyToGame(gameName) {
    const config = this.getDifficultyConfig();
    
    // Store difficulty config in window for game access
    window.currentDifficultyConfig = config;
    window.currentGameDifficulty = this.currentDifficulty;
    
    // Emit event for games to listen to
    const event = new CustomEvent('difficultyChanged', {
      detail: {
        difficulty: this.currentDifficulty,
        config: config
      }
    });
    document.dispatchEvent(event);
  }

  getScoreMultiplier() {
    return this.getDifficultyConfig().scoreMultiplier;
  }

  getSpeedMultiplier() {
    return this.getDifficultyConfig().speedMultiplier;
  }

  getHealthMultiplier() {
    return this.getDifficultyConfig().healthMultiplier;
  }

  // Statistics tracking
  trackDifficultyStats(gameName, score) {
    const key = `gc_${gameName}_difficulty_stats`;
    const stats = JSON.parse(localStorage.getItem(key) || '{}');
    
    if (!stats[this.currentDifficulty]) {
      stats[this.currentDifficulty] = {
        plays: 0,
        highScore: 0,
        totalScore: 0
      };
    }

    stats[this.currentDifficulty].plays++;
    stats[this.currentDifficulty].totalScore += score;
    if (score > stats[this.currentDifficulty].highScore) {
      stats[this.currentDifficulty].highScore = score;
    }

    localStorage.setItem(key, JSON.stringify(stats));
  }

  getDifficultyStats(gameName) {
    const key = `gc_${gameName}_difficulty_stats`;
    return JSON.parse(localStorage.getItem(key) || '{}');
  }

  getDifficultyLeaderboard(gameName) {
    const stats = this.getDifficultyStats(gameName);
    return Object.entries(stats).map(([difficulty, data]) => ({
      difficulty,
      ...data,
      average: Math.floor(data.totalScore / data.plays)
    })).sort((a, b) => b.highScore - a.highScore);
  }
}

const difficultyManager = new DifficultyManager();
window.difficultyManager = difficultyManager;
