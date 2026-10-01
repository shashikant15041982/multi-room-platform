# Deployment Checklist — Multi-Room AI Chat Platform

## Pre-Deployment (Before Replit)

### 1. API Keys Acquisition
```
☐ Claude (Anthropic)
  - Go to: https://console.anthropic.com/account/keys
  - Create new key
  - Name: "multi-room-platform"
  - Copy full key

☐ ChatGPT (OpenAI)
  - Go to: https://platform.openai.com/account/api-keys
  - Create new secret key
  - Note: Will only show once
  - Copy immediately

☐ DeepSeek
  - Go to: https://platform.deepseek.com/api_keys
  - Create API key
  - Copy key

☐ Mistral AI
  - Go to: https://console.mistral.ai/api-keys
  - Create new key
  - Copy key
```

### 2. Verify Backend Code
```javascript
// In server.js - confirm all endpoints exist:
☐ POST /api/chat           // Main chat endpoint
☐ GET /api/models          // List available models
☐ GET /api/health          // Health check
☐ Error handling          // 500 vs 400 vs 401 responses
☐ CORS headers            // Allow frontend origin
```

### 3. Test Locally (Node.js)
```bash
☐ Install dependencies: npm install
☐ Create .env with all 4 API keys
☐ Start server: node server.js
☐ Test endpoint: curl http://localhost:3000/api/health
☐ Test chat: curl -X POST http://localhost:3000/api/chat ...
☐ Monitor logs for errors
```

---

## Replit Deployment Steps

### Step 1: Create Replit Project
1. Go to https://replit.com
2. Click "+ Create" → select "Node.js"
3. Name: `multi-room-platform`
4. Click "Create Replit"

### Step 2: Upload Files
1. In Replit, create new files:
   ```
   ☐ server.js (copy from local)
   ☐ package.json (copy from local)
   ☐ .env (create fresh, add API keys)
   ```
2. Or git clone:
   ```bash
   git clone https://github.com/shashikant15041982/multi-room-platform.git
   cd multi-room-platform
   ```

### Step 3: Set Environment Variables (Secrets)
In Replit Secrets (🔒 icon):
```
ANTHROPIC_API_KEY = [paste key from Step 1]
OPENAI_API_KEY = [paste key from Step 1]
DEEPSEEK_API_KEY = [paste key from Step 1]
MISTRAL_API_KEY = [paste key from Step 1]
PORT = 3000
```

### Step 4: Install Dependencies
In Replit console:
```bash
npm install
```

### Step 5: Start Server
```bash
node server.js
```

Expected output:
```
🚀 Multi-AI backend running on port 3000
✅ All 4 AI APIs connected
```

### Step 6: Get Replit URL
- Replit automatically gives you a public URL
- Format: `https://[project-name]-[random].replit.dev`
- Copy this URL

### Step 7: Update Frontend
In `index-v2-chat-focused.html`, find line:
```javascript
const API_URL = 'http://localhost:3000';
```

Replace with:
```javascript
const API_URL = 'https://[your-replit-url]';
```

### Step 8: Deploy to GitHub
```bash
git add -A
git commit -m "Deploy: Update API_URL to Replit"
git push https://[TOKEN]@github.com/shashikant15041982/multi-room-platform.git main
```

---

## Testing After Deployment

### 1. Backend Health Check
```bash
curl https://[your-replit-url]/api/health
# Should return: { "status": "ok", "version": "1.0" }
```

### 2. Test Each AI
```bash
# Test Claude
curl -X POST https://[your-replit-url]/api/chat \
  -H "Content-Type: application/json" \
  -d '{"ai":"Claude","messages":[{"role":"user","content":"Say hello"}]}'

# Test ChatGPT
curl -X POST https://[your-replit-url]/api/chat \
  -H "Content-Type: application/json" \
  -d '{"ai":"ChatGPT","messages":[{"role":"user","content":"Say hello"}]}'

# Test DeepSeek
curl -X POST https://[your-replit-url]/api/chat \
  -H "Content-Type: application/json" \
  -d '{"ai":"DeepSeek","messages":[{"role":"user","content":"Say hello"}]}'

# Test Mistral
curl -X POST https://[your-replit-url]/api/chat \
  -H "Content-Type: application/json" \
  -d '{"ai":"Mistral","messages":[{"role":"user","content":"Say hello"}]}'
```

### 3. Frontend Testing
1. Go to: https://shashikant15041982.github.io/multi-room-platform/index-v2-chat-focused.html
2. Sign in with email
3. Create a new room (select each AI)
4. Send test messages to each AI
5. Verify responses appear
6. Test file upload
7. Test export (all 4 formats)
8. Check token counter updates
9. Test AI switching at token limit

### 4. Load Testing
Test with multiple concurrent users:
```bash
# Install Apache Bench
# Ubuntu: sudo apt install apache2-utils
# macOS: brew install httpd

# Send 100 requests, 10 concurrent
ab -n 100 -c 10 https://[your-replit-url]/api/health
```

Expected: Response time < 500ms, 0 failures

---

## Common Issues & Solutions

### Issue 1: "Cannot connect to API"
```
❌ Error: Failed to fetch from API_URL

Solution:
1. Check Replit server is running (green "Run" button)
2. Verify API_URL in frontend matches Replit URL
3. Check CORS headers in server.js
4. Wait 30 seconds for cold start (Replit sleeps after 1 hour)
5. Restart Replit server
```

### Issue 2: "API Key Invalid"
```
❌ Error: 401 Unauthorized / Invalid API Key

Solution:
1. Verify API key in Replit Secrets (copy full key, no extra spaces)
2. Check key hasn't expired on provider website
3. Verify key is for correct model:
   - Claude: console.anthropic.com
   - ChatGPT: platform.openai.com
   - DeepSeek: platform.deepseek.com
   - Mistral: console.mistral.ai
4. Regenerate key if unsure
```

### Issue 3: "Token limit reached instantly"
```
❌ Messages not sending, token warning immediately

Solution:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Clear localStorage: 
   - F12 → Application → Local Storage → Delete all
3. Create new room
4. Token counter should reset to 0
```

### Issue 4: "File upload not working"
```
❌ Click upload button, nothing happens

Solution:
1. Check browser console (F12) for errors
2. Verify file is < 5MB
3. Check room has < 3 files
4. Try PNG/TXT first (simplest formats)
5. Check localStorage isn't full
```

### Issue 5: "Export downloads empty file"
```
❌ Export file is 0 bytes or corrupted

Solution:
1. Ensure chat has messages
2. Try different export format (TXT → JSON)
3. Check browser console for errors
4. Verify room data in localStorage:
   - F12 → Application → Storage → Local Storage
   - Look for 'appState' key
5. If data missing, re-enter messages
```

---

## Monitoring & Maintenance

### Daily Checks (After Launch)
- [ ] Replit server status (green dot)
- [ ] API response time < 500ms
- [ ] Error logs in Replit console
- [ ] No failed API authentications
- [ ] Storage usage < 90%

### Weekly Checks
- [ ] Check GitHub for issues
- [ ] Review API usage (free tier limits)
- [ ] Backup data (export from active rooms)
- [ ] Test file upload/export
- [ ] Verify all 4 AIs responding

### Monthly Checks
- [ ] Review performance metrics
- [ ] Clean up old sessions
- [ ] Update API keys if expiring
- [ ] Security audit
- [ ] Plan next phase features

---

## Scaling Considerations

### Current Limits
- localStorage: ~5-10MB per user
- API rate limits: Varies by AI (100-1000 req/day)
- Replit concurrent: ~100 users on free tier
- Message history: No limit (stored locally)

### When to Upgrade
- [ ] > 1000 users → Firebase backend
- [ ] > 10MB data → Cloud storage
- [ ] > 100 req/sec → Load balancer
- [ ] > 10 active rooms → Redis cache

---

## Rollback Plan

If deployment fails:
```
1. Revert GitHub commit:
   git revert [commit-hash]
   git push

2. Redeploy old frontend version

3. Check server logs:
   Replit console → View logs

4. Restart Replit:
   Ctrl+C → node server.js

5. Clear browser cache:
   Ctrl+Shift+Delete
```

---

## Success Indicators ✅

After deployment, verify:
- [x] Can sign in with email
- [x] Can create rooms
- [x] Can select AI for each room
- [x] Can send messages
- [x] Receive responses from Claude
- [x] Receive responses from ChatGPT
- [x] Receive responses from DeepSeek
- [x] Receive responses from Mistral
- [x] Token counter updates
- [x] AI switch works manually
- [x] AI switch works auto at limit
- [x] Can upload files
- [x] Can export as TXT
- [x] Can export as JSON
- [x] Can export as Markdown
- [x] Can export as PDF
- [x] Messages persist after refresh
- [x] Data persists across devices (after Phase 23/24)

---

## Support & Debugging

### Check Logs
```bash
# Replit Logs
- Console tab shows all outputs
- Errors appear in red
- API responses shown with timestamps

# Browser Logs
- F12 → Console
- Check for fetch errors
- Look for CORS issues
- Network tab shows API calls
```

### Debug Endpoints
```
Health: GET [URL]/api/health
Models: GET [URL]/api/models
Chat: POST [URL]/api/chat (test with curl)
```

---

Last Updated: 2026-09-30 18:50 UTC
