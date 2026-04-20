# 🎮 GameCenter - Progressive Web App

A collection of 7 classic arcade games reimagined for modern browsers. Play online or install as a PWA for offline gaming!

![GameCenter](https://img.shields.io/badge/PWA-Ready-00e5ff?style=for-the-badge)
![Games](https://img.shields.io/badge/Games-7-7c3aed?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)

## 🎯 Features

- 🎮 **7 Classic Games** - Runner, Flappy Bird, Tetris, Snake, Breakout, Space Invaders, Minesweeper
- 📱 **PWA Installable** - Add to home screen on any device
- 🌐 **Offline Support** - Play without internet connection
- 🎨 **Modern UI** - Sleek cyberpunk-inspired design
- 🏆 **Achievements** - Unlock badges and track progress
- 📊 **Leaderboards** - Track high scores for each game
- ⚙️ **Difficulty Levels** - Easy, Normal, Hard, Expert
- 🎵 **Sound Effects** - Immersive audio feedback
- ⏸️ **Pause System** - Pause any game anytime
- 📱 **Mobile Optimized** - Touch controls and responsive design
- 🚀 **Fast Performance** - Optimized for 60fps gameplay
- 💾 **Local Storage** - All progress saved locally

## 🎮 Games Included

### 🏃 Runner
Jump and dodge obstacles in this endless runner. Double jump enabled!

### 🐦 Flappy Bird
Tap to flap through pipes. Classic addictive gameplay.

### 🧩 Tetris
Stack blocks and clear lines. Includes hold piece and ghost piece.

### 🐍 Snake
Eat food, grow longer, don't hit yourself or walls.

### 🎯 Breakout
Break all bricks with your paddle and ball. Power-ups included!

### 👾 Space Invaders
Defend Earth from alien invasion. Multiple levels with increasing difficulty.

### 💣 Minesweeper
Find all mines without triggering them. Classic puzzle game.

## 🚀 Quick Start

### Play Online
1. Visit the hosted site (add your URL here)
2. Click on any game to start playing
3. No installation required!

### Install as PWA

#### Desktop (Chrome, Edge, Brave)
1. Visit the website
2. Click the install button (⊕) in the address bar
3. Or click the "Install App" button that appears
4. Launch from your applications

#### Android
1. Open in Chrome
2. Tap menu (⋮) → "Add to Home screen"
3. Or tap the "Install App" button
4. Launch from home screen

#### iOS (Safari)
1. Open in Safari
2. Tap Share button (□↑)
3. Tap "Add to Home Screen"
4. Launch from home screen

## 🛠️ Setup for Development

### Prerequisites
- A modern web browser
- A local web server (optional for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/gamecenter.git
   cd gamecenter
   ```

2. **Generate PWA Icons**
   - Open `generate-icons.html` in your browser
   - Click "Generate All Icons"
   - Click "Download All Icons"
   - Move all PNG files to the `/icons/` folder

3. **Run locally**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

4. **Open in browser**
   ```
   http://localhost:8000
   ```

## 📁 Project Structure

```
gamecenter/
├── index.html              # Main HTML file
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker
├── generate-icons.html     # Icon generator tool
├── css/
│   ├── style.css          # Main styles
│   ├── games.css          # Game-specific styles
│   └── mobile.css         # Mobile responsive styles
├── js/
│   ├── main.js            # Main app logic
│   ├── game-manager.js    # Game loading and lifecycle
│   ├── game-loader.js     # Game initialization
│   ├── achievements.js    # Achievement system
│   ├── stats.js           # Statistics tracking
│   ├── difficulty.js      # Difficulty management
│   ├── settings.js        # Settings panel
│   ├── pause-system.js    # Pause functionality
│   ├── sound-effects.js   # Audio system
│   └── games/
│       ├── runner.js      # Runner game
│       ├── flappy.js      # Flappy Bird game
│       ├── tetris.js      # Tetris game
│       ├── snake.js       # Snake game
│       ├── breakout.js    # Breakout game
│       ├── space.js       # Space Invaders game
│       └── minesweeper.js # Minesweeper game
└── icons/                 # PWA icons (generate these)
```

## 🎨 Customization

### Change Theme Colors
Edit `css/style.css`:
```css
:root {
  --accent-primary: #00e5ff;    /* Main accent color */
  --accent-secondary: #7c3aed;  /* Secondary accent */
  --bg-primary: #0a0e27;        /* Background color */
}
```

### Add New Games
1. Create game file in `js/games/yourgame.js`
2. Add game configuration in `js/game-manager.js`:
   ```javascript
   yourgame: {
     title: '🎯 Your Game',
     start: 'startYourGame',
     stop: 'stopYourGame',
     canvasId: 'yourgame-canvas',
     width: 600,
     height: 600
   }
   ```
3. Add game card in `index.html`
4. Update service worker cache in `sw.js`

## 🚀 Deployment

### GitHub Pages
1. Push to GitHub
2. Settings → Pages → Source: main branch
3. Your site will be at `https://username.github.io/repo-name`

### Netlify
1. Drag and drop folder to [Netlify](https://netlify.com)
2. Or connect GitHub repository
3. Deploy automatically

### Vercel
```bash
npm i -g vercel
vercel
```

### Important Notes
- **HTTPS Required**: PWAs require HTTPS (localhost is OK for testing)
- **Service Worker**: Must be served from root domain
- **Icons**: Generate all required icon sizes

## 🧪 Testing

### Test PWA Features
1. Open Chrome DevTools (F12)
2. Go to "Application" tab
3. Check:
   - Manifest is loaded
   - Service Worker is active
   - Cache Storage has files

### Run Lighthouse Audit
1. Open DevTools (F12)
2. Go to "Lighthouse" tab
3. Select "Progressive Web App"
4. Generate report (aim for 100%)

## 🎮 Controls

### Keyboard
- **Runner**: Space to jump
- **Flappy**: Space to flap
- **Tetris**: Arrow keys to move, Up to rotate, Space to drop, C to hold
- **Snake**: Arrow keys or WASD
- **Breakout**: Arrow keys or mouse
- **Space Invaders**: Arrow keys to move, Space to shoot
- **Minesweeper**: Click to reveal, Right-click to flag

### Touch (Mobile)
- Tap/swipe controls for all games
- Optimized for mobile gameplay

## 📊 Browser Support

| Browser | Desktop | Mobile | PWA Install |
|---------|---------|--------|-------------|
| Chrome  | ✅      | ✅     | ✅          |
| Edge    | ✅      | ✅     | ✅          |
| Safari  | ✅      | ✅     | ✅*         |
| Firefox | ✅      | ✅     | ⚠️          |
| Opera   | ✅      | ✅     | ✅          |

*Safari uses "Add to Home Screen" instead of install prompt

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Navneet Mallick**
- GitHub: [@Navneet-Mallick](https://github.com/Navneet-Mallick)
- LinkedIn: [navneet-mallick](https://linkedin.com/in/navneet-mallick-313829279)

## 🙏 Acknowledgments

- Inspired by classic arcade games
- Built with vanilla JavaScript (no frameworks!)
- Icons generated with HTML5 Canvas
- Fonts: Orbitron & Poppins from Google Fonts

## 📱 Screenshots

Add your screenshots here after deployment!

## 🔮 Future Features

- [ ] Online multiplayer
- [ ] Global leaderboards
- [ ] More games
- [ ] Custom themes
- [ ] Game replays
- [ ] Social sharing
- [ ] Tournament mode

## 🐛 Known Issues

None currently! Report issues on GitHub.

## 💡 Tips

- **Best Performance**: Install as PWA for best performance
- **Offline Play**: All games work offline after first visit
- **High Scores**: Stored locally in your browser
- **Achievements**: Track progress across all games
- **Difficulty**: Try Expert mode for a real challenge!

---

Made with ❤️ and lots of ☕ by Navneet Mallick

⭐ Star this repo if you enjoyed the games!
