# Minecraft 1.8 WASM-GC Standalone Client - Setup & Deployment Guide

## Quick Start

### What You Need
1. **MC_1.8_STANDALONE_CLIENT.html** — The main client file (included)
2. **bootstrap.js** — Asset loader (from yummyfiles/Minecraft-Launcher)
3. **assets.epw** — Game assets (11.3 MB, from yummyfiles/Minecraft-Launcher)

### Files to Extract from Source
From https://github.com/yummyfiles/Minecraft-Launcher/tree/main/mc/1.8.8-wasm:
```
mc/1.8.8-wasm/
├── bootstrap.js       (5.3 KB) — REQUIRED
├── assets.epw         (11.3 MB) — REQUIRED
└── favicon.png        (optional)
```

---

## Setup Instructions

### Step 1: Create Project Directory
```bash
mkdir minecraft-1.8-client
cd minecraft-1.8-client
```

### Step 2: Copy Files
```bash
# Copy standalone client
cp MC_1.8_STANDALONE_CLIENT.html index.html

# Copy from yummyfiles/Minecraft-Launcher
cp path/to/mc/1.8.8-wasm/bootstrap.js .
cp path/to/mc/1.8.8-wasm/assets.epw .
cp path/to/mc/1.8.8-wasm/favicon.png .  # optional
```

### Step 3: Verify File Structure
```
minecraft-1.8-client/
├── index.html          (Main client)
├── bootstrap.js        (Loader)
├── assets.epw          (Assets - 11.3 MB)
└── favicon.png         (Optional - browser icon)
```

### Step 4: Start HTTP Server
**CRITICAL**: Must use HTTP, cannot use file:// protocol

#### Option A: Python 3
```bash
python -m http.server 8000
```

#### Option B: Python 2
```bash
python -m SimpleHTTPServer 8000
```

#### Option C: Node.js
```bash
npx http-server
```

#### Option D: PHP
```bash
php -S localhost:8000
```

#### Option E: Docker
```bash
docker run -p 8000:80 -v $(pwd):/usr/share/nginx/html nginx:alpine
```

### Step 5: Open in Browser
- **Desktop**: http://localhost:8000
- **Mobile/iPad**: http://<your-computer-ip>:8000 (e.g., http://192.168.1.100:8000)

---

## Configuration

### Customizing Game Options
Edit `index.html`, find the `CONFIG` object, and modify:

#### Change Relay Servers
```javascript
CONFIG.relayServers = [
	{ addr: "wss://your-relay.com/", comment: "Your Relay", primary: true }
];
```

#### Add Custom Servers
```javascript
CONFIG.customServers = [
	{ addr: "ws://localhost:8081/", name: "Local Server" },
	{ addr: "ws://your-server.com:8081/", name: "My Server" }
];
```

#### Enable Demo Mode
```javascript
CONFIG.demoMode: true  // 20-minute limited demo
```

#### Change World Storage Name
```javascript
CONFIG.worldsDB: "my-worlds"  // Default: "worlds"
```

### Join Server via URL
Add `?server=` parameter to join automatically:
```
http://localhost:8000?server=ws://your-server.com:8081/
```

---

## iPad/Mobile Deployment

### Local Network (Same WiFi)
1. Find your computer's IP: 
   - **Windows**: `ipconfig` (look for IPv4)
   - **Mac/Linux**: `ifconfig` (look for inet)
2. Start HTTP server (see Step 4)
3. On iPad, open: `http://<your-ip>:8000`

### Cloud Deployment (Public Internet)

#### Using Ngrok (Easiest)
```bash
# Install: https://ngrok.com/download
ngrok http 8000

# Get public URL like: https://abc123.ngrok.io
# Share: https://abc123.ngrok.io
```

#### Using Netlify (Free Hosting)
1. Install Netlify CLI: `npm install -g netlify-cli`
2. Deploy:
```bash
netlify deploy --prod --dir .
```

#### Using GitHub Pages
1. Push files to GitHub repo
2. Enable GitHub Pages in repo settings
3. Access at: `https://username.github.io/repo-name/`

#### Using AWS S3 + CloudFront
```bash
# Configure AWS credentials first
aws s3 sync . s3://your-bucket/minecraft/
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

---

## Browser Compatibility

### Desktop
- ✅ Chrome 91+ (Recommended)
- ✅ Firefox 120+
- ✅ Edge 91+
- ✅ Safari 17.4+ (macOS)

### Mobile
- ✅ Chrome for Android
- ✅ Chrome for iPad (Recommended)
- ⚠️ Safari iOS 17.4+ (May require developer settings)
- ⚠️ Firefox Mobile (Partial support)

### iPad Specific
- **Recommended**: iPad Pro M1+ or iPad Air 5+
- **Browser**: Chrome for iPad (full WebAssembly-GC support)
- **Alternative**: Safari 17.4+ (native iPad browser, good performance)
- **Touch**: Client auto-detects touch input

---

## Troubleshooting

### Error: "HTTP please, do not open this file locally"
**Solution**: Use HTTP server (see Step 4), don't open file:// directly

### Error: "window.eaglercraftXOpts is not defined"
**Solution**: Ensure index.html loads before bootstrap.js. Script order is: index.html → bootstrap.js → main()

### Error: "Failed to load bootstrap.js"
**Solution**: 
- Check bootstrap.js is in same directory as index.html
- Verify filename is exactly `bootstrap.js` (case-sensitive)
- Check browser console for 404 errors

### Error: "EPW file is invalid"
**Solution**:
- Ensure assets.epw is complete (11.3 MB)
- Re-download from source repo
- Check file isn't corrupted

### Blank Screen (No Canvas)
**Solution**:
1. Open browser DevTools (F12)
2. Check Console for errors
3. Check if startup screen is removing after 30 seconds
4. Try different browser (Chrome recommended)

### No Multiplayer/Cannot Join Servers
**Solution**:
- Check relay server URLs in CONFIG
- Verify browser supports WebSocket
- Check if firewall blocks wss:// (secure WebSocket)
- Try different relay server

### Performance Issues on iPad
**Solution**:
- Use Chrome instead of Safari
- Close other apps
- Restart browser
- Use newer iPad model if possible
- Reduce graphics settings in game

---

## Advanced Configuration

### Custom Asset URI
Instead of local file, serve assets from URL:

```javascript
CONFIG.assetsPath = 'https://example.com/assets.epw'
```

### Data URI (Base64 Embedded)
For offline deployment:
```javascript
// Convert assets.epw to base64
CONFIG.assetsPath = 'data:application/octet-stream;base64,' + base64String
```

### CORS Issues
If loading from different domain, ensure CORS headers:
```javascript
// Server should respond with:
// Access-Control-Allow-Origin: *
// Access-Control-Allow-Methods: GET, HEAD, OPTIONS
```

---

## Performance Optimization

### Reduce Latency
- Use geographically close relay server
- Enable browser caching headers on assets.epw
- Use CDN for assets.epw if possible

### Reduce File Size
- assets.epw is already compressed (11.3 MB)
- Cannot reduce further without losing content

### Better Frame Rate
- Use hardware-accelerated browser (Chrome)
- Close unnecessary browser tabs
- Disable browser extensions
- Use wired internet (if possible)

---

## Security Considerations

### Public Deployments
- Use HTTPS (not HTTP)
- Use legitimate relay servers only
- Monitor server logs for abuse
- Consider rate limiting

### Local Network Only
- HTTP is fine for internal networks
- Firewall should block external access

### Never Include
- User credentials in HTML
- Private server IPs
- Debug information in production

---

## File Manifest

| File | Size | Purpose | Required |
|------|------|---------|----------|
| index.html | ~9 KB | Main client HTML/JS | ✅ Yes |
| bootstrap.js | 5.3 KB | Asset loader | ✅ Yes |
| assets.epw | 11.3 MB | Game resources | ✅ Yes |
| favicon.png | 6.5 KB | Browser icon | ❌ Optional |

**Total Minimum**: 11.3 MB (assets.epw dominates)

---

## URL Parameters

### Query String Format
```
index.html?server=<server_address>
```

### Examples
```
http://localhost:8000?server=ws://my-server.com:8081/
http://localhost:8000?server=wss://relay.deev.is/
```

---

## Multiplayer / Server Connection

### Using Official Relays
Pre-configured in CONFIG:
- `wss://relay.deev.is/` (lax1dude #1)
- `wss://relay.lax1dude.net/` (lax1dude #2)
- `wss://relay.shhnowisnottheti.me/` (ayunami #1)

### Using Custom WebSocket Server
```javascript
CONFIG.customServers = [
	{ addr: "ws://your-server:8081/", name: "My Server" }
]
```

Server must implement Minecraft protocol or relay format.

---

## Deployment Checklist

- [ ] Extract files from yummyfiles/Minecraft-Launcher
- [ ] Copy bootstrap.js, assets.epw to project dir
- [ ] Copy MC_1.8_STANDALONE_CLIENT.html as index.html
- [ ] Start HTTP server
- [ ] Test on desktop (Chrome recommended)
- [ ] Test on mobile/iPad
- [ ] Customize CONFIG if needed
- [ ] Test multiplayer connections
- [ ] Deploy to hosting (if public)
- [ ] Share URL with users

---

## Support & Links

- **Original Launcher**: https://github.com/yummyfiles/Minecraft-Launcher
- **1.8 WASM-GC Client**: https://github.com/yummyfiles/Minecraft-Launcher/tree/main/mc/1.8.8-wasm
- **Relay Servers**: Community-maintained (see CONFIG)
- **Issues**: Check browser console (F12) for errors

---

## License & Attribution

This standalone client wraps the original Minecraft 1.8 WASM-GC implementation from:
- **yummyfiles/Minecraft-Launcher** (Launcher UI)
- **Eaglercraft** (Browser Minecraft implementation)

Use at your own discretion. Mojang Studios owns Minecraft.

---

## Version Info

- **Client Version**: 1.8.8 WASM-GC
- **Bootstrap**: From yummyfiles/Minecraft-Launcher
- **Standalone Wrapper**: MC_1.8_STANDALONE_CLIENT.html
- **Last Updated**: 2026
