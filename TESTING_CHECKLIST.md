# 🧪 TESTING CHECKLIST

**For use during Claude lockout periods**

---

## 📌 BEFORE YOU START

1. **Visit the live platform:**
   - https://shashikant15041982.github.io/multi-room-platform/

2. **Open DevTools:**
   - Press `F12` (or right-click → Inspect)
   - Go to "Console" tab
   - Keep it open during testing

3. **Clear cache (if needed):**
   - DevTools → Application → Storage → Clear all
   - Refresh page (Ctrl + R)

---

## ✅ SESSION 2 VERIFICATION (Current)

**File:** `index.html` (Email Relay System)

### Test Suite A: Home Page

- [ ] **Load Page**
  - [ ] 3 room cards visible (Room 1, 2, 3)
  - [ ] Each card shows: Status, Last Run, AI Helpers, Email count
  - [ ] No console errors (check Console tab)

- [ ] **Room Card Details**
  - [ ] "Enter Room" button visible on all 3 cards
  - [ ] AI helpers listed correctly (Claude, ChatGPT, DeepSeek, Mistral)
  - [ ] Initial status shows "Empty"

### Test Suite B: Room Interior

- [ ] **Enter Room 1**
  - [ ] 5 tabs visible: CODE, OUTPUT, HISTORY, EMAILS, RELAY
  - [ ] Current tab: CODE (default)
  - [ ] No errors in console

- [ ] **CODE Tab**
  - [ ] Shows prompt input area
  - [ ] Shows [▶ RUN NOW] button
  - [ ] Button is **enabled** (not greyed out)

- [ ] **OUTPUT Tab**
  - [ ] Shows "Mock response from Claude..." initially
  - [ ] No errors

### Test Suite C: Execution

- [ ] **Click [▶ RUN NOW] Button**
  - [ ] Button becomes **disabled** (greyed out)
  - [ ] Wait 2 seconds
  - [ ] Button becomes **enabled** again
  - [ ] Console shows execution log (check for errors)

- [ ] **After Execution:**
  - [ ] Go to HISTORY tab
  - [ ] New execution appears with:
    - [ ] Timestamp (matches current time)
    - [ ] Jobs Found: (number, e.g., 15)
    - [ ] High Match: (number, e.g., 5)
    - [ ] Duration: (e.g., 2 seconds)

- [ ] **Home Page Updates**
  - [ ] Click "Home" (if link exists) or back button
  - [ ] Room 1 card shows updated count
  - [ ] Status changed from "Empty" to "Active"

### Test Suite D: Emails Feature

- [ ] **Go to EMAILS Tab**
  - [ ] New emails logged (count = High Match from execution)
  - [ ] Each email shows:
    - [ ] Timestamp
    - [ ] To: shashikant15041982@gmail.com
    - [ ] Subject: (e.g., "Job Match: RnR Lead at Company X")
    - [ ] Preview: (description of job)
    - [ ] Status: "SENT" ✓

- [ ] **Home Page Email Count**
  - [ ] Go back to home
  - [ ] Room 1 card shows "X Emails Sent" (matches EMAILS tab count)

### Test Suite E: Relay System

- [ ] **Go to RELAY Tab**
  - [ ] Shows relay events (if any)
  - [ ] Initially empty (unless you create 20+ messages first)

- [ ] **Trigger Relay (Advanced)**
  - [ ] Go to HISTORY tab
  - [ ] Click [▶ RUN NOW] multiple times
  - [ ] After 20+ messages, check RELAY tab
  - [ ] Should show: "Claude → ChatGPT (20 messages)"

### Test Suite F: Page Refresh (localStorage Persistence)

- [ ] **Refresh Page** (Ctrl + R)
  - [ ] All data persists (executions, emails, relay events still there)
  - [ ] Home page shows same counts as before
  - [ ] No console errors

- [ ] **Switch Between Rooms**
  - [ ] Enter Room 1, execute something
  - [ ] Switch to Room 2, execute something
  - [ ] Switch back to Room 1
  - [ ] Data for Room 1 still there ✓

### Test Suite G: Error Handling

- [ ] **Check Console for Errors**
  - [ ] Open DevTools Console (F12)
  - [ ] Perform all actions above
  - [ ] Should see NO red errors
  - [ ] Yellow warnings are OK (just informational)

- [ ] **Data Validation**
  - [ ] DevTools → Application → Storage → localStorage
  - [ ] Find "appState" key
  - [ ] Expand it → Should see valid JSON
  - [ ] No corrupted/missing fields

---

## 📊 REPORTING RESULTS

After completing all tests, **create a GitHub Issue with:**

```markdown
## ✅ Testing Results - [DATE]

### Environment
- Browser: [Chrome/Firefox/Safari]
- Date/Time: [when tested]
- Session: 2 (Current)

### Test Status
- [x] Home Page: PASS
- [x] Room Interior: PASS
- [x] Execution: PASS
- [x] Emails: PASS
- [x] Relay: PASS
- [x] Persistence: PASS
- [x] Console Errors: NONE

### Notes
[Any issues or observations]

### Screenshots
[If errors, paste screenshots here]
```

---

## ⏳ SESSION 3 TESTING (After Build)

When Session 3 (Relay Logging Enhancement) is deployed:

### New Tests to Run:

- [ ] **RELAY STATS Tab**
  - [ ] Shows per-AI statistics
  - [ ] Display: AI name, handoffs, messages, context KB
  - [ ] Numbers update after execution

- [ ] **Context Size Tracking**
  - [ ] Execution logs show context KB used
  - [ ] RELAY tab shows: "Claude → ChatGPT | 20 msgs | 4.2 KB"
  - [ ] Calculations are reasonable (not 0, not extreme)

- [ ] **Home Page Indicators**
  - [ ] Room card shows relay count (e.g., "3 handoffs")
  - [ ] Current AI badge shows active AI

---

## 🚀 QUICK CHECKLIST (60 seconds)

If short on time, run this fast version:

- [ ] Page loads, no errors
- [ ] Click [▶ RUN NOW]
- [ ] HISTORY shows new execution
- [ ] EMAILS tab shows email sent
- [ ] Refresh page → data persists
- [ ] All 3 rooms work independently

**If all pass:** Reply "✅ SESSION 2 VERIFIED - All systems working"

**If any fail:** Reply with details + screenshot + console error message

---

## 📝 COMMON ISSUES & SOLUTIONS

| Issue | Solution |
|-------|----------|
| Console errors about localStorage | Clear storage: DevTools → Application → Clear all |
| Button stays disabled | Refresh page (Ctrl+R) |
| Data disappears on refresh | Check if localStorage enabled in browser |
| Executions don't show | Check HISTORY tab is selected |
| No emails created | Check High Match > 0 in execution |

---

## ❓ QUESTIONS?

If anything is confusing:
1. Take a screenshot (Print Screen)
2. Copy the console error message
3. Create a GitHub Issue with details
4. I'll review when available and help fix

---

## 📌 TESTING SCHEDULE

**During Claude Lockout (5-hour window):**
- Test every 2 hours
- Report results on GitHub Issue
- Try different combinations (multiple rooms, rapid clicks, etc.)

**Your feedback during lockout = faster debugging when I'm unlocked**

Thanks for testing! 🚀
