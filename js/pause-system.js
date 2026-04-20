/**
 * GameCenter - Pause System
 * Handles game pause/resume functionality
 */

class PauseSystem {
  constructor() {
    this.isPaused = false;
    this.pausedTime = 0;
    this.gameStartTime = 0;
    this.totalPausedDuration = 0;
  }

  init() {
    this.createPauseUI();
    this.setupKeyboardShortcuts();
  }

  createPauseUI() {
    const pauseHTML = `
      <div id="pause-overlay" class="pause-overlay" style="display: none;">
        <div class="pause-modal">
          <h2>GAME PAUSED</h2>
          <div class="pause-stats">
            <div class="stat">
              <span class="label">Time Elapsed:</span>
              <span class="value" id="pause-time">0:00</span>
            </div>
          </div>
          <div class="pause-buttons">
            <button class="btn btn-primary" onclick="pauseSystem.resume()">
              <i class="fas fa-play"></i> Resume
            </button>
            <button class="btn btn-secondary" onclick="closeGame()">
              <i class="fas fa-times"></i> Quit
            </button>
          </div>
          <div class="pause-hint">
            Press <kbd>P</kbd> or <kbd>ESC</kbd> to resume
          </div>
        </div>
      </div>
    `;

    // Add to body if not already present
    if (!document.getElementById('pause-overlay')) {
      document.body.insertAdjacentHTML('beforeend', pauseHTML);
    }
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 'p' || e.key === 'Escape') {
        if (currentGame) {
          e.preventDefault();
          if (this.isPaused) {
            this.resume();
          } else {
            this.pause();
          }
        }
      }
    });
  }

  pause() {
    if (this.isPaused || !currentGame) return;

    this.isPaused = true;
    this.pausedTime = Date.now();

    const overlay = document.getElementById('pause-overlay');
    if (overlay) {
      overlay.style.display = 'flex';
    }

    soundEffects.pause();
    showToast('Game Paused - Press P to Resume', 'success');
  }

  resume() {
    if (!this.isPaused) return;

    this.isPaused = false;
    this.totalPausedDuration += Date.now() - this.pausedTime;

    const overlay = document.getElementById('pause-overlay');
    if (overlay) {
      overlay.style.display = 'none';
    }

    soundEffects.resume();
    showToast('Game Resumed', 'success');
  }

  toggle() {
    if (this.isPaused) {
      this.resume();
    } else {
      this.pause();
    }
  }

  getElapsedTime() {
    if (!this.gameStartTime) return 0;
    const elapsed = Date.now() - this.gameStartTime - this.totalPausedDuration;
    return Math.floor(elapsed / 1000);
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  updatePauseDisplay() {
    const timeEl = document.getElementById('pause-time');
    if (timeEl) {
      timeEl.textContent = this.formatTime(this.getElapsedTime());
    }
  }

  startGame() {
    this.gameStartTime = Date.now();
    this.totalPausedDuration = 0;
    this.isPaused = false;
  }

  endGame() {
    this.gameStartTime = 0;
    this.totalPausedDuration = 0;
    this.isPaused = false;
  }
}

const pauseSystem = new PauseSystem();
window.pauseSystem = pauseSystem;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  pauseSystem.init();
});
