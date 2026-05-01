/**
 * ProGames07 - Performance Optimizer
 * Optimizes game loading and rendering performance
 */

class PerformanceOptimizer {
  constructor() {
    this.loadingTimes = {};
    this.gameCache = {};
  }

  // Preload critical game files
  preloadGameAssets(gameName) {
    const gameScript = `js/games/${gameName}.js`;
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = gameScript;
    document.head.appendChild(link);
  }

  // Lazy load game scripts
  lazyLoadGame(gameName) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `js/games/${gameName}.js`;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load ${gameName}`));
      document.head.appendChild(script);
    });
  }

  // Optimize canvas rendering
  optimizeCanvas(canvas) {
    // Use requestAnimationFrame for smooth rendering
    canvas.style.imageRendering = 'crisp-edges';
    canvas.style.imageRendering = '-webkit-optimize-contrast';
    
    // Enable hardware acceleration
    const ctx = canvas.getContext('2d', { alpha: false });
    return ctx;
  }

  // Debounce function calls
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Throttle function calls
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

  // Measure performance
  measurePerformance(label, fn) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    const duration = end - start;
    
    this.loadingTimes[label] = duration;
    console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
    
    return result;
  }

  // Optimize event listeners
  optimizeEventListeners() {
    // Use event delegation
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('game-card')) {
        const gameName = e.target.dataset.game;
        if (gameName) {
          this.preloadGameAssets(gameName);
        }
      }
    });
  }

  // Cache game instances
  cacheGame(gameName, instance) {
    this.gameCache[gameName] = instance;
  }

  getGameFromCache(gameName) {
    return this.gameCache[gameName];
  }

  clearGameCache(gameName) {
    delete this.gameCache[gameName];
  }

  // Reduce DOM reflows
  batchDOMUpdates(updates) {
    const fragment = document.createDocumentFragment();
    updates.forEach(update => {
      const el = document.createElement('div');
      el.innerHTML = update;
      fragment.appendChild(el);
    });
    return fragment;
  }

  // Optimize animations
  reduceAnimations() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.body.style.animation = 'none';
      document.body.style.transition = 'none';
    }
  }

  // Memory cleanup
  cleanupGame() {
    // Remove event listeners
    document.removeEventListener('keydown', null);
    document.removeEventListener('keyup', null);
    document.removeEventListener('mousemove', null);
    document.removeEventListener('touchstart', null);
    document.removeEventListener('touchmove', null);
    document.removeEventListener('touchend', null);
    
    // Clear intervals and timeouts
    for (let i = 1; i < 99999; i++) {
      clearInterval(i);
      clearTimeout(i);
    }
  }

  // Get performance report
  getPerformanceReport() {
    console.log('%c📊 Performance Report', 'color:#00e5ff;font-size:16px;font-weight:bold;');
    console.table(this.loadingTimes);
    
    const totalTime = Object.values(this.loadingTimes).reduce((a, b) => a + b, 0);
    console.log(`Total Load Time: ${totalTime.toFixed(2)}ms`);
  }

  // Optimize image loading
  lazyLoadImages() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
    }
  }

  // Optimize CSS
  minifyCSS() {
    const styles = document.querySelectorAll('style');
    styles.forEach(style => {
      style.textContent = style.textContent
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\s+/g, ' ')
        .trim();
    });
  }

  // Request idle callback for non-critical tasks
  scheduleIdleTask(callback) {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(callback);
    } else {
      setTimeout(callback, 0);
    }
  }

  // Preload next game
  preloadNextGame(currentGame) {
    const games = ['runner', 'flappy', 'tetris', 'minesweeper', 'snake', 'breakout', 'space'];
    const currentIndex = games.indexOf(currentGame);
    const nextGame = games[(currentIndex + 1) % games.length];
    
    this.scheduleIdleTask(() => {
      this.preloadGameAssets(nextGame);
    });
  }

  // Optimize localStorage access
  getCachedSetting(key, defaultValue) {
    if (!this.settingsCache) {
      this.settingsCache = {};
    }
    
    if (!(key in this.settingsCache)) {
      this.settingsCache[key] = localStorage.getItem(key) || defaultValue;
    }
    
    return this.settingsCache[key];
  }

  // Enable service worker for offline support
  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(() => {
        // Service worker registration failed, continue without it
      });
    }
  }
}

const performanceOptimizer = new PerformanceOptimizer();
window.performanceOptimizer = performanceOptimizer;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  performanceOptimizer.optimizeEventListeners();
  performanceOptimizer.reduceAnimations();
  performanceOptimizer.lazyLoadImages();
  
  // Preload all games on idle
  performanceOptimizer.scheduleIdleTask(() => {
    ['runner', 'flappy', 'tetris', 'minesweeper', 'snake', 'breakout', 'space'].forEach(game => {
      performanceOptimizer.preloadGameAssets(game);
    });
  });
});
