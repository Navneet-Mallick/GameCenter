/**
 * GameCenter - Game Loader
 * Handles game loading and canvas ID mapping
 */

class GameLoader {
  constructor() {
    this.gameMap = {
      runner: { start: 'startRunnerGame', stop: 'stopRunnerGame' },
      flappy: { start: 'startFlappyGame', stop: 'stopFlappyGame' },
      tetris: { start: 'startTetrisGame', stop: 'stopTetrisGame' },
      minesweeper: { start: 'startMinesweeperGame', stop: 'stopMinesweeperGame' },
      snake: { start: 'startSnakeGame', stop: 'stopSnakeGame' },
      breakout: { start: 'startBreakoutGame', stop: 'stopBreakoutGame' },
      space: { start: 'startSpaceGame', stop: 'stopSpaceGame' }
    };
  }

  loadGame(gameName) {
    const game = this.gameMap[gameName];
    if (!game) {
      console.error(`Game not found: ${gameName}`);
      return false;
    }

    try {
      // Create canvas wrapper to handle ID mapping
      const canvas = document.querySelector('canvas');
      if (!canvas) {
        console.error('Canvas not found');
        return false;
      }

      // Map canvas ID to expected ID
      const expectedId = `${gameName}-canvas`;
      if (canvas.id !== expectedId) {
        canvas.id = expectedId;
      }

      // Also create a backup reference
      window.gameCanvas = canvas;

      // Start the game
      if (typeof window[game.start] === 'function') {
        window[game.start]();
        return true;
      } else {
        console.error(`Game start function not found: ${game.start}`);
        return false;
      }
    } catch (error) {
      console.error(`Error loading game ${gameName}:`, error);
      return false;
    }
  }

  stopGame(gameName) {
    const game = this.gameMap[gameName];
    if (!game) return false;

    try {
      if (typeof window[game.stop] === 'function') {
        window[game.stop]();
        return true;
      }
    } catch (error) {
      console.error(`Error stopping game ${gameName}:`, error);
    }
    return false;
  }

  isGameLoaded(gameName) {
    const game = this.gameMap[gameName];
    return game && typeof window[game.start] === 'function';
  }

  getGameFunctions(gameName) {
    return this.gameMap[gameName] || null;
  }
}

const gameLoader = new GameLoader();
window.gameLoader = gameLoader;
