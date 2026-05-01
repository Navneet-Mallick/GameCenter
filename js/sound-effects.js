/**
 * ProGames07 - Sound Effects System
 * Manages all game audio and sound effects
 */

class SoundEffects {
  constructor() {
    this.enabled = localStorage.getItem('gc_sound_effects') !== 'false';
    this.volume = parseFloat(localStorage.getItem('gc_sound_volume') || '0.5');
    this.audioContext = null;
    this.initAudioContext();
  }

  initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not supported');
    }
  }

  playSound(frequency, duration, type = 'sine', volume = this.volume) {
    if (!this.enabled || !this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (e) {
      console.warn('Sound playback error:', e);
    }
  }

  // Game sounds
  jump() {
    this.playSound(400, 0.1);
    this.playSound(600, 0.1, 'sine', this.volume * 0.7);
  }

  collect() {
    this.playSound(800, 0.15);
    this.playSound(1000, 0.1);
  }

  hit() {
    this.playSound(200, 0.2);
  }

  gameOver() {
    this.playSound(300, 0.3);
    setTimeout(() => this.playSound(200, 0.3), 150);
    setTimeout(() => this.playSound(100, 0.4), 300);
  }

  levelUp() {
    this.playSound(523, 0.1);
    setTimeout(() => this.playSound(659, 0.1), 100);
    setTimeout(() => this.playSound(784, 0.2), 200);
  }

  success() {
    this.playSound(800, 0.1);
    setTimeout(() => this.playSound(1000, 0.15), 100);
  }

  error() {
    this.playSound(200, 0.2);
    setTimeout(() => this.playSound(150, 0.2), 100);
  }

  click() {
    this.playSound(600, 0.05);
  }

  pause() {
    this.playSound(400, 0.1);
    setTimeout(() => this.playSound(500, 0.1), 50);
  }

  resume() {
    this.playSound(500, 0.1);
    setTimeout(() => this.playSound(400, 0.1), 50);
  }

  achievement() {
    this.playSound(800, 0.1);
    setTimeout(() => this.playSound(1000, 0.1), 100);
    setTimeout(() => this.playSound(1200, 0.2), 200);
  }

  setEnabled(enabled) {
    this.enabled = enabled;
    localStorage.setItem('gc_sound_effects', enabled);
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    localStorage.setItem('gc_sound_volume', this.volume);
  }

  getVolume() {
    return this.volume;
  }

  isEnabled() {
    return this.enabled;
  }
}

const soundEffects = new SoundEffects();
window.soundEffects = soundEffects;
