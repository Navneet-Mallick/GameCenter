/**
 * Canvas Helper
 * Ensures canvas is properly initialized for games
 */

function getGameCanvas(gameName) {
  const canvasId = `${gameName}-canvas`;
  let canvas = document.getElementById(canvasId);
  
  if (!canvas) {
    canvas = document.querySelector('canvas');
  }
  
  if (!canvas) {
    console.error(`Canvas not found for ${gameName}`);
    return null;
  }
  
  // Ensure canvas has proper context
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) {
    console.error('Failed to get 2D context');
    return null;
  }
  
  // Clear canvas
  ctx.fillStyle = '#0a0e27';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  return { canvas, ctx };
}

window.getGameCanvas = getGameCanvas;
