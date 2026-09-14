# Minecraft 1.8 WASM-GC Client Extraction Guide

## Overview
This document identifies and explains every file required to run the Minecraft 1.8.8 WASM-GC client independently, without the launcher UI or launcher functionality.

---

## 1. REQUIRED CLIENT FILES

### Location in Source Repo
All client files are in: `mc/1.8.8-wasm/`

### Essential Files & Their Purpose

#### **1.1 index.html** (5.7 KB)
- **Purpose**: Entry point HTML document; initializes the game client
- **Why Required**: 
  - Defines the game container (`id="game_frame"`)
  - Loads `bootstrap.js` which bootstraps the entire client
  - Configures `window.eaglercraftXOpts` with game launch options
  - Sets up relay servers for multiplayer (WebSocket connections)
  - Applies custom skins from localStorage
- **Key Configuration**:
  ```javascript
  window.eaglercraftXOpts = {
    demoMode: false,
    container: "game_frame",        // DOM element ID for rendering
    assetsURI: "assets.epw",        // Asset package file path
    worldsDB: "worlds",              // IndexedDB name for worlds
    servers: [],                     // Custom servers (empty by default)
    relays: [...]                    // Relay server list for multiplayer
  }
  ```
- **Browser Compatibility**: Works on Chrome, Firefox, Safari, Edge (WebGL 2, WebAssembly-GC support required)
- **iPad Support**: Chrome on iPadOS fully supports this; Safari has WebAssembly-GC support in recent versions

#### **1.2 bootstrap.js** (5.3 KB)
- **Purpose**: Loader and bootstrapper; handles asset loading and client initialization
- **Why Required**:
  - Fetches and decodes the `.epw` asset archive
  - Loads the WebAssembly module and JavaScript game code
  - Parses asset metadata from the EPW file
  - Handles game initialization errors gracefully
  - Provides logging/debugging output
- **What It Does**:
  1. Waits for DOM to load
  2. Validates `window.eaglercraftXOpts` configuration
  3. Fetches the EPW file (base64 or direct URL)
  4. Decodes binary EPW format
  5. Extracts: splash image, loader.js, loader.wasm
  6. Creates ObjectURLs and loads WASM module
  7. Calls `main()` to start the game
- **No Modification Needed**: Works as-is

#### **1.3 assets.epw** (11.3 MB)
- **Purpose**: Packed asset archive containing all game resources
- **Why Required**:
  - Contains textures, models, sounds, and all game data
  - Binary format: ZIP-like structure with metadata header
  - EPW format (Eaglercraft Package Wrapper)
  - Header structure:
    - Offset 100: Splash image size (uint32)
    - Offset 104: Loader.js size (uint32)
    - Offset 108: Loader.wasm size (uint32)
- **No Modification Needed**: Use as-is
- **Size**: ~11.3 MB (required for full 1.8.8 experience)

---

## 2. LAUNCHER-ONLY FILES (NOT REQUIRED)

These files are part of the launcher UI and can be safely ignored:

### Launcher Entry Points
- `index.html` (root level) — Main launcher interface
- `js/index.js` (29.8 KB) — Launcher UI logic (game selection, profiles, mods, skins panel)

### Launcher Assets & Styling
- `css/style.css` — Launcher stylesheet
- `css/screensize.css` — Responsive design for launcher
- `assets/json/base.json` — Game list configuration
- `assets/json/modded.json` — Modded versions list
- `assets/json/assisted.json` — Assisted mode configuration
- `assets/json/mods.json` — Mods marketplace
- `assets/json/faqs.json` — Launcher FAQs
- `assets/json/patchnotes.json` — Launcher patch notes
- `assets/images/` — Launcher UI images

### Other Minecraft Versions
- `mc/1.12.2-wasm/` — 1.12.2 WASM-GC client
- `mc/1.12.2/` — 1.12.2 JavaScript client
- `mc/1.8.8/` — 1.8.8 JavaScript client
- `mc/c0.30-wasm/`, `mc/infdev-wasm/` — Other classic versions

---

## 3. FILE DEPENDENCY GRAPH

```
index.html (1.8.8-wasm)
    ↓
bootstrap.js
    ↓
assets.epw
    ├─→ splash.png
    ├─→ loader.js
    └─→ loader.wasm (the actual game engine)
```

**Total Minimal Setup**: 3 files
- `index.html` — Configuration + DOM
- `bootstrap.js` — Loader
- `assets.epw` — Resources + engine

---

## 4. OPTIONAL FILES

### favicon.png (6.5 KB)
- **Purpose**: Browser tab icon
- **Optional**: Can be removed or replaced
- **Location**: `mc/1.8.8-wasm/favicon.png`

### Splash/Startup Screen (in index.html)
- **Optional**: Hardcoded background in HTML, uses `../../assets/images/startup.png`
- **Can Remove**: Edit index.html to remove the startup screen CSS and scripts

---

## 5. CONFIGURATION & CUSTOMIZATION

### Server Relays (Multiplayer)
Located in `index.html` line 73-77, modify to use custom servers:

```javascript
relays: [
  { addr: "wss://relay.deev.is/", comment: "lax1dude relay #1", primary: true },
  { addr: "wss://relay.lax1dude.net/", comment: "lax1dude relay #2", primary: false },
  { addr: "wss://relay.shhnowisnottheti.me/", comment: "ayunami relay #1", primary: false }
]
```

### Demo Mode
- Set `demoMode: true` to run limited 20-minute demo (if supported in assets.epw)

### Custom Servers
- Add to `servers` array:
```javascript
servers: [
  { addr: "ws://your-server:8081/", name: "My Server" }
]
```

### World Storage Database
- Set `worldsDB` to customize IndexedDB name (default: "worlds")

### Asset URI
- Can be relative path: `"assets.epw"` (default)
- Can be full URL: `"https://example.com/assets.epw"`
- Can be data URI: `"data:application/octet-stream;base64,..."`

---

## 6. BROWSER COMPATIBILITY

| Browser | Platform | Supported | Notes |
|---------|----------|-----------|-------|
| Chrome 91+ | Windows/Mac/Linux | ✅ Yes | Full WebAssembly-GC support |
| Chrome 91+ | Android | ✅ Yes | Requires Chrome for Android |
| Chrome 91+ | iPadOS | ✅ Yes | Works well, touch optimized |
| Safari 17.4+ | Mac/iOS | ✅ Partial | WebAssembly-GC support added |
| Firefox 120+ | Windows/Mac/Linux | ✅ Yes | WebAssembly-GC support |
| Edge 91+ | Windows | ✅ Yes | Chromium-based, full support |

### iPadOS Specific Notes
- **Chrome for iPad**: Recommended, full support
- **Safari**: Use latest version (17.4+), may need developer settings
- **Touch Controls**: Configured in launcher, works natively in game
- **Performance**: Depends on iPad generation (M1+ iPad Pro recommended for best performance)

---

## 7. DEPLOYMENT CHECKLIST

To run the 1.8 WASM-GC client independently:

- [ ] Copy `mc/1.8.8-wasm/index.html` to your project
- [ ] Copy `mc/1.8.8-wasm/bootstrap.js` to same directory
- [ ] Copy `mc/1.8.8-wasm/assets.epw` to same directory
- [ ] Optionally copy `mc/1.8.8-wasm/favicon.png` for browser icon
- [ ] Serve via HTTP (NOT file:// — bootstrap requires HTTP)
- [ ] Open index.html in browser
- [ ] Edit index.html if you want to customize relay servers or game options

---

## 8. WHAT NOT TO INCLUDE

❌ Do NOT copy launcher files:
- Root `index.html` (launcher UI)
- `js/index.js` (launcher game selector)
- `css/` directory (launcher styling)
- `assets/json/` (launcher configs)
- `assets/images/` (launcher graphics, except startup.png if desired)

❌ Do NOT include other version directories:
- `mc/1.12.2-wasm/`
- `mc/1.8.8/`
- `mc/c0.30-wasm/`
- etc.

✅ DO include only:
- `mc/1.8.8-wasm/index.html`
- `mc/1.8.8-wasm/bootstrap.js`
- `mc/1.8.8-wasm/assets.epw`
- Optional: `mc/1.8.8-wasm/favicon.png`

---

## 9. TECHNICAL DETAILS: WASM-GC

- **WASM-GC**: WebAssembly with Garbage Collection (GC) support
- **Advantage over JS version**: Better performance, better memory management
- **Engine**: Likely based on Eaglercraft (community Minecraft implementation)
- **Loader**:
  - `loader.js`: JavaScript runtime for WASM interface
  - `loader.wasm`: Actual compiled game engine in WebAssembly

---

## 10. KNOWN LIMITATIONS

1. **Requires HTTP**: Cannot load via `file://` protocol
2. **Memory**: Large WASM module (~5-10 MB uncompressed), may need 1+ GB RAM
3. **Network**: Multiplayer requires WebSocket relay servers
4. **Assets**: Cannot play without assets.epw
5. **Mobile**: Touch support depends on configuration in launcher (not in core client files)

---

## References
- Source Repository: https://github.com/yummyfiles/Minecraft-Launcher
- 1.8 WASM-GC Client Path: `mc/1.8.8-wasm/`
- Eaglercraft Project: Community-driven browser Minecraft
