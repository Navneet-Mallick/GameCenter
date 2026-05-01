/**
 * ProGames07 - Achievements System
 * Tracks and displays player achievements and badges
 */

// ═══════════════════════════════════════════════════════════════════
//  ACHIEVEMENTS DATABASE
// ═══════════════════════════════════════════════════════════════════

const ACHIEVEMENTS = {
  // Milestone Achievements
  first_play: {
    id: 'first_play',
    name: 'First Steps',
    description: 'Play your first game',
    icon: '🎮',
    points: 10,
    condition: (stats) => stats.totalPlays >= 1
  },
  
  ten_plays: {
    id: 'ten_plays',
    name: 'Getting Started',
    description: 'Play 10 games',
    icon: '🚀',
    points: 25,
    condition: (stats) => stats.totalPlays >= 10
  },
  
  fifty_plays: {
    id: 'fifty_plays',
    name: 'Dedicated Gamer',
    description: 'Play 50 games',
    icon: '⭐',
    points: 50,
    condition: (stats) => stats.totalPlays >= 50
  },
  
  hundred_plays: {
    id: 'hundred_plays',
    name: 'Gaming Legend',
    description: 'Play 100 games',
    icon: '👑',
    points: 100,
    condition: (stats) => stats.totalPlays >= 100
  },
  
  // Score Achievements
  high_scorer: {
    id: 'high_scorer',
    name: 'High Scorer',
    description: 'Achieve a score of 1000+',
    icon: '🏆',
    points: 50,
    condition: (stats) => {
      const games = ['runner', 'flappy', 'tetris', 'snake', 'breakout', 'space'];
      return games.some(game => {
        const gameStats = JSON.parse(localStorage.getItem(`gc_${game}_stats`) || '{}');
        return (gameStats.highScore || 0) >= 1000;
      });
    }
  },
  
  master_scorer: {
    id: 'master_scorer',
    name: 'Master Scorer',
    description: 'Achieve a score of 5000+',
    icon: '💎',
    points: 100,
    condition: (stats) => {
      const games = ['runner', 'flappy', 'tetris', 'snake', 'breakout', 'space'];
      return games.some(game => {
        const gameStats = JSON.parse(localStorage.getItem(`gc_${game}_stats`) || '{}');
        return (gameStats.highScore || 0) >= 5000;
      });
    }
  },
  
  // Game Mastery
  runner_master: {
    id: 'runner_master',
    name: 'Runner Master',
    description: 'Score 2000+ in Runner',
    icon: '🏃',
    points: 50,
    condition: (stats) => {
      const gameStats = JSON.parse(localStorage.getItem('gc_runner_stats') || '{}');
      return (gameStats.highScore || 0) >= 2000;
    }
  },
  
  flappy_master: {
    id: 'flappy_master',
    name: 'Flappy Master',
    description: 'Score 100+ in Flappy Bird',
    icon: '🐦',
    points: 50,
    condition: (stats) => {
      const gameStats = JSON.parse(localStorage.getItem('gc_flappy_stats') || '{}');
      return (gameStats.highScore || 0) >= 100;
    }
  },
  
  tetris_master: {
    id: 'tetris_master',
    name: 'Tetris Master',
    description: 'Score 5000+ in Tetris',
    icon: '🧩',
    points: 50,
    condition: (stats) => {
      const gameStats = JSON.parse(localStorage.getItem('gc_tetris_stats') || '{}');
      return (gameStats.highScore || 0) >= 5000;
    }
  },
  
  snake_master: {
    id: 'snake_master',
    name: 'Snake Master',
    description: 'Score 500+ in Snake',
    icon: '🐍',
    points: 50,
    condition: (stats) => {
      const gameStats = JSON.parse(localStorage.getItem('gc_snake_stats') || '{}');
      return (gameStats.highScore || 0) >= 500;
    }
  },
  
  breakout_master: {
    id: 'breakout_master',
    name: 'Breakout Master',
    description: 'Score 1000+ in Breakout',
    icon: '🎯',
    points: 50,
    condition: (stats) => {
      const gameStats = JSON.parse(localStorage.getItem('gc_breakout_stats') || '{}');
      return (gameStats.highScore || 0) >= 1000;
    }
  },
  
  space_master: {
    id: 'space_master',
    name: 'Space Master',
    description: 'Score 2000+ in Space Invaders',
    icon: '👾',
    points: 50,
    condition: (stats) => {
      const gameStats = JSON.parse(localStorage.getItem('gc_space_stats') || '{}');
      return (gameStats.highScore || 0) >= 2000;
    }
  },
  
  // Variety Achievements
  all_games_played: {
    id: 'all_games_played',
    name: 'Completionist',
    description: 'Play all 7 games',
    icon: '🎪',
    points: 75,
    condition: (stats) => {
      const games = ['runner', 'flappy', 'tetris', 'minesweeper', 'snake', 'breakout', 'space'];
      return games.every(game => {
        const gameStats = JSON.parse(localStorage.getItem(`gc_${game}_stats`) || '{}');
        return (gameStats.plays || 0) > 0;
      });
    }
  },
  
  all_games_mastered: {
    id: 'all_games_mastered',
    name: 'Ultimate Champion',
    description: 'Master all 7 games',
    icon: '🏅',
    points: 200,
    condition: (stats) => {
      const conditions = [
        () => {
          const gameStats = JSON.parse(localStorage.getItem('gc_runner_stats') || '{}');
          return (gameStats.highScore || 0) >= 2000;
        },
        () => {
          const gameStats = JSON.parse(localStorage.getItem('gc_flappy_stats') || '{}');
          return (gameStats.highScore || 0) >= 100;
        },
        () => {
          const gameStats = JSON.parse(localStorage.getItem('gc_tetris_stats') || '{}');
          return (gameStats.highScore || 0) >= 5000;
        },
        () => {
          const gameStats = JSON.parse(localStorage.getItem('gc_snake_stats') || '{}');
          return (gameStats.highScore || 0) >= 500;
        },
        () => {
          const gameStats = JSON.parse(localStorage.getItem('gc_breakout_stats') || '{}');
          return (gameStats.highScore || 0) >= 1000;
        },
        () => {
          const gameStats = JSON.parse(localStorage.getItem('gc_space_stats') || '{}');
          return (gameStats.highScore || 0) >= 2000;
        }
      ];
      return conditions.every(condition => condition());
    }
  }
};

// ═══════════════════════════════════════════════════════════════════
//  ACHIEVEMENTS SYSTEM
// ═══════════════════════════════════════════════════════════════════

function initAchievements() {
  loadAchievements();
  renderAchievements();
  checkNewAchievements();
}

function getUnlockedAchievements() {
  const unlocked = JSON.parse(localStorage.getItem('gc_achievements') || '[]');
  return unlocked;
}

function isAchievementUnlocked(achievementId) {
  return getUnlockedAchievements().includes(achievementId);
}

function unlockAchievement(achievementId) {
  const unlocked = getUnlockedAchievements();
  if (!unlocked.includes(achievementId)) {
    unlocked.push(achievementId);
    localStorage.setItem('gc_achievements', JSON.stringify(unlocked));
    
    const achievement = ACHIEVEMENTS[achievementId];
    if (achievement) {
      showToast(`🎉 Achievement Unlocked: ${achievement.name}!`, 'success');
      playAchievementSound();
    }
    
    return true;
  }
  return false;
}

function checkNewAchievements() {
  const stats = JSON.parse(localStorage.getItem('gc_stats') || '{}');
  let totalPlays = 0;
  Object.values(stats).forEach(game => {
    totalPlays += game.plays || 0;
  });
  
  const checkStats = { totalPlays };
  
  Object.values(ACHIEVEMENTS).forEach(achievement => {
    if (!isAchievementUnlocked(achievement.id) && achievement.condition(checkStats)) {
      unlockAchievement(achievement.id);
    }
  });
}

function getTotalAchievementPoints() {
  const unlocked = getUnlockedAchievements();
  return unlocked.reduce((total, id) => {
    const achievement = ACHIEVEMENTS[id];
    return total + (achievement ? achievement.points : 0);
  }, 0);
}

function renderAchievements() {
  const container = document.getElementById('achievements-grid');
  if (!container) return;
  
  container.innerHTML = '';
  
  Object.values(ACHIEVEMENTS).forEach(achievement => {
    const isUnlocked = isAchievementUnlocked(achievement.id);
    const card = document.createElement('div');
    card.className = `achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`;
    card.innerHTML = `
      <div class="achievement-icon">${achievement.icon}</div>
      <div class="achievement-content">
        <h4 class="achievement-name">${achievement.name}</h4>
        <p class="achievement-description">${achievement.description}</p>
        <div class="achievement-points">
          <i class="fas fa-star"></i> ${achievement.points} pts
        </div>
      </div>
      ${isUnlocked ? '<div class="achievement-badge"><i class="fas fa-check"></i></div>' : ''}
    `;
    container.appendChild(card);
  });
}

function loadAchievements() {
  // Initialize achievements in localStorage if not present
  if (!localStorage.getItem('gc_achievements')) {
    localStorage.setItem('gc_achievements', JSON.stringify([]));
  }
}

function playAchievementSound() {
  if (window.soundEnabled && window.soundEnabled()) {
    // Create a simple beep sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
      // Silently fail if audio context is not available
    }
  }
}

// ═══════════════════════════════════════════════════════════════════
//  EXPORT FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

window.initAchievements = initAchievements;
window.checkNewAchievements = checkNewAchievements;
window.getTotalAchievementPoints = getTotalAchievementPoints;
window.getUnlockedAchievements = getUnlockedAchievements;
