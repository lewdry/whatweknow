function getDetailedDevice() {
    const ua = navigator.userAgent;
    const platform = navigator.platform;
    
    // iPhone models
    if (ua.includes('iPhone')) {
        if (screen.height === 932 || screen.width === 932) return 'iPhone 16 Pro Max, 15 Pro Max, or 14 Pro Max';
        if (screen.height === 852 || screen.width === 852) return 'iPhone 16 Plus, 15 Plus, 14 Plus, or similar';
        if (screen.height === 844 || screen.width === 844) return 'iPhone 16, 15, 14, 13, 12, or similar';
        if (screen.height === 896 || screen.width === 896) return 'iPhone 11 Pro Max, XS Max, 11, or XR';
        if (screen.height === 812 || screen.width === 812) return 'iPhone 13 mini, 12 mini, 11 Pro, XS, or X';
        if (screen.height === 736 || screen.width === 736) return 'iPhone 8 Plus, 7 Plus, or 6s Plus';
        if (screen.height === 667 || screen.width === 667) return 'iPhone SE (2nd/3rd gen), 8, 7, or 6s';
        return 'iPhone';
    }
    
    // iPad models
    if (ua.includes('iPad') || (platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
        const ratio = screen.width / screen.height;
        if (screen.width >= 1024) {
            if (ratio > 1.3) return 'iPad Pro 12.9-inch';
            return 'iPad Pro 11-inch or iPad Air';
        }
        return 'iPad';
    }
    
    // Mac models
    if (platform.includes('Mac') && !ua.includes('iPhone') && !ua.includes('iPad')) {
        // Use User-Agent hints where available to provide a generic Mac model
        if (ua.includes('Macintosh')) {
            let model = 'Mac';

            // Provide simple UA-based fallbacks instead of relying on hardware APIs
            if (ua.includes('MacBook')) {
                model = 'MacBook';
            } else if (/Mac ?mini/i.test(ua)) {
                model = 'Mac mini';
            } else if (/Mac ?Studio/i.test(ua)) {
                model = 'Mac Studio';
            } else if (/Mac ?Pro/i.test(ua)) {
                model = 'Mac Pro';
            }

            return model;
        }
        return 'Mac';
    }
    
    // Android devices
    if (ua.includes('Android')) {
        // Samsung
        if (ua.includes('SM-S928') || ua.includes('SM-S926')) return 'Samsung Galaxy S24 Ultra or S23 Ultra';
        if (ua.includes('SM-S921') || ua.includes('SM-S918')) return 'Samsung Galaxy S24 or S23';
        if (ua.includes('SM-F946') || ua.includes('SM-F936')) return 'Samsung Galaxy Z Fold 5 or 4';
        if (ua.includes('SM-F731') || ua.includes('SM-F721')) return 'Samsung Galaxy Z Flip 5 or 4';
        if (ua.includes('Samsung')) return 'Samsung Android device';
        
        // Google Pixel
        if (ua.includes('Pixel 9')) return 'Google Pixel 9';
        if (ua.includes('Pixel 8')) return 'Google Pixel 8';
        if (ua.includes('Pixel 7')) return 'Google Pixel 7';
        if (ua.includes('Pixel')) return 'Google Pixel';
        
        // Generic Android
        const width = screen.width;
        if (width >= 1200) return 'Android tablet';
        if (width >= 600) return 'large Android phone or small tablet';
        return 'Android phone';
    }
    
    // Windows devices
    if (ua.includes('Windows NT')) {
        const version = ua.match(/Windows NT (\d+\.\d+)/);
        if (version) {
            const v = parseFloat(version[1]);
            if (v >= 10.0) return 'Windows 11 or 10 PC';
            if (v >= 6.3) return 'Windows 8.1 PC';
            if (v >= 6.1) return 'Windows 7 PC';
        }
        return 'Windows PC';
    }
    
    // Linux
    if (ua.includes('Linux') && !ua.includes('Android')) {
        if (ua.includes('Ubuntu')) return 'Ubuntu Linux machine';
        if (ua.includes('Fedora')) return 'Fedora Linux machine';
        return 'Linux machine';
    }
    
    return 'device';
}

function getDeviceType() {
    const ua = navigator.userAgent.toLowerCase();
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return 'tablet';
    }
    if (/mobile|iphone|ipod|blackberry|opera mini|iemobile/i.test(ua)) {
        return 'phone';
    }
    return 'computer';
}

function getBrowser() {
    const ua = navigator.userAgent;
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Edg')) return 'Edge';
    if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome';
    if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
    if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
    return 'your browser';
}

// Provide richer browser name/version info.
// Uses User-Agent Client Hints where available, falling back to parsing navigator.userAgent.
async function getBrowserDetails() {
    const ua = navigator.userAgent || '';

    // Use UA-CH when available for more accurate brand/version info (Chrome, Edge, etc.)
    if (navigator.userAgentData && navigator.userAgentData.getHighEntropyValues) {
        try {
            const high = await navigator.userAgentData.getHighEntropyValues(['brands', 'fullVersionList']);
            const list = high.fullVersionList && high.fullVersionList.length ? high.fullVersionList : (high.brands || []);

            // Prefer a known browser brand if present, otherwise take the first entry
            let picked = null;
            for (const entry of list) {
                const brand = entry.brand || entry;
                const version = entry.version || '';
                const lb = (brand + '').toLowerCase();
                if (lb.includes('chrome') || lb.includes('safari') || lb.includes('edge') || lb.includes('firefox') || lb.includes('opera')) {
                    picked = { brand, version };
                    break;
                }
            }
            if (!picked && list.length) {
                const e = list[0];
                picked = { brand: e.brand || e, version: e.version || '' };
            }
            if (picked) {
                return `${picked.brand}${picked.version ? ' ' + picked.version : ''} (via UA-CH)`;
            }
        } catch (e) {
            // Fall through to UA parsing
        }
    }

    // Fallback: parse navigator.userAgent
    // Look for common tokens: Firefox/xx, Edg/xx, Chrome/xx, CriOS/xx (Chrome on iOS), Version/x (Safari)
    const match = ua.match(/(Firefox|Edg|Chrome|CriOS|Safari|OPR|Opera)\/? ?([0-9._]+)/i);
    if (match) {
        let name = match[1];
        let version = match[2];
        if (name === 'CriOS') name = 'Chrome';
        if (name === 'Edg') name = 'Edge';
        if (name === 'OPR') name = 'Opera';

        // Safari on some platforms exposes a WebKit build identifier (e.g. Safari/605.1.15)
        // which is not the human-facing Safari major version. Map known WebKit build
        // prefixes to a Safari major version for a friendlier display. Treat this as
        // a best-effort mapping — add more entries here if you see other build IDs.
        if (name === 'Safari') {
            // Prefer an explicit "Version/X" token in the UA when present —
            // this typically contains the human-facing Safari version (e.g. "Version/26.0").
            // Only when that's missing do we fall back to the WebKit build -> Safari mapping.
            const explicitVersionMatch = ua.match(/Version\/([0-9._]+)/);
            if (explicitVersionMatch) {
                return `Safari ${explicitVersionMatch[1]}`;
            }

            const buildPrefix = (version || '').split('.')[0];
            const webkitToSafari = {
                '605': '26'
                // add other mappings here if needed, e.g. '604': '14'
            };
            if (webkitToSafari[buildPrefix]) {
                return `Safari ${webkitToSafari[buildPrefix]}`;
            }
        }

        return `${name} ${version}`;
    }

    // Safari sometimes uses Version/X.Y
    const safariMatch = ua.match(/Version\/([0-9._]+).*Safari/);
    if (safariMatch) return `Safari ${safariMatch[1]}`;

    // As a last resort, return the raw UA (trimmed)
    return ua ? (ua.length > 120 ? ua.slice(0, 117) + '...' : ua) : 'Unknown browser';
}

function getTimeOfDay() {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    if (hour < 21) return 'evening';
    return 'night';
}

function getHumanReadableLanguage(code) {
    const languages = {
        'en': 'English',
        'en-US': 'English (United States)',
        'en-GB': 'English (United Kingdom)',
        'en-AU': 'English (Australia)',
        'en-CA': 'English (Canada)',
        'en-NZ': 'English (New Zealand)',
        'en-IE': 'English (Ireland)',
        'en-ZA': 'English (South Africa)',
        'es': 'Spanish',
        'es-ES': 'Spanish (Spain)',
        'es-MX': 'Spanish (Mexico)',
        'es-AR': 'Spanish (Argentina)',
        'fr': 'French',
        'fr-FR': 'French (France)',
        'fr-CA': 'French (Canada)',
        'de': 'German',
        'de-DE': 'German (Germany)',
        'de-AT': 'German (Austria)',
        'de-CH': 'German (Switzerland)',
        'it': 'Italian',
        'it-IT': 'Italian (Italy)',
        'pt': 'Portuguese',
        'pt-BR': 'Portuguese (Brazil)',
        'pt-PT': 'Portuguese (Portugal)',
        'zh': 'Chinese',
        'zh-CN': 'Chinese (Simplified)',
        'zh-TW': 'Chinese (Traditional)',
        'zh-HK': 'Chinese (Hong Kong)',
        'ja': 'Japanese',
        'ja-JP': 'Japanese (Japan)',
        'ko': 'Korean',
        'ko-KR': 'Korean (South Korea)',
        'ru': 'Russian',
        'ru-RU': 'Russian (Russia)',
        'ar': 'Arabic',
        'ar-SA': 'Arabic (Saudi Arabia)',
        'ar-EG': 'Arabic (Egypt)',
        'hi': 'Hindi',
        'hi-IN': 'Hindi (India)',
        'nl': 'Dutch',
        'nl-NL': 'Dutch (Netherlands)',
        'nl-BE': 'Dutch (Belgium)',
        'pl': 'Polish',
        'pl-PL': 'Polish (Poland)',
        'tr': 'Turkish',
        'tr-TR': 'Turkish (Turkey)',
        'sv': 'Swedish',
        'sv-SE': 'Swedish (Sweden)',
        'da': 'Danish',
        'da-DK': 'Danish (Denmark)',
        'no': 'Norwegian',
        'nb': 'Norwegian (Bokmål)',
        'nn': 'Norwegian (Nynorsk)',
        'fi': 'Finnish',
        'fi-FI': 'Finnish (Finland)',
        'el': 'Greek',
        'el-GR': 'Greek (Greece)',
        'cs': 'Czech',
        'cs-CZ': 'Czech (Czech Republic)',
        'hu': 'Hungarian',
        'hu-HU': 'Hungarian (Hungary)',
        'ro': 'Romanian',
        'ro-RO': 'Romanian (Romania)',
        'th': 'Thai',
        'th-TH': 'Thai (Thailand)',
        'vi': 'Vietnamese',
        'vi-VN': 'Vietnamese (Vietnam)',
        'id': 'Indonesian',
        'id-ID': 'Indonesian (Indonesia)',
        'ms': 'Malay',
        'ms-MY': 'Malay (Malaysia)',
        'uk': 'Ukrainian',
        'uk-UA': 'Ukrainian (Ukraine)',
        'he': 'Hebrew',
        'he-IL': 'Hebrew (Israel)',
        'bg': 'Bulgarian',
        'bg-BG': 'Bulgarian (Bulgaria)',
        'hr': 'Croatian',
        'hr-HR': 'Croatian (Croatia)',
        'sk': 'Slovak',
        'sk-SK': 'Slovak (Slovakia)',
        'sl': 'Slovenian',
        'sl-SI': 'Slovenian (Slovenia)',
        'sr': 'Serbian',
        'sr-RS': 'Serbian (Serbia)',
        'ca': 'Catalan',
        'ca-ES': 'Catalan (Spain)',
        'et': 'Estonian',
        'et-EE': 'Estonian (Estonia)',
        'lv': 'Latvian',
        'lv-LV': 'Latvian (Latvia)',
        'lt': 'Lithuanian',
        'lt-LT': 'Lithuanian (Lithuania)',
        'is': 'Icelandic',
        'is-IS': 'Icelandic (Iceland)',
        'af': 'Afrikaans',
        'af-ZA': 'Afrikaans (South Africa)',
        'sq': 'Albanian',
        'sq-AL': 'Albanian (Albania)',
        'bn': 'Bengali',
        'bn-BD': 'Bengali (Bangladesh)',
        'bn-IN': 'Bengali (India)',
        'bs': 'Bosnian',
        'bs-BA': 'Bosnian (Bosnia and Herzegovina)',
        'gu': 'Gujarati',
        'gu-IN': 'Gujarati (India)',
        'kn': 'Kannada',
        'kn-IN': 'Kannada (India)',
        'mr': 'Marathi',
        'mr-IN': 'Marathi (India)',
        'ta': 'Tamil',
        'ta-IN': 'Tamil (India)',
        'te': 'Telugu',
        'te-IN': 'Telugu (India)',
        'ur': 'Urdu',
        'ur-PK': 'Urdu (Pakistan)',
        'fa': 'Persian',
        'fa-IR': 'Persian (Iran)',
        'sw': 'Swahili',
        'sw-KE': 'Swahili (Kenya)',
    };
    
    return languages[code] || code;
}

async function getLocationFromIP() {
    // Try a couple of public IP geolocation endpoints with graceful fallback.
    // This increases reliability when one provider blocks or rate-limits requests.
    async function tryIpApi(url, mapper) {
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error('HTTP ' + res.status);
            const data = await res.json();
            return mapper(data);
        } catch (e) {
            // Return null so callers can try the next provider
            console.debug('IP lookup failed for', url, e && e.message);
            return null;
        }
    }

    // ipapi.co: returns country_name and country (alpha-2)
    const fromIpApi = await tryIpApi('https://ipapi.co/json/', data => {
        if (!data) return null;
        return {
            country: data.country_name || data.country || data.country_code || null,
            country_code: data.country || data.country_code || null,
            city: data.city || null,
            region: data.region || null,
            timezone: data.timezone || null,
            ip: data.ip || null
        };
    });
    if (fromIpApi) return fromIpApi;

    // ipwho.is: different shape but widely available
    const fromIpWho = await tryIpApi('https://ipwho.is/', data => {
        if (!data || data.success === false) return null;
        return {
            country: data.country || null,
            country_code: data.country_code || null,
            city: data.city || null,
            region: data.region || null,
            timezone: data.timezone || null,
            ip: data.ip || null
        };
    });
    if (fromIpWho) return fromIpWho;

    // If everything fails, return null so caller can fall back to timezone/other hints
    return null;
}

// Try to load a local JSON mapping of country codes -> emoji flags
// Falls back to the Unicode regional-indicator conversion if the map isn't available
window.__FLAG_MAP = null;
(async function loadFlagMap(){
    try {
        const resp = await fetch('/data/flags.json');
        if (resp.ok) {
            window.__FLAG_MAP = await resp.json();
        }
    } catch (e) {
        // ignore — we'll fall back to generating from code points
        window.__FLAG_MAP = null;
    }
})();

// Convert a 2-letter country code (e.g. 'GB', 'US') to the emoji flag.
// Prefer a local map (same-origin static file) to avoid any cross-origin/network issues.
function countryCodeToFlagEmoji(code) {
    if (!code) return '';
    const cc = (code + '').toUpperCase();
    if (!cc) return '';

    // If we have a preloaded mapping, prefer it (works on restricted/corporate networks)
    try {
        if (window.__FLAG_MAP && typeof window.__FLAG_MAP === 'object') {
            if (window.__FLAG_MAP[cc]) return window.__FLAG_MAP[cc];
        }
    } catch (e) {
        // ignore and fall through to fallback generation
    }

    // As a reliable fallback, construct the flag using regional indicator symbols
    if (cc.length !== 2) return '';
    return String.fromCodePoint(...[...cc].map(c => 127397 + c.charCodeAt(0)));
}

async function getIPv4Address() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (e) {
        return null;
    }
}

// Enhanced adblock detection: uses multiple methods to detect ad blockers
// Returns true if blocked/hidden, false otherwise.
// Now distinguishes between actual ad blockers and Safari's built-in privacy features
function detectAdblock(timeout = 500) {
    return new Promise(resolve => {
        let detectionCount = 0;
        let totalTests = 0;
        let safariNativeBlocking = 0;
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        
        // Test 1: Traditional bait element with common ad classes (most reliable for actual ad blockers)
        function testBaitElement() {
            totalTests++;
            try {
                const bait = document.createElement('div');
                // More comprehensive list of class names that adblockers target
                bait.className = 'adsbox ad-banner adunit adsbygoogle advert advertisement ads banner-ad google-ads pub_300x250 pub_300x250m pub_728x90 text-ad textAd text_ad text_ads text-ads text-ad-links ad-text adSense AdSense ad-sense adsense google-ad googlead google_ad ad_300x250 sponsor-ads ads-by-google adnxs';
                bait.id = 'ad_banner_300x250';
                // Use more realistic ad dimensions and positioning
                bait.style.position = 'absolute';
                bait.style.left = '-9999px';
                bait.style.top = '0px';
                bait.style.width = '300px';
                bait.style.height = '250px';
                bait.style.display = 'block';
                bait.innerHTML = '<span>Advertisement</span>';
                document.body.appendChild(bait);

                setTimeout(() => {
                    try {
                        const style = window.getComputedStyle(bait);
                        const isBlocked = (
                            bait.offsetParent === null ||
                            bait.offsetHeight === 0 ||
                            bait.offsetWidth === 0 ||
                            (style && (
                                style.display === 'none' ||
                                style.visibility === 'hidden' ||
                                style.opacity === '0' ||
                                parseInt(style.height) === 0 ||
                                parseInt(style.width) === 0
                            ))
                        );
                        
                        if (isBlocked) {
                            detectionCount++;
                            console.log('Bait element test: BLOCKED (likely actual ad blocker)');
                        } else {
                            console.log('Bait element test: not blocked');
                        }
                        
                        // Clean up
                        if (bait.parentNode) bait.parentNode.removeChild(bait);
                    } catch (e) {
                        // Element might have been removed by ad blocker
                        detectionCount++;
                        console.log('Bait element test: BLOCKED (element removed/error - likely actual ad blocker)');
                    }
                }, 100);
            } catch (e) {
                // Creation failed, likely blocked
                detectionCount++;
                console.log('Bait element test: BLOCKED (creation failed)');
            }
        }
        
        // Test 2: Check for blocked external ad resources (can be Safari ITP or actual ad blocker)
        function testExternalResource() {
            totalTests++;
            try {
                const img = new Image();
                img.onload = () => {
                    // Ad resource loaded successfully
                    console.log('External resource test: not blocked');
                };
                img.onerror = () => {
                    // Ad resource blocked - could be Safari ITP or actual ad blocker
                    if (isSafari) {
                        safariNativeBlocking++;
                        console.log('External resource test: BLOCKED (likely Safari ITP)');
                    } else {
                        detectionCount++;
                        console.log('External resource test: BLOCKED');
                    }
                };
                // Use a 1x1 pixel tracking image that ad blockers commonly block
                img.src = 'https://googleads.g.doubleclick.net/pagead/viewthroughconversion/1234567890/?random=' + Math.random();
                
                // Timeout in case neither onload nor onerror fires
                setTimeout(() => {
                    if (!img.complete) {
                        if (isSafari) {
                            safariNativeBlocking++;
                            console.log('External resource test: TIMEOUT (likely Safari ITP)');
                        } else {
                            detectionCount++;
                            console.log('External resource test: TIMEOUT');
                        }
                    }
                }, 200);
            } catch (e) {
                detectionCount++;
                console.log('External resource test: ERROR');
            }
        }
        
        // Test 3: Try to create a script element that ad blockers would block
        function testScriptBlocking() {
            totalTests++;
            try {
                const script = document.createElement('script');
                script.type = 'text/javascript';
                script.style.display = 'none';
                // Use a more reliable ad script URL that returns proper JavaScript MIME type
                script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
                
                script.onerror = () => {
                    // Script blocked - could be Safari ITP or actual ad blocker
                    if (isSafari) {
                        safariNativeBlocking++;
                        console.log('Script blocking test: BLOCKED (likely Safari ITP)');
                    } else {
                        detectionCount++;
                        console.log('Script blocking test: BLOCKED');
                    }
                };
                
                script.onload = () => {
                    // If this loads, probably no ad blocker
                    console.log('Script blocking test: not blocked');
                };
                
                document.head.appendChild(script);
                
                // Clean up after test
                setTimeout(() => {
                    if (script.parentNode) {
                        script.parentNode.removeChild(script);
                    }
                }, 300);
                
            } catch (e) {
                if (isSafari) {
                    safariNativeBlocking++;
                    console.log('Script blocking test: ERROR (likely Safari ITP)');
                } else {
                    detectionCount++;
                    console.log('Script blocking test: ERROR');
                }
            }
        }
        
        // Test 4: Check for common ad blocker properties and DOM modifications
        function testAdBlockerProperties() {
            totalTests++;
            try {
                // Check for common ad blocker global variables or modified properties
                const indicators = [
                    window.canRunAds === false,
                    window.isAdBlockActive === true,
                ];
                
                // These indicators are more likely to be actual ad blockers, not Safari ITP
                const strongIndicators = [
                    // Check if Google Ad Services are blocked (less reliable, could be Safari)
                    typeof window.google_jobrunner === 'undefined' && /Chrome/.test(navigator.userAgent), // Only check for Chrome
                    // Check if common ad-related globals are missing when they should be present
                    typeof window.googletag === 'undefined' && typeof window.pbjs === 'undefined' && !isSafari,
                ];
                
                if (indicators.some(indicator => indicator) || strongIndicators.some(indicator => indicator)) {
                    detectionCount++;
                    console.log('Ad blocker properties test: DETECTED');
                } else {
                    console.log('Ad blocker properties test: not detected');
                }
            } catch (e) {
                // Error accessing properties might indicate blocking, but be conservative
                console.log('Ad blocker properties test: ERROR');
            }
        }
        
        // Test 5: Feature detection - check if fetch to ad URLs gets blocked (Safari ITP vs ad blocker)
        function testFetchBlocking() {
            totalTests++;
            try {
                // Try to fetch a common ad resource
                fetch('https://www.google-analytics.com/analytics.js', { 
                    method: 'HEAD',
                    mode: 'no-cors',
                    cache: 'no-cache'
                })
                .then(() => {
                    // Request succeeded, probably no ad blocker for this URL
                    console.log('Fetch test: not blocked');
                })
                .catch(() => {
                    // Request failed, likely blocked
                    if (isSafari) {
                        safariNativeBlocking++;
                        console.log('Fetch test: BLOCKED (likely Safari ITP)');
                    } else {
                        detectionCount++;
                        console.log('Fetch test: BLOCKED');
                    }
                });
            } catch (e) {
                detectionCount++;
                console.log('Fetch test: ERROR');
            }
        }
        
        // Run all tests
        testBaitElement();
        testExternalResource();
        testScriptBlocking();
        testAdBlockerProperties();
        testFetchBlocking();
        
        // Wait for all tests to complete and evaluate results
        setTimeout(() => {
            // Determine the result based on test outcomes
            let result = 'none';
            
            // If bait element test detected blocking, it's definitely an ad blocker
            // (Safari doesn't manipulate DOM elements with ad-related class names)
            if (detectionCount > 0) {
                result = 'enabled';
                console.log(`Ad blocker detection: ${detectionCount}/${totalTests} tests detected actual ad blocking. Result: ENABLED`);
            } else if (isSafari && safariNativeBlocking > 0) {
                // Only Safari's native blocking detected (network-level blocking only)
                result = 'safari-native';
                console.log(`Ad blocker detection: Safari native blocking detected (${safariNativeBlocking} network tests), but no DOM manipulation. Result: SAFARI NATIVE`);
            } else {
                console.log(`Ad blocker detection: No blocking detected. Result: NONE`);
            }
            
            resolve(result);
        }, timeout);
    });
}

async function generateGreeting() {
    const browser = getBrowser();
    const browserDetails = await getBrowserDetails();
    const device = getDetailedDevice();
    const deviceType = getDeviceType();
    const timeOfDay = getTimeOfDay();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Get connection info
    let connectionInfo = '';
    if (navigator.connection) {
        const conn = navigator.connection;
        const effectiveType = conn.effectiveType || '';
        const downlink = conn.downlink;
        
        if (effectiveType) {
            const speedNames = {
                'slow-2g': 'very slow (2G)',
                '2g': 'slow (2G)',
                '3g': 'moderate (3G)',
                '4g': 'fast (4G/5G)'
            };
            connectionInfo = speedNames[effectiveType] || effectiveType;
            if (downlink) {
                connectionInfo += ` at ~${downlink} Mbps`;
            }
        }
    }
    
    // Get battery info
    let batteryInfo = '';
    try {
        if (navigator.getBattery) {
            const battery = await navigator.getBattery();
            const level = Math.round(battery.level * 100);
            const charging = battery.charging;
            batteryInfo = `${level}% ${charging ? '(charging)' : '(not charging)'}`;
        }
    } catch (e) {
        // Battery API not available or blocked
    }
    
    // Get location
    const location = await getLocationFromIP();
    
    // Get IPv4 address
    const ipv4 = await getIPv4Address();

    // Detect adblocker presence
    const adblockResult = await detectAdblock();
    
    let adblockDisplay;
    if (adblockResult === 'enabled') {
        adblockDisplay = 'enabled';
    } else if (adblockResult === 'safari-native') {
        adblockDisplay = 'Safari native blocking';
    } else {
        adblockDisplay = 'none';
    }
    
    let greeting = `Good ${timeOfDay}! `;

    if (location && location.country) {
        const flag = countryCodeToFlagEmoji(location.country_code);
        greeting += `Looks like you're in ${location.city ? location.city + ', ' : ''}${location.country}${flag ? ' ' + flag : ''} `;
    }

    greeting += `\nWe can see you're using ${browser} on `;
    
    // Make it sound natural
    if (device.includes('MacBook') || device.includes('Mac')) {
        if (device.includes('or')) {
            greeting += `what appears to be a ${device}`;
        } else {
            greeting += `a ${device}`;
        }
    } else if (device.includes('iPhone') || device.includes('iPad') || device.includes('Samsung') || device.includes('Pixel')) {
        greeting += `a ${device}`;
    } else if (device.includes('Windows') || device.includes('Linux')) {
        greeting += `a ${device}`;
    } else {
        greeting += `your ${device}`;
    }
    
    greeting += `.`;

    document.getElementById('greeting').textContent = greeting;
    
    // Add details
    const rawUA = navigator.userAgent || '';
    const uaEscaped = rawUA.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const uaChInfo = (navigator.userAgentData && navigator.userAgentData.brands) ? ' • UA-CH: ' + JSON.stringify(navigator.userAgentData.brands) : '';

    // IP display rules per user request:
    // 1) If an IPv4 is available, display only that (never show two IPv4s).
    // 2) If the primary IP is IPv6, also show an IPv4 if available (IPv6 + IPv4 allowed).
    // 3) Never display two IPv4 addresses.
    function isIPv4(ip) {
        return typeof ip === 'string' && /^\d{1,3}(?:\.\d{1,3}){3}$/.test(ip);
    }
    function isIPv6(ip) {
        return typeof ip === 'string' && ip.indexOf(':') !== -1;
    }

    const geoIp = (location && location.ip) ? location.ip : null;
    const ipifyIp = ipv4 || null; // result from getIPv4Address (may return IPv6 on some networks)

    let shown = [];
    // Prefer a clear IPv4 if present (geo first, then ipify)
    if (geoIp && isIPv4(geoIp)) {
        shown = [geoIp];
    } else if (ipifyIp && isIPv4(ipifyIp)) {
        shown = [ipifyIp];
    } else if (geoIp && isIPv6(geoIp)) {
        // Primary is IPv6; include IPv4 if we can find one
        if (ipifyIp && isIPv4(ipifyIp)) shown = [geoIp, ipifyIp];
        else shown = [geoIp];
    } else if (ipifyIp && isIPv6(ipifyIp)) {
        // ipify returned IPv6 but geo didn't provide anything useful
        if (geoIp && isIPv4(geoIp)) shown = [ipifyIp, geoIp];
        else shown = [ipifyIp];
    } else if (geoIp) {
        // Fallback: show whatever geo gave us
        shown = [geoIp];
    } else if (ipifyIp) {
        shown = [ipifyIp];
    }

    // Ensure we never show two IPv4s — dedupe and prefer the first
    if (shown.length > 1) {
        const bothIPv4 = isIPv4(shown[0]) && isIPv4(shown[1]);
        if (bothIPv4) {
            shown = [shown[0]];
        }
    }

    let ipTitle = 'Your IP Address';
    let ipValue = 'Unable to detect';
    let ipFootnote = '';

    if (shown.length === 1) {
        ipValue = shown[0];
    } else if (shown.length === 2) {
        ipTitle = 'Your IP Addresses';
        ipValue = shown[0] + '<br>' + shown[1];
    }

    const detailsHTML = `
        <div class="detail">
            <div class="detail-title">Your Browser</div>
            <div class="detail-value">${browserDetails}
            </div>
        </div>
        
        <div class="detail">
            <div class="detail-title">Your Device</div>
            <div class="detail-value">${device} (${deviceType}) with a ${screen.width}×${screen.height} screen at ${window.devicePixelRatio}x pixel density</div>
        </div>
        
        <div class="detail">
            <div class="detail-title">Your Location & Time</div>
            <div class="detail-value">${location ? `${location.city ? location.city + ', ' : ''}${location.country}${location.country_code ? ' ' + countryCodeToFlagEmoji(location.country_code) : ''} • ` : ''}<span id="current-time" aria-live="off" aria-atomic="true">${new Date().toLocaleTimeString()}</span> local time</div>
        </div>
        
        <div class="detail">
            <div class="detail-title">${ipTitle}</div>
            <div class="detail-value">${ipValue}${ipFootnote}</div>
        </div>
        
        <div class="detail">
            <div class="detail-title">Your Language</div>
            <div class="detail-value">${getHumanReadableLanguage(navigator.language)}${navigator.languages.length > 1 ? ' (also speaks: ' + navigator.languages.slice(1, 4).map(l => getHumanReadableLanguage(l)).join(', ') + ')' : ''}</div>
        </div>
        
        <div class="detail">
            <div class="detail-title">Technical Details</div>
            <div class="detail-value">
                Cookies ${navigator.cookieEnabled ? 'enabled' : 'disabled'} • Ad blocker: ${adblockDisplay}${connectionInfo ? ' • Connection: ' + connectionInfo : ''}${batteryInfo ? ' • Battery: ' + batteryInfo : ''}
                <div style="margin-top:8px; font-weight:600">Time on page: <span id="time-on-page" aria-live="off" aria-atomic="true">0s</span></div>
            </div>
        </div>
    `;
    
    document.getElementById('details').innerHTML = detailsHTML;
    
    // Initialize share functionality after content is generated
    initializeShare();
}

generateGreeting();

// Time on page timer — calculates elapsed seconds from page load and updates #time-on-page
(function() {
    const elId = 'time-on-page';
    const startMs = Date.now();

    function formatElapsed(totalSeconds) {
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const parts = [];
        if (days) parts.push(days + 'd');
        if (hours) parts.push(hours + 'h');
        if (minutes) parts.push(minutes + 'm');
        parts.push(seconds + 's');
        return parts.join(' ');
    }

    function update() {
        const elapsedSec = Math.floor((Date.now() - startMs) / 1000);
        const el = document.getElementById(elId);
        if (el) el.textContent = formatElapsed(elapsedSec);
    }

    // Initial update and keep accurate using Date rather than relying on setInterval drift
    update();
    setInterval(update, 1000);
})();

// Update local time every second
(function() {
    function updateTime() {
        const el = document.getElementById('current-time');
        if (el) el.textContent = new Date().toLocaleTimeString();
    }
    
    updateTime();
    setInterval(updateTime, 1000);
})();

// Share functionality
function initializeShare() {
    const shareBtn = document.getElementById('shareBtn');
    const shareFallback = document.getElementById('shareFallback');
    const copyBtn = document.getElementById('copyBtn');
    const twitterShare = document.getElementById('twitterShare');
    const linkedinShare = document.getElementById('linkedinShare');
    const facebookShare = document.getElementById('facebookShare');
    
    // Check if elements exist
    if (!shareBtn) {
        console.error('Share button not found');
        return;
    }
    
    const shareData = {
        title: 'What We Know About You - Browser Privacy Tool',
        text: 'Check out what data your browser automatically shares with every website you visit.',
        url: window.location.href
    };
    
    console.log('Initializing share functionality');
    
    // Check if Web Share API is supported
    if (navigator.share) {
        console.log('Web Share API supported');
        shareBtn.addEventListener('click', async () => {
            try {
                await navigator.share(shareData);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    // If sharing fails, show fallback options
                    console.log('Share failed, showing fallback');
                    showFallbackOptions();
                }
            }
        });
    } else {
        // No Web Share API, show fallback immediately
        console.log('Web Share API not supported, using fallback');
        shareBtn.addEventListener('click', showFallbackOptions);
    }
    
    function showFallbackOptions() {
        console.log('Showing fallback options');
        if (shareFallback) {
            shareFallback.classList.remove('hidden');
            shareBtn.textContent = '📤 More Options';
        }
    }
    
        // Copy link functionality
    if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(shareData.url);
                showCopySuccess();
            } catch (err) {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = shareData.url;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showCopySuccess();
            }
        });
    }
    
    function showCopySuccess() {
        const successMsg = document.createElement('div');
        successMsg.className = 'copy-success';
        successMsg.textContent = '✅ Link copied!';
        document.body.appendChild(successMsg);
        
        setTimeout(() => successMsg.classList.add('show'), 100);
        setTimeout(() => {
            successMsg.classList.remove('show');
            setTimeout(() => document.body.removeChild(successMsg), 300);
        }, 2000);
    }
    
    // Social media share links
    const encodedText = encodeURIComponent(shareData.text);
    const encodedUrl = encodeURIComponent(shareData.url);
    const encodedTitle = encodeURIComponent(shareData.title);
    
    if (twitterShare) {
        twitterShare.href = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
    }
    if (linkedinShare) {
        linkedinShare.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    }
    if (facebookShare) {
        facebookShare.href = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    }
}

// Theme toggle (light/dark) — toggled by selecting the header logo button
(function() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    const logoImg = themeToggle.querySelector('.logo-inline');

    function updateMetaThemeColor(color) {
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', color);
    }

    function applyTheme(theme) {
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
            themeToggle.setAttribute('aria-pressed', 'true');
            themeToggle.title = 'Switch to dark theme';
            if (logoImg) logoImg.classList.add('logo--light');
            updateMetaThemeColor('#f7f8fb');
        } else {
            document.documentElement.removeAttribute('data-theme');
            themeToggle.setAttribute('aria-pressed', 'false');
            themeToggle.title = 'Switch to light theme';
            if (logoImg) logoImg.classList.remove('logo--light');
            updateMetaThemeColor('#0a0e0d');
        }
        try {
            localStorage.setItem('theme', theme);
        } catch (e) {
            // ignore storage errors (e.g., private mode)
        }
    }

    function toggleTheme() {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        applyTheme(isLight ? 'dark' : 'light');
        // Animate transition on toggles
        document.documentElement.classList.add('theme-transition');
        window.setTimeout(() => document.documentElement.classList.remove('theme-transition'), 300);
    }

    themeToggle.addEventListener('click', (e) => {
        e.preventDefault();
        toggleTheme();
    });

    themeToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleTheme();
        }
    });

    // Initialize for first load using saved preference or OS prefers-color-scheme
    try {
        const saved = localStorage.getItem('theme');
        if (saved) {
            applyTheme(saved);
        } else {
            const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
            applyTheme(prefersLight ? 'light' : 'dark');
        }
    } catch (err) {
        // if we can't access localStorage, default to dark
        applyTheme('dark');
    }
})();
