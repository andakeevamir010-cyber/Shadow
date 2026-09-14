# Minecraft 1.8 WASM-GC Standalone Client

A minimal, launcher-free implementation of Minecraft 1.8 WASM-GC that runs directly in modern web browsers—desktop, mobile, and iPad.

## Overview

This project extracts and wraps the Minecraft 1.8.8 WASM-GC client from [yummyfiles/Minecraft-Launcher](https://github.com/yummyfiles/Minecraft-Launcher), removing all launcher UI and launcher-specific code while preserving the full 1.8 gameplay experience.

**What You Get:**
- ✅ Minecraft 1.8.8 in your browser
- ✅ Works on Chrome, Firefox, Safari, Edge
- ✅ Full mobile/iPad support
- ✅ Multiplayer via relay servers
- ✅ WebAssembly-GC acceleration (fast performance)
- ✅ No launcher bloat—just the game

## Files in This Repository

| File | Purpose |
|------|---------|
| **MC_1.8_STANDALONE_CLIENT.html** | Minimal HTML/JS client (main entry point) |
| **MC_1.8_WASM_GC_ANALYSIS.md** | Detailed breakdown of all 1.8 files & architecture |
| **SETUP_AND_DEPLOYMENT.md** | Complete setup guide, deployment options, troubleshooting |
| **README.md** | This file |

## Quick Start (5 Minutes)

### 1. Get the Required Files

From [yummyfiles/Minecraft-Launcher](https://github.com/yummyfiles/Minecraft-Launcher), download:
- `mc/1.8.8-wasm/bootstrap.js` (5.3 KB)
- `mc/1.8.8-wasm/assets.epw` (11.3 MB)

### 2. Create Project Directory
```bash
mkdir minecraft-client
cd minecraft-client
```

### 3. Copy Files
```bash
# Copy standalone client
cp MC_1.8_STANDALONE_CLIENT.html index.html

# Copy from yummyfiles/Minecraft-Launcher
cp path/to/bootstrap.js .
cp path/to/assets.epw .
```

### 4. Start HTTP Server
```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server
```

### 5. Open Browser
```
http://localhost:8000
```

**That's it!** Game should load in 5-10 seconds.

## Architecture

### Three Essential Files

```
index.html (Standalone Client)
    ↓
bootstrap.js (Loader from yummyfiles)
    ↓
assets.epw (11.3 MB game resources)
    ↓
loader.wasm (Actual game engine - inside assets.epw)
```

### What Each File Does

**index.html**
- Defines DOM container for the game
- Loads bootstrap.js
- Configures game options (servers, relays, settings)
- Handles startup/error screens
- ~9 KB total

**bootstrap.js**
- Fetches and decodes EPW asset archive
- Extracts WASM module and JS game code
- Initializes WebAssembly runtime
- Hands off to loader.wasm
- ~5.3 KB total

**assets.epw**
- Binary archive of all game resources
- Contains textures, models, sounds, splash screen
- Includes loader.wasm (the actual game engine)
- ~11.3 MB (compressed)

## What's NOT Included

This client removes all launcher-specific code:
- ❌ Launcher UI (game selector)
- ❌ Game version list
- ❌ Mod marketplace
- ❌ Settings panel
- ❌ Launcher styling (CSS)
- ❌ Launcher assets (images)

**Result:** Pure game, zero bloat.

## Configuration

Edit the `CONFIG` object in `index.html`:

### Example: Change Relay Servers
```javascript
CONFIG.relayServers = [
  { addr: "wss://relay.deev.is/", comment: "Main Relay", primary: true }
];
```

### Example: Add Custom Server
```javascript
CONFIG.customServers = [
  { addr: "ws://my-server.com:8081/", name: "My Server" }
];
```

### Example: Join Server via URL
```
http://localhost:8000?server=ws://my-server.com:8081/
```

See **SETUP_AND_DEPLOYMENT.md** for full configuration options.

## Browser Support

### Recommended
- Chrome 91+ (Desktop & Mobile)
- Chrome for iPad

### Supported
- Firefox 120+
- Edge 91+
- Safari 17.4+ (iOS/macOS)

### Requirements
- WebAssembly-GC support (most modern browsers have this)
- WebGL 2
- WebSocket (for multiplayer)
- LocalStorage (for worlds/settings)

## iPad / Mobile

### Local Network (Recommended for Testing)
1. Start HTTP server on your computer
2. Find your IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
3. On iPad: `http://<your-ip>:8000`

### Public Deployment
Use Ngrok for quick testing:
```bash
ngrok http 8000
# Share the URL provided
```

For permanent hosting, see **SETUP_AND_DEPLOYMENT.md** for:
- GitHub Pages deployment
- Netlify hosting
- AWS S3 + CloudFront
- Docker containerization

## Performance

- **Load Time**: 5-10 seconds (depends on assets.epw download)
- **Frame Rate**: 60 FPS on modern hardware
- **Memory**: ~1-2 GB (depending on world size)
- **iPad**: Smooth on iPad Pro M1+, playable on iPad Air 5+

## Multiplayer

The client includes three official relay servers for multiplayer:
- `wss://relay.deev.is/`
- `wss://relay.lax1dude.net/`
- `wss://relay.shhnowisnottheti.me/`

You can add custom servers in `CONFIG.customServers`.

## Troubleshooting

### Blank Screen
- Check browser console (F12) for errors
- Ensure assets.epw is complete (11.3 MB)
- Try different browser (Chrome recommended)

### "HTTP please" Error
- Don't use file:// protocol
- Use HTTP server (see Quick Start)

### No Multiplayer
- Check relay server URLs are correct
- Verify firewall doesn't block WebSocket (wss://)
- Try different relay server

### Performance Issues on iPad
- Use Chrome instead of Safari
- Use newer iPad model if possible
- Close other apps/browser tabs

See **SETUP_AND_DEPLOYMENT.md** for complete troubleshooting guide.

## Source Attribution

This standalone client uses:
- **Minecraft 1.8 WASM-GC** from [yummyfiles/Minecraft-Launcher](https://github.com/yummyfiles/Minecraft-Launcher)
- **Eaglercraft** (browser Minecraft implementation)
- **Original Minecraft** (Mojang Studios)

## Key Features Preserved

✅ Full 1.8.8 Gameplay
- Block placing/breaking
- Crafting system
- Inventory management
- Mob spawning
- Multiplayer

✅ Survival & Creative Modes
✅ Custom skins (from launcher)
✅ World saving (IndexedDB)
✅ Multiplayer servers
✅ Touch controls (mobile/iPad)

## File Sizes

| File | Size | Notes |
|------|------|-------|
| index.html | ~9 KB | Minified, includes all JS |
| bootstrap.js | 5.3 KB | From yummyfiles |
| assets.epw | 11.3 MB | Game resources (compressed) |
| **Total** | **~11.3 MB** | Dominated by assets |

## Technical Stack

- **Language**: HTML5 + JavaScript (ES6+)
- **Runtime**: WebAssembly with Garbage Collection (WASM-GC)
- **Graphics**: WebGL 2
- **Storage**: IndexedDB (for worlds/progress)
- **Networking**: WebSocket (for multiplayer)

## Known Limitations

1. **HTTP Required**: Cannot run via file:// protocol
2. **Memory**: Large WASM module requires 1+ GB RAM
3. **Network**: Multiplayer requires relay server (single-player works offline)
4. **Assets**: Entire 11.3 MB must download before playing
5. **Licensing**: Use at your own risk (Mojang Studios owns Minecraft)

## Customization

Want to customize further? See **MC_1.8_WASM_GC_ANALYSIS.md** for:
- Detailed file-by-file breakdown
- Architecture explanation
- Configuration options
- Browser compatibility notes

## Deployment Options

Quick options:
- **Local**: `python -m http.server 8000`
- **Testing**: `ngrok http 8000`
- **GitHub Pages**: Push to repo, enable Pages
- **Netlify**: `netlify deploy --prod --dir .`
- **Docker**: Docker image provided below
- **AWS S3**: `aws s3 sync . s3://bucket/`

See **SETUP_AND_DEPLOYMENT.md** for detailed instructions.

## Docker Deployment

```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80
```

```bash
docker build -t minecraft-1.8 .
docker run -p 8000:80 minecraft-1.8
```

## License

This wrapper is provided as-is. Minecraft is owned by Mojang Studios / Microsoft. Use at your own discretion.

## Support

- **Issues**: Check browser console (F12)
- **Setup Help**: See SETUP_AND_DEPLOYMENT.md
- **Technical Questions**: See MC_1.8_WASM_GC_ANALYSIS.md
- **Original Source**: https://github.com/yummyfiles/Minecraft-Launcher

---

**Ready to play?** Start with **Quick Start** above, then refer to **SETUP_AND_DEPLOYMENT.md** for deployment options.
