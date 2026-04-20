/**
 * Statistics Tracking
 */

function updateTotalPlays() {
  const games = ['runner', 'flappy', 'tetris', 'minesweeper', 'snake', 'breakout', 'space'];
  let total = 0;
  
  games.forEach(game => {
    const stats = JSON.parse(localStorage.getItem(`gc_${game}_stats`) || '{}');
    total += stats.plays || 0;
  });
  
  const el = document.getElementById('total-plays');
  if (el) {
    animateNumber(el, 0, total, 1000);
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
