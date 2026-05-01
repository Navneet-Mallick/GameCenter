/**
 * GameCenter - Main Application
 * Handles theme, navigation, and global functionality
 */

// ═══════════════════════════════════════════════════════════════════
//  INITIALIZATION
// ═══════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  // Critical initialization
  initTheme();
  initNavigation();
  initSound();
  initMobileMenu();
  
  // Defer non-critical initialization
  performanceOptimizer.scheduleIdleTask(() => {
    initStats();
    loadHighScores();
    initAchievements();
    initLeaderboardTabs();
    updatePlayStreak();
  });
  
  console.log('%c🎮 GameCenter Loaded!', 'color:#00e5ff;font-size:20px;font-weight:bold;');
});

// ═══════════════════════════════════════════════════════════════════
//  THEME TOGGLE
// ═══════════════════════════════════════════════════════════════════

function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) {
    return;
  }

  const savedTheme = localStorage.getItem('gc_theme') || 'dark';
  const resolveTheme = (theme) => {
    if (theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme;
  };

  const applyThemeState = (theme) => {
    const isLight = theme === 'light';
    document.body.classList.toggle('light-theme', isLight);
    themeToggle.innerHTML = isLight
      ? '<i class="fas fa-sun"></i>'
      : '<i class="fas fa-moon"></i>';

    // Keep settings modal dropdown in sync with header toggle.
    const themeSelect = document.getElementById('theme-select');
    if (themeSelect && themeSelect.value !== theme) {
      themeSelect.value = theme;
    }
  };

  applyThemeState(resolveTheme(savedTheme));
  
  themeToggle.addEventListener('click', () => {
    const isLight = document.body.classList.contains('light-theme');
    const nextTheme = isLight ? 'dark' : 'light';
    applyThemeState(nextTheme);
    localStorage.setItem('gc_theme', nextTheme);
    if (window.settingsManager) {
      window.settingsManager.settings.theme = nextTheme;
      const themeSelect = document.getElementById('theme-select');
      if (themeSelect) themeSelect.value = nextTheme;
    }
    
    // Ripple effect
    createRipple(themeToggle);
  });
}

// ═══════════════════════════════════════════════════════════════════
//  NAVIGATION
// ═══════════════════════════════════════════════════════════════════

function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  
  // Smooth scroll
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Update active state
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  });
  
  // Scroll spy
  window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop - 100) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

// ═══════════════════════════════════════════════════════════════════
//  SOUND TOGGLE
// ═══════════════════════════════════════════════════════════════════

let soundEnabled = true;

function initSound() {
  const soundToggle = document.getElementById('sound-toggle');
  if (!soundToggle) return;

  const updateSoundIcon = (enabled) => {
    soundToggle.innerHTML = enabled ? 
      '<i class="fas fa-volume-up"></i>' : 
      '<i class="fas fa-volume-mute"></i>';
  };

  const isEnabled = localStorage.getItem('gc_sound_effects') !== 'false';
  updateSoundIcon(isEnabled);
  
  soundToggle.addEventListener('click', () => {
    const currentState = localStorage.getItem('gc_sound_effects') !== 'false';
    const newState = !currentState;
    
    updateSoundIcon(newState);
    localStorage.setItem('gc_sound_effects', newState);
    localStorage.setItem('gc_music_enabled', newState);
    
    if (window.soundEffects) soundEffects.setEnabled(newState);
    if (window.musicManager) musicManager.setEnabled(newState);
    if (window.settingsManager) {
      window.settingsManager.settings.soundEffects = newState;
      window.settingsManager.settings.musicEnabled = newState;
      const soundCheck = document.getElementById('sound-effects-toggle');
      const musicCheck = document.getElementById('music-toggle');
      if (soundCheck) soundCheck.checked = newState;
      if (musicCheck) musicCheck.checked = newState;
    }
    
    showToast(newState ? 'Sound & Music enabled' : 'Sound & Music muted', 'success');
    if (newState && window.soundEffects) soundEffects.click();
    
    createRipple(soundToggle);
  });
}

function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const nav = document.querySelector('.nav');
  if (!menuBtn || !nav) return;

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    nav.classList.toggle('active');
    menuBtn.innerHTML = nav.classList.contains('active') ? 
      '<i class="fas fa-times"></i>' : 
      '<i class="fas fa-bars"></i>';
    
    createRipple(menuBtn);
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('active') && !nav.contains(e.target) && e.target !== menuBtn) {
      nav.classList.remove('active');
      menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    }
  });

  // Close menu when clicking a link
  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
      menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    });
  });
}

// ═══════════════════════════════════════════════════════════════════
//  STATS
// ═══════════════════════════════════════════════════════════════════

function initStats() {
  updateTotalPlays();
}

function updateTotalPlays() {
  const stats = JSON.parse(localStorage.getItem('gc_stats') || '{}');
  let total = 0;
  Object.values(stats).forEach(game => {
    total += game.plays || 0;
  });
  
  const totalPlaysEl = document.getElementById('total-plays');
  if (totalPlaysEl) {
    animateNumber(totalPlaysEl, 0, total, 1000);
  }
}

function animateNumber(element, start, end, duration) {
  const range = end - start;
  const increment = range / (duration / 16);
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= end) {
      current = end;
      clearInterval(timer);
    }
    element.textContent = Math.floor(current);
  }, 16);
}

// ═══════════════════════════════════════════════════════════════════
//  HIGH SCORES
// ═══════════════════════════════════════════════════════════════════

function loadHighScores() {
  const games = ['runner', 'flappy', 'tetris', 'minesweeper', 'snake', 'breakout', 'space'];
  
  games.forEach(game => {
    const stats = JSON.parse(localStorage.getItem(`gc_${game}_stats`) || '{}');
    const highScoreEl = document.querySelector(`.high-score[data-game="${game}"]`);
    const playCountEl = document.querySelector(`.play-count[data-game="${game}"]`);
    
    if (highScoreEl) {
      highScoreEl.textContent = stats.highScore || 0;
    }
    if (playCountEl) {
      playCountEl.textContent = stats.plays || 0;
    }
  });
}

// ═══════════════════════════════════════════════════════════════════
//  TOAST NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════════

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icon = type === 'success' ? 'check-circle' : 
               type === 'error' ? 'exclamation-circle' : 
               'info-circle';
  
  toast.innerHTML = `
    <i class="fas fa-${icon}"></i>
    <span class="toast-message">${message}</span>
  `;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100px)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ═══════════════════════════════════════════════════════════════════
//  RIPPLE EFFECT
// ═══════════════════════════════════════════════════════════════════

function createRipple(element) {
  const ripple = document.createElement('span');
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = '50%';
  ripple.style.top = '50%';
  ripple.style.transform = 'translate(-50%, -50%) scale(0)';
  ripple.style.position = 'absolute';
  ripple.style.borderRadius = '50%';
  ripple.style.background = 'rgba(255, 255, 255, 0.5)';
  ripple.style.pointerEvents = 'none';
  ripple.style.transition = 'transform 0.6s, opacity 0.6s';
  
  element.style.position = 'relative';
  element.style.overflow = 'hidden';
  element.appendChild(ripple);
  
  requestAnimationFrame(() => {
    ripple.style.transform = 'translate(-50%, -50%) scale(2)';
    ripple.style.opacity = '0';
  });
  
  setTimeout(() => ripple.remove(), 600);
}

// ═══════════════════════════════════════════════════════════════════
//  UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

window.showToast = showToast;
window.soundEnabled = () => soundEnabled;
