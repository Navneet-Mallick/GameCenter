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
    // Delay setupEventListeners to ensure DOM is fully ready
    setTimeout(() => {
      this.setupEventListeners();
      this.applySettings();
    }, 0);
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
              <h3><i class="fas fa-music"></i> Music System</h3>
              
              <div class="music-card">
                <div class="music-info-header">
                  <div class="music-details">
                    <span class="track-label">Currently Playing</span>
                    <h4 id="current-track-name">Interstellar</h4>
                  </div>
                  <div class="music-controls">
                    <button class="music-btn" onclick="musicManager.setTrack((musicManager.currentTrackIndex - 1 + musicManager.tracks.length) % musicManager.tracks.length)">
                      <i class="fas fa-step-backward"></i>
                    </button>
                    <button class="music-btn play-pause" id="music-play-btn">
                      <i class="fas fa-play"></i>
                    </button>
                    <button class="music-btn" onclick="musicManager.nextTrack()">
                      <i class="fas fa-step-forward"></i>
                    </button>
                  </div>
                </div>
                
                <div class="music-progress-container">
                  <div class="music-progress-bar" id="music-progress"></div>
                </div>

                <div class="music-visualizer-mock">
                  <div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div>
                  <div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div>
                </div>
              </div>

              <div class="setting-item">
                <label>Music Enabled</label>
                <label class="toggle-switch">
                  <input type="checkbox" id="music-toggle" class="toggle-input">
                  <span class="toggle-slider"></span>
                </label>
              </div>

              <div class="setting-item">
                <label>Music Volume</label>
                <div class="slider-wrapper">
                  <i class="fas fa-volume-down"></i>
                  <input type="range" id="music-volume-slider" min="0" max="100" value="30" class="slider">
                  <i class="fas fa-volume-up"></i>
                </div>
                <span class="volume-display" id="music-volume-display">30%</span>
              </div>

              <div class="setting-item">
                <label>Select Track</label>
                <select id="music-track-select" class="select-input">
                  <option value="0">Interstellar (Calm)</option>
                  <option value="1">Hotel California (Classic)</option>
                  <option value="2">Demons Phonk (Hype)</option>
                </select>
              </div>
            </div>

            <!-- SFX Settings -->
            <div class="settings-section">
              <h3><i class="fas fa-volume-up"></i> Sound Effects</h3>
              
              <div class="setting-item">
                <label>SFX Enabled</label>
                <label class="toggle-switch">
                  <input type="checkbox" id="sound-effects-toggle" class="toggle-input">
                  <span class="toggle-slider"></span>
                </label>
              </div>

              <div class="setting-item">
                <label>SFX Volume</label>
                <div class="slider-wrapper">
                  <input type="range" id="sound-volume-slider" min="0" max="100" value="50" class="slider">
                </div>
                <span class="volume-display" id="sound-volume-display">50%</span>
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
                <label class="toggle-switch">
                  <input type="checkbox" id="particles-toggle" class="toggle-input">
                  <span class="toggle-slider"></span>
                </label>
              </div>

              <div class="setting-item">
                <label>Animations</label>
                <label class="toggle-switch">
                  <input type="checkbox" id="animations-toggle" class="toggle-input">
                  <span class="toggle-slider"></span>
                </label>
              </div>

              <div class="setting-item">
                <label>Show FPS Counter</label>
                <label class="toggle-switch">
                  <input type="checkbox" id="fps-toggle" class="toggle-input">
                  <span class="toggle-slider"></span>
                </label>
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
                <label class="toggle-switch">
                  <input type="checkbox" id="notifications-toggle" class="toggle-input">
                  <span class="toggle-slider"></span>
                </label>
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
    if (this.listenersInitialized) return;

    const modal = document.getElementById('settings-modal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeSettings();
        }
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const settingsModal = document.getElementById('settings-modal');
        if (settingsModal && settingsModal.style.display === 'flex') {
          this.closeSettings();
        }
      }
    });

    this.listenersInitialized = true;

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
        if (window.musicManager) {
          musicManager.setEnabled(e.target.checked);
        }
        soundEffects.click();
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
        if (window.musicManager) {
          musicManager.setVolume(this.settings.musicVolume);
        }
      });
    }

    // Music Track
    const musicTrack = document.getElementById('music-track-select');
    if (musicTrack) {
      musicTrack.value = localStorage.getItem('gc_music_track_index') || '0';
      musicTrack.addEventListener('change', (e) => {
        const index = parseInt(e.target.value);
        if (window.musicManager) {
          musicManager.setTrack(index);
          this.updateMusicUI();
        }
        soundEffects.click();
      });
    }

    // Music Play/Pause Button
    const playPauseBtn = document.getElementById('music-play-btn');
    if (playPauseBtn) {
      playPauseBtn.addEventListener('click', () => {
        if (window.musicManager) {
          if (musicManager.audio.paused) {
            musicManager.play();
          } else {
            musicManager.pause();
          }
          this.updateMusicUI();
        }
      });
    }

    // Connect Music Progress
    if (window.musicManager) {
      musicManager.onProgress = (progress) => {
        const progressBar = document.getElementById('music-progress');
        if (progressBar) {
          progressBar.style.width = `${progress}%`;
        }
      };
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
        document.body.classList.toggle('animations-disabled', !e.target.checked);
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

    // Clear Data Button - Enhanced
    const clearDataBtn = document.querySelector('.settings-section button[onclick*="clearData"]') || 
                          document.querySelector('button.btn-secondary[onclick*="clearData"]');
    if (clearDataBtn) {
      clearDataBtn.removeAttribute('onclick');
      clearDataBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.clearData();
      });
    }

    // Done Button - Enhanced  
    const doneBtn = document.querySelector('.settings-footer .btn-primary') || 
                    document.querySelector('button[onclick*="closeSettings"]');
    if (doneBtn && !doneBtn.hasListener) {
      doneBtn.removeAttribute('onclick');
      doneBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.closeSettings();
      });
      doneBtn.hasListener = true;
    }

    // Close Button (X icon) - Enhanced
    const closeBtn = document.querySelector('.settings-header .close-btn') ||
                     document.querySelector('.settings-modal .close-btn');
    if (closeBtn && !closeBtn.hasListener) {
      closeBtn.removeAttribute('onclick');
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.closeSettings();
      });
      closeBtn.hasListener = true;
    }
  }

  applySettings() {
    this.applyTheme(this.settings.theme);
    soundEffects.setEnabled(this.settings.soundEffects);
    soundEffects.setVolume(this.settings.soundVolume);
    document.body.classList.toggle('animations-disabled', !this.settings.animationsEnabled);

    const particles = document.getElementById('particles');
    if (particles) {
      particles.style.display = this.settings.particlesEnabled ? 'block' : 'none';
    }
  }

  applyTheme(theme) {
    const resolvedTheme = theme === 'auto'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme;

    document.body.classList.toggle('light-theme', resolvedTheme === 'light');

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.innerHTML = resolvedTheme === 'light'
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';
    }

    const themeSelect = document.getElementById('theme-select');
    if (themeSelect && themeSelect.value !== theme) {
      themeSelect.value = theme;
    }

    if (window.settingsManager && window.settingsManager.settings) {
      window.settingsManager.settings.theme = theme;
    }
  }

  openSettings() {
    const modal = document.getElementById('settings-modal');
    if (modal) {
      modal.style.display = 'flex';
      this.updateStorageInfo();
      this.updateMusicUI();
      // Listeners are already setup in init()
    }
  }

  updateMusicUI() {
    if (!window.musicManager) return;
    
    const track = musicManager.getCurrentTrack();
    const nameEl = document.getElementById('current-track-name');
    if (nameEl) nameEl.textContent = track.name;
    
    const playBtn = document.getElementById('music-play-btn');
    if (playBtn) {
      playBtn.innerHTML = musicManager.audio.paused 
        ? '<i class="fas fa-play"></i>' 
        : '<i class="fas fa-pause"></i>';
    }

    const visualizer = document.querySelector('.music-visualizer-mock');
    if (visualizer) {
      if (musicManager.audio.paused) {
        visualizer.classList.remove('animating');
      } else {
        visualizer.classList.add('animating');
      }
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
      const usedEl = document.getElementById('storage-used');
      if (usedEl) {
        usedEl.textContent = usedMB;
      }
    } catch (e) {
      console.warn('Could not calculate storage');
    }
  }

  clearData() {
    const confirmed = confirm('Are you sure? This will delete all your scores, achievements, and settings!\n\nThis action cannot be undone.');
    
    if (confirmed) {
      try {
        localStorage.clear();
        console.log('✓ All data cleared successfully');
        showToast('All data cleared successfully!', 'success');
        
        // Reload page after a short delay to reinitialize everything
        setTimeout(() => {
          location.reload();
        }, 1500);
      } catch (error) {
        console.error('Error clearing data:', error);
        showToast('Error clearing data', 'error');
      }
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
