/**
 * GameCenter - Enhancements
 * Additional features and utilities for enhanced gameplay
 */

// ═══════════════════════════════════════════════════════════════════
//  GAME STATISTICS DASHBOARD
// ═══════════════════════════════════════════════════════════════════

function getGameStatistics() {
  const games = ['runner', 'flappy', 'tetris', 'minesweeper', 'snake', 'breakout', 'space'];
  const stats = {
    totalGames: games.length,
    totalPlays: 0,
    totalHighScore: 0,
    gamesPlayed: 0,
    averageScore: 0,
    gameStats: {}
  };
  
  games.forEach(game => {
    const gameStats = JSON.parse(localStorage.getItem(`gc_${game}_stats`) || '{}');
    stats.totalPlays += gameStats.plays || 0;
    stats.totalHighScore += gameStats.highScore || 0;
    if ((gameStats.plays || 0) > 0) {
      stats.gamesPlayed++;
    }
    stats.gameStats[game] = gameStats;
  });
  
  stats.averageScore = stats.gamesPlayed > 0 ? Math.floor(stats.totalHighScore / stats.gamesPlayed) : 0;
  
  return stats;
}

function displayGameStatistics() {
  const stats = getGameStatistics();
  console.log('%c📊 GameCenter Statistics', 'color:#00e5ff;font-size:16px;font-weight:bold;');
  console.log(`Total Plays: ${stats.totalPlays}`);
  console.log(`Games Played: ${stats.gamesPlayed}/${stats.totalGames}`);
  console.log(`Total High Score: ${stats.totalHighScore}`);
  console.log(`Average Score: ${stats.averageScore}`);
  console.table(stats.gameStats);
}

// ═══════════════════════════════════════════════════════════════════
//  LEADERBOARD SYSTEM
// ═══════════════════════════════════════════════════════════════════

function updateLeaderboard(gameName) {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const leaderboardContent = document.getElementById('leaderboard-content');
  
  if (!leaderboardContent) return;
  
  // Update active tab
  tabBtns.forEach(btn => {
    if (btn.dataset.game === gameName) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  // Get game stats
  const stats = JSON.parse(localStorage.getItem(`gc_${gameName}_stats`) || '{}');
  
  if (!stats.highScore || stats.highScore === 0) {
    leaderboardContent.innerHTML = `
      <div class="leaderboard-empty">
        <i class="fas fa-trophy"></i>
        <p>No scores yet. Be the first to play!</p>
      </div>
    `;
    return;
  }
  
  // Display leaderboard
  const leaderboardHTML = `
    <div class="leaderboard-list">
      <div class="leaderboard-item">
        <div class="leaderboard-rank gold">🥇</div>
        <div class="leaderboard-content">
          <div style="color: var(--text-primary); font-weight: 600;">Your Best Score</div>
          <div style="color: var(--text-muted); font-size: 0.9rem;">Personal Record</div>
        </div>
        <div class="leaderboard-score">${stats.highScore}</div>
      </div>
      <div class="leaderboard-item">
        <div class="leaderboard-rank silver">📊</div>
        <div class="leaderboard-content">
          <div style="color: var(--text-primary); font-weight: 600;">Times Played</div>
          <div style="color: var(--text-muted); font-size: 0.9rem;">Total Sessions</div>
        </div>
        <div class="leaderboard-score">${stats.plays || 0}</div>
      </div>
    </div>
  `;
  
  leaderboardContent.innerHTML = leaderboardHTML;
}

// ═══════════════════════════════════════════════════════════════════
//  LEADERBOARD TAB LISTENERS
// ═══════════════════════════════════════════════════════════════════

function initLeaderboardTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const gameName = btn.dataset.game;
      updateLeaderboard(gameName);
    });
  });
  
  // Load first game's leaderboard
  if (tabBtns.length > 0) {
    updateLeaderboard(tabBtns[0].dataset.game);
  }
}

// ═══════════════════════════════════════════════════════════════════
//  PERFORMANCE MONITORING
// ═══════════════════════════════════════════════════════════════════

class PerformanceMonitor {
  constructor() {
    this.fps = 0;
    this.frameCount = 0;
    this.lastTime = performance.now();
  }
  
  update() {
    this.frameCount++;
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    
    if (deltaTime >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastTime = currentTime;
    }
  }
  
  getFPS() {
    return this.fps;
  }
}

const performanceMonitor = new PerformanceMonitor();

// ═══════════════════════════════════════════════════════════════════
//  GAME TIPS & HINTS
// ═══════════════════════════════════════════════════════════════════

const GAME_TIPS = {
  runner: [
    'Double jump to reach higher obstacles!',
    'Timing is everything - practice your jumps',
    'Try to maintain a steady rhythm',
    'Collect power-ups for bonus points'
  ],
  flappy: [
    'Tap gently for better control',
    'Aim for the center of the pipes',
    'Stay calm and focus on the gaps',
    'Practice makes perfect!'
  ],
  tetris: [
    'Plan ahead for better piece placement',
    'Use the hold feature strategically',
    'Clear multiple lines for bonus points',
    'Keep the stack low for more options'
  ],
  minesweeper: [
    'Start from the corners for easier reveals',
    'Use numbers to deduce mine locations',
    'Flag suspicious areas to stay organized',
    'Take your time - there\'s no rush!'
  ],
  snake: [
    'Plan your path to avoid dead ends',
    'Use the walls to your advantage',
    'Collect food efficiently',
    'Stay away from your own tail!'
  ],
  breakout: [
    'Aim for the top bricks first',
    'Use the paddle edges for angle control',
    'Catch the ball carefully',
    'Build momentum for better scores'
  ],
  space: [
    'Move constantly to avoid enemy fire',
    'Focus on one enemy at a time',
    'Use the screen edges strategically',
    'Collect power-ups when possible'
  ]
};

function getRandomTip(gameName) {
  const tips = GAME_TIPS[gameName] || [];
  if (tips.length === 0) return 'Good luck!';
  return tips[Math.floor(Math.random() * tips.length)];
}

function showGameTip(gameName) {
  const tip = getRandomTip(gameName);
  showToast(`💡 Tip: ${tip}`, 'success');
}

// ═══════════════════════════════════════════════════════════════════
//  STREAK TRACKING
// ═══════════════════════════════════════════════════════════════════

function getPlayStreak() {
  const lastPlayDate = localStorage.getItem('gc_last_play_date');
  const today = new Date().toDateString();
  
  if (lastPlayDate === today) {
    return parseInt(localStorage.getItem('gc_play_streak') || '1');
  }
  
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (lastPlayDate === yesterday) {
    const streak = parseInt(localStorage.getItem('gc_play_streak') || '0') + 1;
    localStorage.setItem('gc_play_streak', streak);
    localStorage.setItem('gc_last_play_date', today);
    return streak;
  }
  
  localStorage.setItem('gc_play_streak', '1');
  localStorage.setItem('gc_last_play_date', today);
  return 1;
}

function updatePlayStreak() {
  const streak = getPlayStreak();
  if (streak > 1) {
    showToast(`🔥 ${streak} day streak! Keep it up!`, 'success');
  }
}

// ═══════════════════════════════════════════════════════════════════
//  EXPORT FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

window.getGameStatistics = getGameStatistics;
window.displayGameStatistics = displayGameStatistics;
window.updateLeaderboard = updateLeaderboard;
window.initLeaderboardTabs = initLeaderboardTabs;
window.getRandomTip = getRandomTip;
window.showGameTip = showGameTip;
window.getPlayStreak = getPlayStreak;
window.updatePlayStreak = updatePlayStreak;
window.performanceMonitor = performanceMonitor;
