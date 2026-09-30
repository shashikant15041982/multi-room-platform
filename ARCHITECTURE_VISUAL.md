# 🏗️ System Architecture — Visual Guide

## 🎯 High-Level Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER'S BROWSER (Client)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              index-v2-chat-focused.html                  │   │
│  │  (Vanilla JavaScript, HTML5, CSS3)                       │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │                                                            │   │
│  │  ┌──────────────────┐      ┌──────────────────┐          │   │
│  │  │   Login Screen   │      │  Room List       │          │   │
│  │  │  Email input     │      │  Create rooms    │          │   │
│  │  │  Start auth      │      │  Select AI       │          │   │
│  │  └──────────────────┘      └──────────────────┘          │   │
│  │           ↓                         ↓                     │   │
│  │  ┌────────────────────────────────────────┐              │   │
│  │  │      Chat Screen (Main Interface)      │              │   │
│  │  ├────────────────────────────────────────┤              │   │
│  │  │  Header: AI Selector, Token Counter   │              │   │
│  │  │  Messages: User & AI messages         │              │   │
│  │  │  Input: Text input + Send button      │              │   │
│  │  │  Files: Upload, Sidebar, Export       │              │   │
│  │  └────────────────────────────────────────┘              │   │
│  │           ↓                                              │   │
│  │  ┌────────────────────────────────────────┐              │   │
│  │  │  localStorage (Device Storage)        │              │   │
│  │  │  • appState (rooms + messages)        │              │   │
│  │  │  • userSession (email + auth)         │              │   │
│  │  │  • File data (Base64 encoded)         │              │   │
│  │  │  Limit: ~5-10MB per user              │              │   │
│  │  └────────────────────────────────────────┘              │   │
│  │                                                            │   │
│  └──────────────────────────────────────────────────────────┘   │
│           ↓ (HTTP/HTTPS)                                         │
└─────────────────────────────────────────────────────────────────┘
            │
            │ fetch() to API
            │
            ↓
┌─────────────────────────────────────────────────────────────────┐
│              BACKEND SERVER (Node.js on Replit)                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │           Express.js Server (port 3000)                    │ │
│  ├────────────────────────────────────────────────────────────┤ │
│  │                                                              │ │
│  │  Endpoints:                                                 │ │
│  │  ├─ GET  /api/health      → Server status + analytics    │ │
│  │  ├─ GET  /api/models      → Available AIs + features     │ │
│  │  └─ POST /api/chat        → Route message to AI           │ │
│  │                                                              │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │         AI Router (Smart Switching)                 │ │ │
│  │  ├──────────────────────────────────────────────────────┤ │ │
│  │  │  Input: { messages, ai }                             │ │ │
│  │  │  1. Validate AI selection                            │ │ │
│  │  │  2. Route to correct endpoint                        │ │ │
│  │  │  3. Send request with API key                        │ │ │
│  │  │  4. Parse response                                   │ │ │
│  │  │  5. Track usage (analytics)                          │ │ │
│  │  │  Output: { content, tokens, ai }                     │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                                                              │ │
│  └────────────────────────────────────────────────────────────┘ │
│           ↓↓↓↓ (HTTP requests with API keys)                     │
│           ↓                                                       │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │           External AI Provider APIs                         │ │
│  ├─────────────────────────────────────────────────────────────┤ │
│  │                                                               │ │
│  │  🟣 Claude API (Anthropic)                                 │ │
│  │  ├─ Endpoint: api.anthropic.com                            │ │
│  │  ├─ Model: claude-opus-4-1                                 │ │
│  │  └─ Token Limit: 100,000                                   │ │
│  │                                                               │ │
│  │  🟢 ChatGPT API (OpenAI)                                   │ │
│  │  ├─ Endpoint: api.openai.com                               │ │
│  │  ├─ Model: gpt-4                                            │ │
│  │  └─ Token Limit: 120,000                                   │ │
│  │                                                               │ │
│  │  🟠 DeepSeek API                                           │ │
│  │  ├─ Endpoint: api.deepseek.com                             │ │
│  │  ├─ Model: deepseek-chat                                   │ │
│  │  └─ Token Limit: 60,000                                    │ │
│  │                                                               │ │
│  │  🔴 Mistral API                                            │ │
│  │  ├─ Endpoint: api.mistral.ai                               │ │
│  │  ├─ Model: mistral-large                                   │ │
│  │  └─ Token Limit: 80,000                                    │ │
│  │                                                               │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
            ↑
            │ AI Responses
            │
            ↓
┌─────────────────────────────────────────────────────────────────┐
│         BROWSER (Response Handling & Display)                    │
├─────────────────────────────────────────────────────────────────┤
│  1. Receive response from server                                 │
│  2. Add to messages array                                        │
│  3. Render in chat UI                                            │
│  4. Update token counter                                         │
│  5. Save to localStorage                                         │
│  6. Check for auto-switch (if at limit)                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Message Flow (Step-by-Step)

### User sends message:

```
User Types: "Hello Claude" → Presses ENTER

        ↓ [sendMessage() function]

1. Validate input (non-empty)
2. Add to messages array locally
3. Update token counter (+estimate)
4. Render message in chat
5. Disable send button

        ↓ [fetch to backend]

6. POST /api/chat
   {
     "messages": [...],
     "ai": "Claude"
   }

        ↓ [Backend processing]

7. Express receives request
8. Validate AI selection
9. Route to Claude endpoint
10. Add authorization header
11. Send to Anthropic API
12. Parse response
13. Track in analytics
14. Return to browser

        ↓ [fetch response]

15. Browser receives response
16. Extract AI message
17. Add to messages array
18. Render in chat
19. Update token counter
20. Save to localStorage
21. Enable send button
22. Update UI

✅ Complete! User sees response
```

---

## 💾 File Storage System

### Frontend (Browser)

```
localStorage
│
├─ appState: {
│   "rooms": {
│     "room-1696089600000": {
│       "id": "room-1696089600000",
│       "name": "Project Alpha",
│       "currentAI": "Claude",
│       "tokenCount": 45234,
│       "messages": [
│         { "type": "user", "text": "..." },
│         { "type": "ai", "ai": "Claude", "text": "..." },
│         { "type": "file", "filename": "...", "content": "data:..." }
│       ],
│       "files": [
│         { "id": "file-123", "name": "doc.pdf", "size": 102400 }
│       ]
│     }
│   },
│   "currentRoomId": "room-1696089600000"
│ }
│
└─ userSession: {
   "isAuthenticated": true,
   "email": "user@example.com"
 }

Storage: ~5-10MB per user (limited)
Phase 24: Firebase cloud sync will extend this
```

---

## 📊 Token Flow (Smart Switching)

```
Room starts with Claude
│
├─ Message 1-10: Uses Claude (0-10K tokens)
│   Status: 🟢 GREEN (10% of limit)
│
├─ Message 11-50: Uses Claude (10K-80K tokens)
│   Status: 🟢 GREEN (80% of limit)
│
├─ Message 51: At 90K tokens
│   Status: 🟠 YELLOW (90% - warning)
│   Action: Show orange indicator
│
├─ Message 52: At 100K tokens (HIT LIMIT)
│   Status: 🔴 RED (100% - critical)
│   Action: ⚡ AUTO-SWITCH
│
├─ ✨ AUTOMATIC HANDOFF ✨
│   System message: "Switched from Claude to ChatGPT"
│   AI changes to: ChatGPT
│   Tokens reset for ChatGPT: 0
│   Conversation continues seamlessly
│
└─ Message 53+: Uses ChatGPT (0-10K tokens)
   Status: 🟢 GREEN (fresh start)
   
Cycle repeats: Claude → ChatGPT → DeepSeek → Mistral → Claude
```

---

## 📱 Frontend Architecture

### Component Hierarchy

```
App
│
├─ LoginScreen
│  └─ Email input + Sign in button
│
├─ RoomListScreen
│  ├─ Room list (cards)
│  └─ Create room button
│
├─ ChatScreen
│  ├─ Header
│  │  ├─ Back button
│  │  ├─ Room title
│  │  ├─ AI selector
│  │  └─ Token counter
│  │
│  ├─ Messages area
│  │  ├─ User messages
│  │  ├─ AI messages
│  │  ├─ System messages
│  │  └─ File uploads
│  │
│  ├─ Input area
│  │  ├─ Text input
│  │  ├─ Upload button
│  │  └─ Send button
│  │
│  ├─ File sidebar (Phase 23)
│  │  └─ File list with management
│  │
│  └─ Export buttons
│     ├─ PDF
│     ├─ TXT
│     ├─ Markdown
│     └─ JSON
│
└─ NewRoomModal
   ├─ AI selector (4 options)
   └─ Room name input
```

---

## 🎯 AI Selection Flow

```
User creates room
│
├─ Opens "Create Room" modal
│
├─ Visual AI picker (4 cards):
│  │
│  ├─ 🟣 Claude (Anthropic) - "Best reasoning"
│  ├─ 🟢 ChatGPT (OpenAI) - "General knowledge"
│  ├─ 🟠 DeepSeek - "Fast & cheap"
│  └─ 🔴 Mistral - "Privacy-first"
│
├─ User clicks desired AI
│  (visually highlighted)
│
├─ Enters room name
│
├─ Room created with:
│  - Selected AI as default
│  - Metadata tagged with AI color
│  - Token counter reset
│
└─ Opens room
   └─ Messages use selected AI
      (can switch later via dropdown)
```

---

## 🔐 API Key Flow

```
User wants to deploy
│
├─ Gets API keys from:
│  ├─ console.anthropic.com
│  ├─ platform.openai.com
│  ├─ platform.deepseek.com
│  └─ console.mistral.ai
│
├─ Adds keys to Replit Secrets:
│  ├─ ANTHROPIC_API_KEY
│  ├─ OPENAI_API_KEY
│  ├─ DEEPSEEK_API_KEY
│  └─ MISTRAL_API_KEY
│
├─ Server reads from environment:
│  process.env.ANTHROPIC_API_KEY
│  etc.
│
├─ On API call, adds to header:
│  Authorization: Bearer {key}
│  or
│  x-api-key: {key}
│
└─ API provider validates & responds
   (No keys in frontend code ever)
```

---

## 🚀 Deployment Architecture

### Phase 22-23 (Current)

```
GitHub Pages (Frontend) ←→ Replit (Backend)
│                         │
├─ index-v2-chat-...html  ├─ server.js
├─ Runs in browser        ├─ Express
├─ Talks to backend       ├─ Route to 4 AIs
└─ Data in localStorage   └─ API key handling
```

### Phase 24+ (Planned)

```
GitHub Pages (Frontend) ←→ Replit (Backend) ←→ Firebase (Cloud)
│                         │                      │
├─ Same as before        ├─ Same as before     ├─ User data
├─ Plus sync to cloud    ├─ Plus cloud sync    ├─ Room storage
└─ Cross-device access   └─ Database driver    └─ Real-time sync
```

---

## 📊 Data Flow Diagram (Complete)

```
┌──────────────────────────────────────────────────────────────┐
│                    USER INTERACTION                          │
│  (Click button, type message, upload file)                   │
└───────────────────────┬──────────────────────────────────────┘
                        │
                        ↓
            ┌───────────────────────┐
            │ Frontend JavaScript   │
            │ • Validation         │
            │ • State management   │
            │ • UI rendering       │
            └───────────┬───────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ↓               ↓               ↓
    localStorage    File Viewer     Export
    (persist)       (preview)       (download)
        │               │               │
        └───────────────┼───────────────┘
                        │
                        ↓
            ┌───────────────────────┐
            │  API Request (fetch)  │
            │  POST /api/chat       │
            │  {messages, ai}       │
            └───────────┬───────────┘
                        │
        ┌───────────────┴───────────────┐
        │                               │
        ↓                               ↓
    Replit Backend              External APIs
    • Validation               • Anthropic
    • AI routing               • OpenAI
    • Error handling           • DeepSeek
    • Analytics                • Mistral
        │
        └───────────────────────┬──────────
                                │
                                ↓
                    ┌───────────────────────┐
                    │  AI Response         │
                    │  "Your answer is..." │
                    └───────────┬───────────┘
                                │
                        ┌───────┴────────┐
                        │                │
                        ↓                ↓
                    Browser         Update State
                    Display         Save locally
                        │                │
                        └────────┬───────┘
                                 │
                                 ↓
                        ┌──────────────────┐
                        │ UI Updates       │
                        │ • New message    │
                        │ • Token counter  │
                        │ • AI indicator   │
                        └──────────────────┘
```

---

## ✨ Summary

### Simple View (3 Parts)
1. **Frontend** (Browser) — User interface & local storage
2. **Backend** (Replit) — API routing & AI orchestration
3. **External APIs** (4 Providers) — Claude, ChatGPT, DeepSeek, Mistral

### Medium View (Data Flow)
1. User sends message → Browser validates & stores locally
2. Browser sends to Replit backend
3. Backend routes to correct AI based on selection
4. AI responds to Replit
5. Replit returns to browser
6. Browser updates UI & saves to localStorage

### Complex View (Architecture)
- Responsive frontend (vanilla JS)
- Multi-AI router backend (Express)
- Smart token switching (automatic handoff)
- File management (upload, preview, export)
- localStorage for persistence
- Modular & extensible design

---

**For questions about architecture:** See [COMPLETE_README.md](COMPLETE_README.md) → Architecture section

