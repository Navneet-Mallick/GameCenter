/**
 * GameCenter - Music Manager
 * Handles background music playback and track selection
 */

class MusicManager {
  constructor() {
    this.tracks = [
      { id: 'interstellar', name: 'Interstellar', src: 'interstellar.mp3' },
      { id: 'eagles', name: 'Hotel California', src: 'eagles.mp3' },
      { id: 'phonk', name: 'Demons Phonk', src: 'demons_phonk.mp3' }
    ];
    
    this.currentTrackIndex = parseInt(localStorage.getItem('gc_music_track_index') || '0');
    this.enabled = localStorage.getItem('gc_music_enabled') !== 'false';
    this.volume = parseFloat(localStorage.getItem('gc_music_volume') || '0.3');
    
    this.audio = new Audio();
    this.audio.loop = true;
    this.audio.volume = this.volume;
    
    this.initialized = false;
    this.setupAudioListeners();
  }

  setupAudioListeners() {
    this.audio.addEventListener('timeupdate', () => {
      if (this.onProgress) {
        const progress = (this.audio.currentTime / this.audio.duration) * 100 || 0;
        this.onProgress(progress);
      }
    });

    this.audio.addEventListener('ended', () => {
      this.nextTrack();
    });
  }

  init() {
    if (this.initialized) return;
    
    this.updateTrack();
    
    // Auto-play if enabled (requires user interaction first)
    if (this.enabled) {
      const playAttempt = () => {
        this.play().catch(e => {
          console.log('Autoplay prevented, waiting for user interaction');
        });
        document.removeEventListener('click', playAttempt);
      };
      document.addEventListener('click', playAttempt);
    }
    
    this.initialized = true;
  }

  updateTrack() {
    const track = this.tracks[this.currentTrackIndex];
    if (track) {
      const wasPlaying = !this.audio.paused;
      this.audio.src = track.src;
      if (wasPlaying && this.enabled) {
        this.play();
      }
    }
  }

  async play() {
    if (!this.enabled || !this.audio.src) return;
    try {
      await this.audio.play();
    } catch (e) {
      console.warn('Music playback error:', e);
    }
  }

  pause() {
    this.audio.pause();
  }

  setEnabled(enabled) {
    this.enabled = enabled;
    localStorage.setItem('gc_music_enabled', enabled);
    if (enabled) {
      this.play();
    } else {
      this.pause();
    }
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    this.audio.volume = this.volume;
    localStorage.setItem('gc_music_volume', this.volume);
  }

  setTrack(index) {
    if (index >= 0 && index < this.tracks.length) {
      this.currentTrackIndex = index;
      localStorage.setItem('gc_music_track_index', index);
      this.updateTrack();
      if (this.enabled) {
        this.play();
      }
    }
  }

  nextTrack() {
    this.setTrack((this.currentTrackIndex + 1) % this.tracks.length);
  }

  getCurrentTrack() {
    return this.tracks[this.currentTrackIndex];
  }
}

const musicManager = new MusicManager();
window.musicManager = musicManager;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  musicManager.init();
});
