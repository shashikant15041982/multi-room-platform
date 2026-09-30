# 👨‍💻 Developer's Guide — Extending the Platform

**For**: Developers who want to add features (Phase 24+)  
**Level**: Intermediate-Advanced  
**Time**: 15 minutes to understand

---

## 🎯 Before You Start

### Prerequisites
- [ ] Read: [COMPLETE_README.md](COMPLETE_README.md)
- [ ] Read: [ARCHITECTURE_VISUAL.md](ARCHITECTURE_VISUAL.md)
- [ ] Understand: [README_BACKEND.md](README_BACKEND.md)
- [ ] Review: [TESTING_GUIDE.md](TESTING_GUIDE.md)

### Environment Setup
```bash
# 1. Clone the repo
git clone https://github.com/shashikant15041982/multi-room-platform.git
cd multi-room-platform

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env
# Add your 4 API keys to .env

# 4. Start developing
npm run dev  # Uses nodemon for auto-reload
```

---

## 📁 File Organization

### Frontend (Client-Side)
```
index-v2-chat-focused.html (CURRENT PRODUCTION)
├─ HTML Structure
│  ├─ #loginScreen
│  ├─ #roomListScreen
│  └─ #chatScreen (main interface)
│
├─ CSS Styles
│  ├─ Colors (--color-primary: #667eea)
│  ├─ Layouts (flexbox, responsive)
│  └─ Components (.screen, .message, .modal)
│
└─ JavaScript
   ├─ State: appState, userSession, tokenCount
   ├─ Screens: showScreen(), goToRoomList()
   ├─ Rooms: createRoom(), openRoom(), deleteRoom()
   ├─ Messages: sendMessage(), renderMessages()
   ├─ Files: handleFileSelect(), exportTXT(), etc.
   └─ Storage: loadState(), saveState()
```

### Backend (Server-Side)
```
server.js (CURRENT PRODUCTION)
├─ Express setup
├─ CORS middleware
├─ API Routes
│  ├─ GET /api/health
│  ├─ GET /api/models
│  └─ POST /api/chat
└─ AI Configuration
   ├─ Claude (Anthropic)
   ├─ ChatGPT (OpenAI)
   ├─ DeepSeek
   └─ Mistral
```

---

## 🚀 Common Development Tasks

### Adding a New AI Provider

#### Step 1: Update Backend Configuration

```javascript
// In server.js, add to AI_MODELS object
const AI_MODELS = {
  // ... existing AIs ...
  YourAI: {
    model: 'your-model-name',
    apiKey: process.env.YOUR_AI_API_KEY,
    endpoint: 'https://api.your-ai.com/v1/chat',
    provider: 'Your AI Provider',
    maxTokens: 100000
  }
};
```

#### Step 2: Implement API Handler

```javascript
// In server.js, in the /api/chat POST handler
else if (ai === 'YourAI') {
  const response = await fetch(config.endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: config.model,
      messages: messages
    })
  });
  
  const data = await response.json();
  content = data.choices[0].message.content;
}
```

#### Step 3: Update Frontend

```javascript
// In index-v2-chat-focused.html
const AI_CONFIGS = {
  // ... existing AIs ...
  YourAI: {
    color: '#hexcolor',
    emoji: '🔵',
    provider: 'Your AI Provider',
    order: 4
  }
};

const AI_ORDER = ['Claude', 'ChatGPT', 'DeepSeek', 'Mistral', 'YourAI'];
const TOKEN_LIMITS = {
  // ... existing ...
  YourAI: 100000
};
```

#### Step 4: Add to UI

```html
<!-- In the #newRoomModal AI selector -->
<div class="ai-option" data-ai="YourAI" onclick="selectStartAI(this)">
  <div class="ai-option-name">🔵 YourAI</div>
  <div class="ai-option-desc">Your description</div>
</div>

<!-- In the #aiSelector dropdown -->
<option value="YourAI">🔵 YourAI</option>
```

#### Step 5: Environment Variables

```bash
# In .env
YOUR_AI_API_KEY=your-api-key-here
```

#### Step 6: Test

```bash
1. npm run dev
2. Open frontend
3. Create room, select YourAI
4. Send message
5. Verify response appears
```

---

### Adding a New Export Format

#### Step 1: Create Export Function

```javascript
function exportCustomFormat() {
  const room = appState.rooms[appState.currentRoomId];
  let content = ''; // Build your format
  
  room.messages.forEach(msg => {
    // Format each message
    if (msg.type === 'user') {
      content += `[USER] ${msg.text}\n`;
    } else if (msg.type === 'ai') {
      content += `[${msg.ai.toUpperCase()}] ${msg.text}\n`;
    }
  });
  
  downloadFile(content, `${room.name}.custom`, 'text/plain');
}
```

#### Step 2: Add UI Button

```html
<div class="export-buttons">
  <!-- Add new button -->
  <button onclick="exportCustomFormat()">📋 CUSTOM</button>
</div>
```

#### Step 3: Test

```bash
1. Create room with messages
2. Click new export button
3. Verify file downloads
4. Open and check format
```

---

### Adding a New Sidebar Feature

#### Step 1: Add HTML

```html
<!-- New section in file-sidebar -->
<div class="sidebar-section">
  <div class="sidebar-header">Your Feature</div>
  <div id="yourFeature" class="feature-content">
    <!-- Feature content goes here -->
  </div>
</div>
```

#### Step 2: Add CSS

```css
.sidebar-section {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.feature-content {
  font-size: 12px;
  color: #666;
}
```

#### Step 3: Add JavaScript

```javascript
function updateYourFeature() {
  const room = appState.rooms[appState.currentRoomId];
  const element = document.getElementById('yourFeature');
  
  // Update feature based on room data
  element.innerHTML = `<div>${room.messages.length} messages</div>`;
}

// Call on room open
openRoom(roomId);
updateYourFeature();
```

---

### Adding Cloud Backup (Firebase)

#### Step 1: Setup Firebase

```bash
# Install Firebase
npm install firebase

# Get config from console.firebase.google.com
```

#### Step 2: Initialize Firebase

```javascript
// In server.js or new firebase-config.js
const firebase = require('firebase/app');
require('firebase/database');
require('firebase/auth');

const firebaseConfig = {
  // ... config from console ...
};

firebase.initializeApp(firebaseConfig);
```

#### Step 3: Auto-Sync Rooms

```javascript
// When saving state
function saveState() {
  localStorage.setItem('appState', JSON.stringify(appState));
  
  // NEW: Sync to Firebase if user is authenticated
  if (userSession.isAuthenticated && firebase.auth().currentUser) {
    syncToFirebase();
  }
}

function syncToFirebase() {
  const userId = firebase.auth().currentUser.uid;
  const roomsRef = firebase.database().ref(`users/${userId}/rooms`);
  
  Object.values(appState.rooms).forEach(room => {
    roomsRef.child(room.id).set(room);
  });
}
```

#### Step 4: Load from Cloud

```javascript
function loadFromFirebase() {
  const userId = firebase.auth().currentUser.uid;
  const roomsRef = firebase.database().ref(`users/${userId}/rooms`);
  
  roomsRef.on('value', snapshot => {
    appState.rooms = snapshot.val() || {};
    renderRoomList();
  });
}
```

---

## 🧪 Testing Your Changes

### Frontend Testing

```javascript
// Open browser console (F12)

// Test state
console.log(JSON.stringify(appState));

// Test localStorage
localStorage.getItem('appState');

// Reload and verify persistence
location.reload();

// Test AI switching
document.getElementById('aiSelector').value = 'ChatGPT';
switchAI();
```

### Backend Testing

```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Test models
curl http://localhost:3000/api/models

# Test chat
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"ai":"Claude","messages":[{"role":"user","content":"Hello"}]}'
```

### Full Integration Test

```bash
1. Start backend: npm run dev
2. Open frontend in browser
3. Create room with new feature
4. Send message
5. Check browser console (F12) for errors
6. Verify all data persists on refresh
7. Check localStorage size
8. Test export with new data
```

---

## 📋 Code Quality Standards

### Comments
```javascript
// Use clear, descriptive comments
// Explain WHY, not WHAT (code shows WHAT)

// ✅ Good
// Check if token count exceeds limit before auto-switching AI
if (tokenCount >= limit) {
  autoSwitchAI();
}

// ❌ Bad
// Check token count
if (tokenCount >= limit) {
```

### Variable Naming
```javascript
// ✅ Good
const currentRoomId = appState.currentRoomId;
const tokenLimit = TOKEN_LIMITS[appState.currentAI];

// ❌ Bad
const r = appState.currentRoomId;
const t = TOKEN_LIMITS[appState.currentAI];
```

### Function Size
- Keep functions small and focused
- Single responsibility principle
- Max ~50 lines per function
- If longer, break into smaller functions

### Error Handling
```javascript
// ✅ Good
try {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return await response.json();
} catch (error) {
  console.error('API call failed:', error);
  showUserMessage('Could not connect to server');
}

// ❌ Bad
const response = await fetch(API_URL);
return response.json(); // No error handling
```

---

## 📚 Documentation Standards

When adding features, document:

1. **What it does** (1-2 sentences)
2. **How to use it** (steps)
3. **Technical details** (implementation notes)
4. **Testing** (how to test the feature)

### Template
```markdown
# Feature Name

## What it does
Brief description of feature.

## How to use
1. Step 1
2. Step 2
3. Step 3

## Technical details
- Implementation approach
- Key functions
- Storage considerations

## Testing
- Test procedure 1
- Test procedure 2

## Known limitations
- Limitation 1
- Limitation 2
```

---

## 🔍 Common Pitfalls

### 1. Forgetting to Save State

```javascript
// ❌ Bad - data lost on refresh
room.messages.push({type: 'ai', text: response});
renderMessages();

// ✅ Good - data persists
room.messages.push({type: 'ai', text: response});
saveState(); // Don't forget this!
renderMessages();
```

### 2. Not Handling Errors

```javascript
// ❌ Bad - user sees nothing if error
const response = await fetch(API_URL);
const data = response.json();
showMessage(data.content);

// ✅ Good - user sees error message
try {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('API error');
  const data = await response.json();
  showMessage(data.content);
} catch (error) {
  showMessage('⚠️ Could not get response');
}
```

### 3. Breaking Mobile Responsiveness

```css
/* ❌ Bad - doesn't work on mobile */
.component {
  width: 800px;
  display: flex;
}

/* ✅ Good - responsive */
.component {
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-wrap: wrap;
}

@media (max-width: 600px) {
  .component {
    flex-direction: column;
  }
}
```

### 4. Hardcoding Values

```javascript
// ❌ Bad - magic numbers everywhere
if (messages.length > 100) { /* ... */ }

// ✅ Good - named constants
const MAX_MESSAGES = 100;
if (messages.length > MAX_MESSAGES) { /* ... */ }
```

---

## 🚀 Deployment After Changes

### Local Testing
```bash
npm run dev  # Test locally
```

### Push to GitHub
```bash
git add .
git commit -m "Feature: Description of changes"
git push
```

### Replit Update
```bash
# Replit will auto-pull from GitHub (if configured)
# Or manually redeploy:

1. Go to Replit
2. Click "Run"
3. Verify changes work
```

### Frontend Update
```bash
# GitHub Pages auto-deploys from /docs or branch
# Just push to GitHub, wait 1-2 minutes
```

---

## 📊 Performance Considerations

### localStorage Limits
- Total: ~5-10MB per user
- Per-file: 1.3x original size (Base64)
- Monitor: F12 → Application → Local Storage

### API Rate Limits
- Claude: ~100K tokens/month (free tier)
- ChatGPT: ~10K messages/month
- Plan accordingly; consider caching

### Rendering Performance
- 100+ messages: ~200ms render time
- Use virtual scrolling for 1000+
- Profile with DevTools

---

## 🎓 Learning Resources

- [MDN Web Docs](https://developer.mozilla.org) — Web standards
- [JavaScript.info](https://javascript.info) — JS fundamentals
- [Express.js Guide](https://expressjs.com) — Node.js server
- [Firebase Docs](https://firebase.google.com/docs) — Cloud integration

---

## 💬 Getting Help

1. **For code issues**: Check [TESTING_GUIDE.md](TESTING_GUIDE.md) → Edge Cases
2. **For architecture questions**: See [ARCHITECTURE_VISUAL.md](ARCHITECTURE_VISUAL.md)
3. **For feature questions**: See relevant Phase documentation
4. **For deployment issues**: See [QUICK_START_DEPLOYMENT.md](QUICK_START_DEPLOYMENT.md)

---

## ✨ Next Steps

1. Pick a feature to add (see [FEATURES_ROADMAP.md](FEATURES_ROADMAP.md))
2. Follow relevant section above
3. Test thoroughly
4. Document changes
5. Push to GitHub
6. Deploy to Replit

---

**Happy coding!** 🚀

Questions? See the documentation index in [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)

