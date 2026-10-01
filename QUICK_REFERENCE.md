# Quick Reference Guide — Multi-Room AI Chat Platform

## 🎯 Essential Links

| Resource | URL |
|----------|-----|
| **Live App** | https://shashikant15041982.github.io/multi-room-platform/index-v2-chat-focused.html |
| **GitHub Repo** | https://github.com/shashikant15041982/multi-room-platform |
| **Claude API** | https://console.anthropic.com |
| **OpenAI API** | https://platform.openai.com/account/api-keys |
| **DeepSeek API** | https://platform.deepseek.com/api_keys |
| **Mistral API** | https://console.mistral.ai/api-keys |
| **Replit** | https://replit.com |

---

## 📋 Room Creation (5 seconds)

1. Click **"+ New"** button
2. Pick AI: 🟣 Claude, 🟢 ChatGPT, 🟠 DeepSeek, 🔴 Mistral
3. Enter room name (e.g., "Project Alpha")
4. Click **"Create"**
5. Start chatting!

---

## 💬 Sending Messages

```
1. Type message in input box
2. Press ENTER or click "Send"
3. Wait for AI response
4. See AI badge (which AI responded)
5. Token counter updates
```

**Keyboard Shortcut**: ENTER sends message

---

## 🤖 AI Switching

### Manual Switch
1. Open room
2. Use dropdown: **🟣 Claude** | **🟢 ChatGPT** | **🟠 DeepSeek** | **🔴 Mistral**
3. Messages continue in same room

### Auto Switch (at token limit)
- When AI hits 95% token limit → automatically switch to next AI
- System message shows: "Switched from Claude to ChatGPT"
- Conversation continues seamlessly
- Order: Claude → ChatGPT → DeepSeek → Mistral → Claude (repeats)

**Token Limits**:
- 🟣 Claude: 100,000 tokens
- 🟢 ChatGPT: 120,000 tokens
- 🟠 DeepSeek: 60,000 tokens
- 🔴 Mistral: 80,000 tokens

---

## 📊 Token Counter

```
Indicator Colors:
🟢 Green:  < 80% (Normal)
🟠 Orange: 80-95% (Warning)
🔴 Red:    > 95% (Critical)
```

**Token Estimate**: ~4 characters = 1 token

---

## 📎 File Upload

```
1. Click "📎" button in chat
2. Select file (max 5MB)
3. File appears in chat
4. Can upload up to 3 files per room
5. Files stored in room metadata
```

**Supported**: PDF, TXT, DOCX, images, JSON, etc.

---

## 💾 Export Chat

**4 Format Options**:

### 📄 PDF (Text Format)
- Professional layout
- Full message history
- Best for printing/archiving
- Filename: `RoomName.txt`

### 📝 TXT (Simple Text)
- Plain text format
- Smallest file size
- Quick sharing
- Filename: `RoomName.txt`

### 📖 Markdown (Documentation)
- Professional formatting
- H1 headers, timestamps
- Great for knowledge bases
- Filename: `RoomName.md`

### ⚙️ JSON (Data Dump)
- Complete metadata
- Machine-readable
- Analysis ready
- Filename: `RoomName.json`

**Usage**: Click button at bottom → File downloads

---

## 📋 Message Actions

**Copy Message**:
1. Hover over any message
2. Click "Copy" button
3. Message copies to clipboard
4. Paste anywhere

---

## 🔐 Login & Logout

**Sign In**:
1. Open app
2. Enter email
3. Click "Sign In"
4. See your rooms

**Sign Out**:
1. In room list
2. Click "Logout"
3. Data stays saved
4. Sign in again to restore

---

## 🗑️ Room Management

**Delete Room** (coming Phase 23):
```
Currently: Delete localStorage data to clear all rooms
Upcoming: Delete button in room context menu
```

**Rename Room** (coming Phase 23):
```
Currently: Create new room, copy messages
Upcoming: Edit room name in place
```

---

## 📱 Mobile Usage

- **Responsive**: Works on all screen sizes
- **Mobile Browser**: Chrome, Safari on iOS
- **Portrait Mode**: Optimized for vertical
- **Touch**: Tap buttons, input via keyboard

**Known Limitation**: File drag-drop only on desktop

---

## 🔧 Browser Storage

**Stored Locally** (in browser, not cloud):
- All conversations
- Room metadata
- File data (Base64 encoded)
- User email & session

**Storage Limit**: ~5-10MB per user

**Clear Storage**:
```
F12 → Application → Local Storage → 
Right-click → Clear All → Confirm
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| No AI response | Check API_URL is correct, restart Replit |
| Token limit stuck at 100% | Clear localStorage, create new room |
| File upload fails | File > 5MB? Room has < 3 files? |
| Export is empty | Room needs messages first |
| Can't sign in | Clear cookies, try different email |
| App is slow | Clear browser cache, refresh page |
| Rooms disappeared | Check localStorage not cleared |

---

## 🚀 Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| ENTER | Send message |
| Ctrl+Shift+Delete | Clear browser data |
| F12 | Open Developer Tools |

---

## 💡 Tips & Tricks

1. **Long Research**: Use AI switching to continue past token limit
2. **Format Output**: Ask AI for Markdown/JSON for easier export
3. **Backup Often**: Export important chats as JSON
4. **Room Organization**: Use descriptive names ("Project Alpha", "Research Q4")
5. **Copy & Paste**: Copy AI responses directly into documents
6. **Mobile**: Save bookmark for quick access

---

## 📊 Performance Targets

| Metric | Target |
|--------|--------|
| Send message → response | ~5-10 seconds |
| Switch AI | < 100ms |
| Export chat | ~2-3 seconds |
| Upload file | ~2-5 seconds |
| App load time | ~1-2 seconds |

---

## 🎓 Learning Path

1. **Day 1**: Create room, chat with Claude
2. **Day 2**: Try all 4 AIs, note differences
3. **Day 3**: Upload file, export as Markdown
4. **Day 4**: Create multiple rooms for projects
5. **Day 5**: Use AI switching for long research
6. **Week 2**: Integrate into daily workflow

---

## 📞 Support

| Issue | Resources |
|-------|-----------|
| API Keys | See DEPLOYMENT_CHECKLIST.md |
| Replit Setup | See QUICK_START_DEPLOYMENT.md |
| Features | See PHASE_22_COMPLETE.md |
| Architecture | See README_BACKEND.md |
| Roadmap | See FEATURES_ROADMAP.md |

---

## 🎯 Your Current Status

✅ **Phase 22 Complete**:
- File upload (5MB, 3 per room)
- 4-format export (PDF/TXT/MD/JSON)
- Message copy to clipboard
- File tracking & metadata

⏳ **Next Phase 23**:
- Drag-and-drop upload
- Image preview
- PDF extraction
- File management UI

---

**Last Updated**: 2026-09-30 18:52 UTC
**Version**: 2.0 (v2-chat-focused)
**Status**: Ready for Deployment ✅

