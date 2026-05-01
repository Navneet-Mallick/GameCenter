/**
 * ProGames07 - Enhancements
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
  console.log('%c📊 ProGames07 Statistics', 'color:#00e5ff;font-size:16px;font-weight:bold;');
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
  const highScore = stats.highScore || 0;
  
  // Generate mock global scores for better visuals
  const mockGlobalScores = [
    { name: 'CyberKnight', score: Math.floor(highScore * 1.5) + 500, rank: 1, avatar: '👤' },
    { name: 'NeonPulse', score: Math.floor(highScore * 1.2) + 200, rank: 2, avatar: '👤' },
    { name: 'VoidWalker', score: Math.floor(highScore * 1.1) + 100, rank: 3, avatar: '👤' }
  ];

  // If no high score, use defaults for mock
  if (highScore === 0) {
    mockGlobalScores[0].score = 2500;
    mockGlobalScores[1].score = 1800;
    mockGlobalScores[2].score = 1200;
  }
  
  let leaderboardHTML = `
    <div class="leaderboard-header-row">
      <div class="rank-col">Rank</div>
      <div class="player-col">Player</div>
      <div class="score-col">Score</div>
    </div>
    <div class="leaderboard-list">
  `;

  // Add Global Top 3
  mockGlobalScores.forEach(player => {
    const rankClass = player.rank === 1 ? 'gold' : player.rank === 2 ? 'silver' : 'bronze';
    const rankIcon = player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : '🥉';
    
    leaderboardHTML += `
      <div class="leaderboard-item global-rank">
        <div class="leaderboard-rank ${rankClass}">${rankIcon}</div>
        <div class="leaderboard-player">
          <div class="player-avatar">${player.avatar}</div>
          <div class="player-info">
            <div class="player-name">${player.name}</div>
            <div class="player-status">Global Pro</div>
          </div>
        </div>
        <div class="leaderboard-score">${player.score.toLocaleString()}</div>
      </div>
    `;
  });

  // Add Personal Best
  const personalRank = highScore > 0 ? 4 : '--';
  leaderboardHTML += `
    <div class="leaderboard-divider">Your Standing</div>
    <div class="leaderboard-item personal-best ${highScore > 0 ? 'active' : ''}">
      <div class="leaderboard-rank">${personalRank}</div>
      <div class="leaderboard-player">
        <div class="player-avatar" style="background: var(--accent-primary)">ME</div>
        <div class="player-info">
          <div class="player-name">You</div>
          <div class="player-status">${highScore > 0 ? 'Ranked' : 'Not Ranked'}</div>
        </div>
      </div>
      <div class="leaderboard-score">${highScore > 0 ? highScore.toLocaleString() : 'No Score'}</div>
    </div>
  </div>
  
  <div class="leaderboard-footer">
    <div class="stat-mini">
      <i class="fas fa-play"></i>
      <span>Sessions: ${stats.plays || 0}</span>
    </div>
    <div class="stat-mini">
      <i class="fas fa-clock"></i>
      <span>Last Played: ${stats.lastPlayed ? new Date(stats.lastPlayed).toLocaleDateString() : 'Never'}</span>
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
//  REFRESH ACTIVE LEADERBOARD
// ═══════════════════════════════════════════════════════════════════

function refreshActiveLeaderboard() {
  const activeBtn = document.querySelector('.tab-btn.active');
  if (activeBtn && activeBtn.dataset.game) {
    updateLeaderboard(activeBtn.dataset.game);
  } else {
    // Fallback to first tab
    const firstBtn = document.querySelector('.tab-btn');
    if (firstBtn) {
      updateLeaderboard(firstBtn.dataset.game);
    }
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
window.refreshActiveLeaderboard = refreshActiveLeaderboard;
window.initLeaderboardTabs = initLeaderboardTabs;
window.getRandomTip = getRandomTip;
window.showGameTip = showGameTip;
window.getPlayStreak = getPlayStreak;
window.updatePlayStreak = updatePlayStreak;
window.performanceMonitor = performanceMonitor;
