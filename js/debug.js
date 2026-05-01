/**
 * Debug script to check game loading
 */

window.addEventListener('load', () => {
  console.log('%c🎮 ProGames07 Debug', 'color:#00e5ff;font-size:16px;font-weight:bold;');
  
  // Check canvas
  const canvas = document.querySelector('canvas');
  console.log('Canvas found:', !!canvas);
  
  // Check game functions
  console.log('startRunnerGame:', typeof window.startRunnerGame);
  console.log('startFlappyGame:', typeof window.startFlappyGame);
  console.log('startTetrisGame:', typeof window.startTetrisGame);
  console.log('startSnakeGame:', typeof window.startSnakeGame);
  console.log('startBreakoutGame:', typeof window.startBreakoutGame);
  console.log('startSpaceGame:', typeof window.startSpaceGame);
  console.log('startMinesweeperGame:', typeof window.startMinesweeperGame);
  
  // Check managers
  console.log('difficultyManager:', !!window.difficultyManager);
  console.log('pauseSystem:', !!window.pauseSystem);
  console.log('soundEffects:', !!window.soundEffects);
  console.log('settingsManager:', !!window.settingsManager);
  
  // Test game opening
  window.testGame = (gameName) => {
    console.log(`Testing ${gameName}...`);
    openGame(gameName);
  };
  
  console.log('Use testGame("runner") to test a game');
});
