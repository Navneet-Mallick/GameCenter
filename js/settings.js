/**
 * GameCenter - Settings System
 * Manages user preferences and settings
 */

class SettingsManager {
  constructor() {
    this.settings = {
      soundEffects: localStorage.getItem('gc_sound_effects') !== 'false',
      soundVolume: parseFloat(localStorage.getItem('gc_sound_volume') || '0.5'),
      musicEnabled: localStorage.getItem('gc_music_enabled') !== 'false',
      musicVolume: parseFloat(localStorage.getItem('gc_music_volume') || '0.3'),
      theme: localStorage.getItem('gc_theme') || 'dark',
      difficulty: localStorage.getItem('gc_difficulty') || 'normal',
      notifications: localStorage.getItem('gc_notifications') !== 'false',
      particlesEnabled: localStorage.getItem('gc_particles') !== 'false',
      animationsEnabled: localStorage.getItem('gc_animations') !== 'false',
      fps: localStorage.getItem('gc_fps_display') === 'true'
    };
  }

  init() {
    this.createSettingsUI();
    this.setupEventListeners();
    this.applySettings();
  }

  createSettingsUI() {
    const settingsHTML = `
      <div id="settings-modal" class="settings-modal" style="display: none;">
        <div class="settings-content">
          <div class="settings-header">
            <h2>Settings</h2>
            <button class="close-btn" onclick="settingsManager.closeSettings()">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="settings-body">
            <!-- Audio Settings -->
            <div class="settings-section">
              <h3><i class="fas fa-volume-up"></i> Audio</h3>
              
              <div class="setting-item">
                <label>Sound Effects</label>
                <div class="toggle-switch">
                  <input type="checkbox" id="sound-effects-toggle" class="toggle-input">
                  <span class="toggle-slider"></span>
                </div>
              </div>

              <div class="setting-item">
                <label>Sound Volume</label>
                <input type="range" id="sound-volume-slider" min="0" max="100" value="50" class="slider">
                <span class="volume-display" id="sound-volume-display">50%</span>
              </div>

              <div class="setting-item">
                <label>Music</label>
                <div class="toggle-switch">
                  <input type="checkbox" id="music-toggle" class="toggle-input">
                  <span class="toggle-slider"></span>
                </div>
              </div>

              <div class="setting-item">
                <label>Music Volume</label>
                <input type="range" id="music-volume-slider" min="0" max="100" value="30" class="slider">
                <span class="volume-display" id="music-volume-display">30%</span>
              </div>
            </div>

            <!-- Display Settings -->
            <div class="settings-section">
              <h3><i class="fas fa-palette"></i> Display</h3>
              
              <div class="setting-item">
                <label>Theme</label>
                <select id="theme-select" class="select-input">
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="auto">Auto</option>
                </select>
              </div>

              <div class="setting-item">
                <label>Particles</label>
                <div class="toggle-switch">
                  <input type="checkbox" id="particles-toggle" class="toggle-input">
                  <span class="toggle-slider"></span>
                </div>
              </div>

              <div class="setting-item">
                <label>Animations</label>
                <div class="toggle-switch">
                  <input type="checkbox" id="animations-toggle" class="toggle-input">
                  <span class="toggle-slider"></span>
                </div>
              </div>

              <div class="setting-item">
                <label>Show FPS Counter</label>
                <div class="toggle-switch">
                  <input type="checkbox" id="fps-toggle" class="toggle-input">
                  <span class="toggle-slider"></span>
                </div>
              </div>
            </div>

            <!-- Gameplay Settings -->
            <div class="settings-section">
              <h3><i class="fas fa-gamepad"></i> Gameplay</h3>
              
              <div class="setting-item">
                <label>Difficulty</label>
                <select id="difficulty-select" class="select-input">
                  <option value="easy">Easy</option>
                  <option value="normal">Normal</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div class="setting-item">
                <label>Notifications</label>
                <div class="toggle-switch">
                  <input type="checkbox" id="notifications-toggle" class="toggle-input">
                  <span class="toggle-slider"></span>
                </div>
              </div>
            </div>

            <!-- Data Settings -->
            <div class="settings-section">
              <h3><i class="fas fa-database"></i> Data</h3>
              
              <div class="setting-item">
                <label>Storage Used</label>
                <div class="storage-info" id="storage-info">
                  <span id="storage-used">0</span> / <span id="storage-total">5</span> MB
                </div>
              </div>

              <div class="setting-item">
                <button class="btn btn-secondary" onclick="settingsManager.clearData()">
                  <i class="fas fa-trash"></i> Clear All Data
                </button>
              </div>
            </div>
          </div>

          <div class="settings-footer">
            <button class="btn btn-primary" onclick="settingsManager.closeSettings()">
              <i class="fas fa-check"></i> Done
            </button>
          </div>
        </div>
      </div>
    `;

    if (!document.getElementById('settings-modal')) {
      document.body.insertAdjacentHTML('beforeend', settingsHTML);
    }
  }

  setupEventListeners() {
    // Sound Effects
    const soundToggle = document.getElementById('sound-effects-toggle');
    if (soundToggle) {
      soundToggle.checked = this.settings.soundEffects;
      soundToggle.addEventListener('change', (e) => {
        this.settings.soundEffects = e.target.checked;
        soundEffects.setEnabled(e.target.checked);
        localStorage.setItem('gc_sound_effects', e.target.checked);
        soundEffects.click();
      });
    }

    // Sound Volume
    const soundVolume = document.getElementById('sound-volume-slider');
    if (soundVolume) {
      soundVolume.value = this.settings.soundVolume * 100;
      soundVolume.addEventListener('input', (e) => {
        const volume = e.target.value / 100;
        this.settings.soundVolume = volume;
        soundEffects.setVolume(volume);
        localStorage.setItem('gc_sound_volume', volume);
        document.getElementById('sound-volume-display').textContent = e.target.value + '%';
      });
    }

    // Music
    const musicToggle = document.getElementById('music-toggle');
    if (musicToggle) {
      musicToggle.checked = this.settings.musicEnabled;
      musicToggle.addEventListener('change', (e) => {
        this.settings.musicEnabled = e.target.checked;
        localStorage.setItem('gc_music_enabled', e.target.checked);
      });
    }

    // Music Volume
    const musicVolume = document.getElementById('music-volume-slider');
    if (musicVolume) {
      musicVolume.value = this.settings.musicVolume * 100;
      musicVolume.addEventListener('input', (e) => {
        this.settings.musicVolume = e.target.value / 100;
        localStorage.setItem('gc_music_volume', this.settings.musicVolume);
        document.getElementById('music-volume-display').textContent = e.target.value + '%';
      });
    }

    // Theme
    const themeSelect = document.getElementById('theme-select');
    if (themeSelect) {
      themeSelect.value = this.settings.theme;
      themeSelect.addEventListener('change', (e) => {
        this.settings.theme = e.target.value;
        localStorage.setItem('gc_theme', e.target.value);
        this.applyTheme(e.target.value);
      });
    }

    // Particles
    const particlesToggle = document.getElementById('particles-toggle');
    if (particlesToggle) {
      particlesToggle.checked = this.settings.particlesEnabled;
      particlesToggle.addEventListener('change', (e) => {
        this.settings.particlesEnabled = e.target.checked;
        localStorage.setItem('gc_particles', e.target.checked);
        const particles = document.getElementById('particles');
        if (particles) {
          particles.style.display = e.target.checked ? 'block' : 'none';
        }
      });
    }

    // Animations
    const animationsToggle = document.getElementById('animations-toggle');
    if (animationsToggle) {
      animationsToggle.checked = this.settings.animationsEnabled;
      animationsToggle.addEventListener('change', (e) => {
        this.settings.animationsEnabled = e.target.checked;
        localStorage.setItem('gc_animations', e.target.checked);
        document.body.style.animation = e.target.checked ? '' : 'none';
      });
    }

    // FPS Display
    const fpsToggle = document.getElementById('fps-toggle');
    if (fpsToggle) {
      fpsToggle.checked = this.settings.fps;
      fpsToggle.addEventListener('change', (e) => {
        this.settings.fps = e.target.checked;
        localStorage.setItem('gc_fps_display', e.target.checked);
      });
    }

    // Difficulty
    const difficultySelect = document.getElementById('difficulty-select');
    if (difficultySelect) {
      difficultySelect.value = this.settings.difficulty;
      difficultySelect.addEventListener('change', (e) => {
        this.settings.difficulty = e.target.value;
        localStorage.setItem('gc_difficulty', e.target.value);
        difficultyManager.setDifficulty(e.target.value);
        showToast(`Difficulty set to ${e.target.value}`, 'success');
      });
    }

    // Notifications
    const notificationsToggle = document.getElementById('notifications-toggle');
    if (notificationsToggle) {
      notificationsToggle.checked = this.settings.notifications;
      notificationsToggle.addEventListener('change', (e) => {
        this.settings.notifications = e.target.checked;
        localStorage.setItem('gc_notifications', e.target.checked);
      });
    }
  }

  applySettings() {
    this.applyTheme(this.settings.theme);
    soundEffects.setEnabled(this.settings.soundEffects);
    soundEffects.setVolume(this.settings.soundVolume);
  }

  applyTheme(theme) {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else if (theme === 'dark') {
      document.body.classList.remove('light-theme');
    } else if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.body.classList.remove('light-theme');
      } else {
        document.body.classList.add('light-theme');
      }
    }
  }

  openSettings() {
    const modal = document.getElementById('settings-modal');
    if (modal) {
      modal.style.display = 'flex';
      this.updateStorageInfo();
    }
  }

  closeSettings() {
    const modal = document.getElementById('settings-modal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  updateStorageInfo() {
    try {
      let used = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          used += localStorage[key].length + key.length;
        }
      }
      const usedMB = (used / 1024 / 1024).toFixed(2);
      document.getElementById('storage-used').textContent = usedMB;
    } catch (e) {
      console.warn('Could not calculate storage');
    }
  }

  clearData() {
    if (confirm('Are you sure? This will delete all your scores and achievements!')) {
      localStorage.clear();
      showToast('All data cleared', 'success');
      setTimeout(() => location.reload(), 1000);
    }
  }

  getSetting(key) {
    return this.settings[key];
  }

  setSetting(key, value) {
    this.settings[key] = value;
    localStorage.setItem(`gc_${key}`, value);
  }
}

const settingsManager = new SettingsManager();
window.settingsManager = settingsManager;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  settingsManager.init();
});
