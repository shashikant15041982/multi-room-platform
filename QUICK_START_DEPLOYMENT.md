# ⚡ Quick Start: Deploy Real AI Chat

## The Problem
GitHub Pages can't run a server, so the frontend can't call Claude API directly.

## The Solution
Deploy the backend to **Replit** (free!) → Frontend calls backend → Backend calls Claude API

---

## 🚀 Deploy to Replit (5 minutes)

### Step 1: Go to Replit
👉 https://replit.com

### Step 2: Create New Project
- Click "Create" → Choose "Node.js"
- Name it: `chat-workspace-backend`

### Step 3: Upload Files
Copy these files from GitHub into your Replit project:
- `server.js`
- `package.json`
- `.env.example` → rename to `.env`

### Step 4: Add API Key
1. Click "Secrets" (🔐 icon on left sidebar)
2. Add new secret:
   - **Key:** `ANTHROPIC_API_KEY`
   - **Value:** Your Claude API key (from console.anthropic.com)

### Step 5: Run
Click "Run" button → Replit deploys automatically!

You'll see:
```
✔ Listening on https://your-replit-name.replit.dev
```

### Step 6: Update Frontend
In `index-v2-chat-focused.html`, find this line:
```javascript
const API_URL = 'http://localhost:3000'; // Local dev
```

Change to:
```javascript
const API_URL = 'https://your-replit-name.replit.dev';
```

Commit & push to GitHub.

### Step 7: Test! 
👉 https://shashikant15041982.github.io/multi-room-platform/index-v2-chat-focused.html

1. Login with any email
2. Create a new room
3. Type a message
4. **Claude should respond with real answers!** 🎉

---

## 🏠 Local Development (Optional)

### Prerequisites
- Node.js installed (download from nodejs.org)

### Setup
```bash
cd multi-room-platform
npm install
```

### Create `.env` file
```
ANTHROPIC_API_KEY=your-actual-key-here
PORT=3000
```

### Run
```bash
npm start
```

Server will be at `http://localhost:3000`

Then open `index-v2-chat-focused.html` in browser and test!

---

## 🔧 Troubleshooting

### "Cannot connect to server"
- Replit backend is not running
- API_URL in HTML doesn't match your Replit URL
- Check browser console (F12) for errors

### "API error"
- API key is wrong or expired
- Check Replit Secrets have correct key
- Check server logs in Replit

### "CORS error"
- Backend should have `cors` enabled (it does by default)
- Check server.js is running (click Run again)

---

## 📊 What Happens Now

```
You type: "What is Python?"
    ↓
Frontend sends to: https://your-replit.replit.dev/api/chat
    ↓
Backend receives, calls Claude API
    ↓
Claude responds: "Python is a programming language..."
    ↓
Backend returns to Frontend
    ↓
You see real answer in chat! ✅
```

---

## Next Steps

After testing real chat:
1. **Phase 20:** Add more AI options (ChatGPT, DeepSeek, Mistral)
2. **Phase 21:** Smart AI switching based on token limits
3. **Phase 22:** File upload & export
4. **Phase 23:** Cloud storage (Firebase)

Questions? Check `README_BACKEND.md` for full details.
