# 🚀 Multi-Room Platform

**AI Helper Relay System for Multi-Project Management**

---

## 📖 WHAT IS THIS?

A unified web interface that lets you manage multiple independent projects in 3 rooms. Each room has rotating AI helpers (Claude, ChatGPT, DeepSeek, etc.) that seamlessly relay conversations when one hits free-tier limits.

**Key Concept:** You experience ONE continuous conversation. The AI switches invisibly behind the scenes.

---

## 🎯 LIVE PLATFORM

**Visit:** https://shashikant15041982.github.io/multi-room-platform/

*Currently in development (Stage 2B/8)*

---

## 🏗️ CURRENT FEATURES (Session 2)

✅ **3 Independent Rooms**
- Flexible purpose (Python dev, learning, data analysis, web dev, writing)
- Tab interface for easy switching
- Real-time home page updates

✅ **Execution History**
- Log each run with timestamp, jobs found, high match count, duration
- Persistent storage (survives page refresh)

✅ **Email System**
- Simulated email logging (ready for real integration later)
- Shows: To, Subject, Preview, Status
- Home page displays email count per room

✅ **AI Relay System**
- Detects when message count exceeds 20
- Logs handoff: "Claude → ChatGPT"
- Ready for context passing (next stage)

✅ **Data Persistence**
- localStorage automatically migrates data
- Auto-fix for null/undefined references
- Error handling on all functions

---

## 📋 UPCOMING FEATURES (Session 3+)

### Session 3: Relay Logging Enhancement
- [ ] Context size tracking (KB per relay)
- [ ] RELAY STATS tab with per-AI metrics
- [ ] Enhanced relay timeline display
- [ ] Home page relay indicators

### Session 4-5: Context Passing
- [ ] SHA-256 integrity verification
- [ ] Full conversation history on handoff
- [ ] Proactive AI switching at 85% token threshold

### Session 6-7: Backend Integration
- [ ] Google Apps Script backend
- [ ] OAuth authentication
- [ ] Google Sheets database
- [ ] Real API integration

### Session 8: Production Ready
- [ ] Security hardening
- [ ] Performance optimization
- [ ] Full documentation
- [ ] Deployment to your system

---

## 🧪 TESTING

### Quick Start (2 minutes)
1. Visit: https://shashikant15041982.github.io/multi-room-platform/
2. Click "Enter Room" on any card
3. Click [▶ RUN NOW] button
4. Check HISTORY tab for new execution
5. Check EMAILS tab for sent email
6. Refresh page → data persists ✓

### Full Testing
See `TESTING_CHECKLIST.md` for comprehensive test suite.

---

## 📊 DEVELOPMENT PROGRESS

| Session | Stage | Title | Status |
|---------|-------|-------|--------|
| 1 | 2A-1 | Execution History UI | ✅ Complete |
| 2 | 2A-2 | Email Relay System | ✅ Complete |
| 3 | 2B | Relay Logging Enhancement | ⏳ Next |
| 4 | 3A | Context Passing | Pending |
| 5 | 3B | Advanced Handoff Detection | Pending |
| 6 | 4A | Backend Structure | Pending |
| 7 | 4B | API Framework | Pending |
| 8 | 5 | Polish & Deployment | Pending |

**Overall:** 25% Complete | 31,700 tokens remaining

---

## 💾 FILE STRUCTURE

```
multi-room-platform/
├── index.html                  # Live platform (current session)
├── README.md                   # This file
├── PROGRESS.md                 # Detailed progress tracking
├── checkpoint.json             # Session state & recovery
├── TESTING_CHECKLIST.md        # Testing instructions
└── [Previous builds - archived]
```

---

## 🔄 DEVELOPMENT WORKFLOW

### During Development (Public Repo)
1. I build features in HTML
2. Push to GitHub
3. You test via GitHub Pages link
4. You report issues on GitHub Issues
5. I fix and iterate

### During Claude Lockout (5-hour window)
1. You test the live platform
2. Use GitHub Copilot if you want to explore code
3. Report results on GitHub Issues
4. I review and continue when available

### After Stage 5 (Fully Working)
1. Switch repo to Private
2. Add backend (Google Apps Script)
3. Deploy to your system
4. Run locally (zero cloud dependency)

---

## 🎨 TECHNOLOGY STACK

**Current (Stages 1-3):**
- Frontend: HTML + CSS + JavaScript (self-contained)
- Storage: Browser localStorage
- Hosting: GitHub Pages

**Stages 4-5 (Planned):**
- Backend: Google Apps Script
- Database: Google Sheets
- Authentication: OAuth
- API: RESTful endpoints

**Deployment Options:**
- GitHub Pages (current)
- Your local machine (fully offline)
- Private server (self-hosted)
- Any cloud provider

---

## 🤖 AI PROFILES

Each room can be assigned an AI profile with rotating helpers:

| Profile | Emoji | Helpers | Purpose |
|---------|-------|---------|---------|
| Python Dev | 🐍 | Claude→ChatGPT→DeepSeek→Mistral | Coding projects |
| Learning | 📚 | Gemini→Claude→Perplexity→Mistral | Learning new concepts |
| Data Analysis | 📊 | Claude→DeepSeek→Gemini→Mistral | Data analysis tasks |
| Web Dev | 🌐 | ChatGPT→Claude→DeepSeek→Gemini | Web development |
| Writing | ✍️ | Claude→Mistral→Gemini | Writing & content |

---

## 🔐 SECURITY & PRIVACY

### Current Stage (2B)
- ✅ All data stored locally (browser localStorage)
- ✅ No data sent to external servers
- ✅ Code is visible but contains no secrets
- ⚠️ Code/idea is public (this is development phase)

### Future (Stage 4+)
- ✅ Backend logic hidden (Google Apps Script)
- ✅ OAuth authentication
- ✅ Encrypted API communication
- ✅ Private repository
- ✅ Secure deployment to your system

---

## 📝 DATA STRUCTURE

**localStorage Key:** `appState`

```json
{
  "rooms": {
    "1": {
      "id": 1,
      "title": "Room 1",
      "status": "active",
      "helpers": ["Claude", "ChatGPT", "DeepSeek", "Mistral"],
      "currentAI": "Claude",
      "messageCount": 0,
      "lastRun": "2026-09-28T12:00:00Z",
      "emailsSent": 5,
      "executions": []
    }
  },
  "messages": {
    "1": []
  }
}
```

---

## 📞 CONTACT & SUPPORT

**Developer:** Claude (Anthropic)  
**User:** Shashi Kant Gupta  
**Email:** shashikant15041982@gmail.com  

---

*Last Updated: 2026-09-28 | Session 3 Setup Complete*
