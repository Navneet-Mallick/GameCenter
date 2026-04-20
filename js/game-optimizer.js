/**
 * GameCenter - Game Optimizer
 * Ensures smooth 60fps gameplay
 */

class GameOptimizer {
  constructor() {
    this.frameTime = 0;
    this.lastTime = 0;
    this.fps = 60;
    this.deltaTime = 0;
  }

  // Request animation frame with delta time
  requestFrame(callback) {
    const now = performance.now();
    this.deltaTime = (now - this.lastTime) / 1000;
    this.lastTime = now;
    
    // Cap delta time to prevent large jumps
    if (this.deltaTime > 0.05) {
      this.deltaTime = 0.05;
    }
    
    callback(this.deltaTime);
    return requestAnimationFrame(() => this.requestFrame(callback));
  }

  // Optimize canvas rendering
  optimizeCanvas(canvas) {
    canvas.style.imageRendering = 'crisp-edges';
    canvas.style.imageRendering = '-webkit-optimize-contrast';
    canvas.style.willChange = 'contents';
    
    const ctx = canvas.getContext('2d', { 
      alpha: false,
      antialias: false
    });
    
    // Disable image smoothing for pixel-perfect rendering
    ctx.imageSmoothingEnabled = false;
    
    return ctx;
  }

  // Batch DOM updates
  batchUpdate(updates) {
    requestAnimationFrame(() => {
      updates.forEach(update => update());
    });
  }

  // Debounce resize events
  debounceResize(callback, delay = 250) {
    let timeout;
    return () => {
      clearTimeout(timeout);
      timeout = setTimeout(callback, delay);
    };
  }

  // Optimize event listeners
  optimizeEventListener(element, event, handler, options = {}) {
    const throttled = this.throttle(handler, 16); // ~60fps
    element.addEventListener(event, throttled, { passive: true, ...options });
  }

  // Throttle function
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Memory cleanup
  cleanup() {
    // Clear all intervals and timeouts
    for (let i = 1; i < 99999; i++) {
      clearInterval(i);
      clearTimeout(i);
    }
  }

  // Get FPS
  getFPS() {
    return Math.round(1 / this.deltaTime);
  }
}

const gameOptimizer = new GameOptimizer();
window.gameOptimizer = gameOptimizer;
