# What We Know About You

A privacy-focused web application that reveals what data your browser automatically shares with every website you visit. This tool demonstrates the data that websites can collect without any explicit permission or user interaction.

## 🔍 What It Shows

This application displays the following information that your browser reveals:

### 📍 Location & Network
- **IP Address** (IPv4/IPv6) with intelligent display logic
- **Geographic location** (country, city, region) with flag emojis
- **Timezone** and current local time
- **Network connection** speed and type (when available)

### 💻 Device & Browser
- **Detailed device identification** (iPhone models, Mac variants, Android devices, etc.)
- **Browser name and version** using User-Agent Client Hints when available
- **Screen resolution** and pixel density
- **Operating system** details

### 🌐 Preferences & Settings
- **Language preferences** with human-readable names
- **Cookie settings** status
- **Ad blocker detection**
- **Battery level** and charging status (when permitted)

### ⏱️ Session Information
- **Time spent on page** with live counter
- **Browser fingerprinting** data points
- **User Agent string** analysis

## 🛡️ Privacy Philosophy

**We don't store your data.** This tool is designed to educate users about browser privacy by showing what information is automatically shared. All data processing happens locally in your browser.

### Key Privacy Features:
- ✅ No data storage or logging
- ✅ No tracking scripts or analytics
- ✅ No advertisements
- ✅ Minimal external API calls (only for IP geolocation)
- ✅ Open source and transparent

## 🚀 Features

- **Real-time updates**: Live clock and session timer
- **Intelligent device detection**: Detailed identification of common devices
- **Accessibility**: Full ARIA labels and keyboard navigation support
- **Responsive design**: Works on all device types and screen sizes
- **Ad-block friendly**: Detects but doesn't interfere with ad blockers

## 🛠️ Technical Details

### Built With
- **Vanilla JavaScript** - No frameworks, fast loading
- **Modern Web APIs** - User-Agent Client Hints, Network Information, Battery Status
- **CSS Grid/Flexbox** - Responsive, accessible design
- **Progressive Enhancement** - Works with JavaScript disabled (basic info)

### Browser Support
- ✅ Chrome 80+ (full feature support)
- ✅ Firefox 70+ (most features)
- ✅ Safari 13+ (core features)
- ✅ Edge 80+ (full feature support)

### External Dependencies
- **IP Geolocation**: Uses `ipapi.co` and `ipwho.is` with fallbacks
- **Flag Emojis**: Local JSON mapping with Unicode fallback

## 🏗️ File Structure

```
whatweknow/
├── index.html          # Main HTML structure with SEO optimization
├── script.js           # Core JavaScript functionality
├── styles.css          # Responsive CSS styling
├── data/
│   └── flags.json      # Country code to emoji mapping
└── README.md           # This file
```

## 🔧 Development

### Local Development
1. Clone the repository
2. Serve the files using any static server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using VS Code Live Server extension
   ```
3. Open `http://localhost:8000` in your browser

### Deployment
This is a static site that can be deployed to:
- **Cloudflare Pages** (current deployment)
- **GitHub Pages**
- **Netlify**
- **Vercel**
- Any static hosting service

## 🤝 Contributing

Contributions are welcome! This project aims to educate users about browser privacy while maintaining the highest privacy standards.

### Areas for Contribution:
- Enhanced device detection patterns
- Additional browser fingerprinting techniques
- Improved accessibility features
- Better mobile experience
- Documentation improvements

### Guidelines:
- No tracking or analytics code
- Minimize external dependencies
- Maintain privacy-first approach
- Test across multiple browsers and devices

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Lewis Dryburgh** - [Website](https://lewisdryburgh.com) | [Twitter](https://twitter.com/lewdryburgh)

## 🔗 Links

- **Live Demo**: [whatweknow.pages.dev](https://whatweknow.pages.dev)
- **Repository**: [github.com/lewdry/whatweknow](https://github.com/lewdry/whatweknow)

## 📝 Changelog

### Latest Updates
- Enhanced IP address display logic (never show duplicate IPv4 addresses)
- Improved device detection for latest iPhone and Android models
- Added User-Agent Client Hints support for more accurate browser detection
- Better Safari version mapping using WebKit build numbers
- Implemented graceful fallbacks for restricted corporate networks
- Added comprehensive ad-blocker detection
- Real-time session timer and live clock updates

---

*This tool demonstrates the importance of browser privacy and the extensive data that websites can collect. Use it to understand what you're sharing and make informed decisions about your online privacy.*