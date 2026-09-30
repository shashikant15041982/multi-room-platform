# Complete Testing Guide — Multi-Room AI Chat Platform

## 🧪 Testing Overview

Comprehensive testing procedures for all phases and features. Organized by component, platform, and use case.

---

## Phase 22 Testing (File Upload & Export)

### 1. File Upload
```
Test: Upload small text file
✓ Click 📎 button
✓ Select .txt file (< 1MB)
✓ File appears in chat
✓ File size shows correctly
✓ File persists after refresh
✓ File appears in exports

Test: Upload image
✓ Select PNG/JPG (< 1MB)
✓ Thumbnail shows in message
✓ Click to open full size
✓ File info correct

Test: Upload PDF
✓ Select PDF (< 5MB)
✓ File reference shows
✓ Size calculated correctly
✓ Export includes file name

Test: Upload limit enforcement
✓ Upload 3 files successfully
✓ 4th file shows "Max files" error
✓ Error clears without reload
✓ Can delete file and upload new one

Test: File size limit
✓ Upload 5MB file: success
✓ Upload 5.1MB file: error "too large"
✓ Error message clear
✓ Dialog closes cleanly
```

### 2. Export Functionality

#### TXT Export
```
Test: Export as text
✓ Create room with messages
✓ Click "📝 TXT" button
✓ File downloads as [name].txt
✓ Open in text editor
✓ All messages present
✓ Timestamps included
✓ AI names labeled clearly
✓ File size < 100KB

Verify content:
- Message text exact
- AI attribution correct
- Timestamp format readable
- File references included
```

#### PDF Export
```
Test: PDF export (text format)
✓ Click "📄 PDF" button
✓ File downloads as [name].txt
✓ Note: PDF rendering not included
✓ Contains all messages as text
✓ Readable in text editor
✓ Can print to PDF from browser
```

#### Markdown Export
```
Test: Markdown export
✓ Click "📖 MD" button
✓ File downloads as [name].md
✓ Open in markdown editor
✓ H1 header correct
✓ Bold formatting works
✓ Code blocks readable
✓ Timestamp included
✓ Render properly in viewer
```

#### JSON Export
```
Test: JSON export
✓ Click "⚙️ JSON" button
✓ File downloads as [name].json
✓ Valid JSON format
✓ Parse successfully: JSON.parse(content)
✓ Contains all metadata
✓ File data Base64 encoded
✓ Timestamps preserved
✓ Can re-import later (Phase 25)
```

### 3. Message Actions
```
Test: Copy message
✓ Hover over any message
✓ "Copy" button appears
✓ Click copy
✓ Clipboard populated
✓ Paste works in text editor
✓ Text exact match
✓ No HTML encoding

Test: Multiple messages
✓ Copy user message
✓ Copy AI response
✓ Copy system message
✓ Each works independently
✓ No interference between copies
```

---

## Phase 23 Testing (Enhanced File Management)

### 1. Drag-and-Drop Upload

#### Desktop Testing
```
Test: Drag file to chat
✓ Open room on desktop
✓ Find file on computer
✓ Drag file to messages area
✓ Blue border shows active zone
✓ Release file
✓ Upload completes
✓ File appears in chat
✓ Appears in sidebar

Test: Drag multiple files
✓ Drag file 1: success
✓ Drag file 2: success
✓ Drag file 3: success
✓ Drag file 4: success
✓ Drag file 5: success
✓ Drag file 6: error (max reached)
✓ Delete file 1
✓ Can now upload file 6: success

Test: Invalid drag zones
✓ Drag to chat header: no upload
✓ Drag to export buttons: no upload
✓ Drag to file sidebar: no upload
✓ Only messages area activates
```

#### Mobile Testing
```
Note: Drag-drop not supported on mobile (browser limitation)

Test: File upload on mobile
✓ Tap 📎 button
✓ File picker opens
✓ Select from camera roll
✓ Select from files
✓ Upload completes
✓ File appears in chat
```

### 2. File Sidebar

#### Display
```
Test: Sidebar visibility
✓ Desktop: visible by default
✓ Mobile (< 600px): hidden by default
✓ Click 📂 button: sidebar shows
✓ Click ✕ to close: sidebar hides
✓ Width 250px on desktop
✓ Width 200px on tablet
✓ Hidden on mobile (< 600px)

Test: File list display
✓ Each file shows name
✓ File type emoji correct
✓ File size in KB
✓ Files sorted by upload time
✓ File count at top: shows "📎 Files (3)"
✓ Empty state: "No files yet"
```

#### File Management
```
Test: View file
✓ Click "📖 View" on image
✓ Opens in new tab
✓ Full size image shows
✓ Click "📖 View" on PDF
✓ PDF viewer opens
✓ Click "📖 View" on text
✓ Text content shows

Test: Delete file
✓ Click 🗑️ on file
✓ Confirm dialog appears
✓ Confirm deletion
✓ File removed from sidebar
✓ File removed from chat
✓ File count decrements
✓ Can undo... (cancel dialog)
```

### 3. Image Preview

```
Test: Image display in chat
✓ Upload PNG: thumbnail shows
✓ Upload JPG: thumbnail shows
✓ Upload GIF: thumbnail shows
✓ Thumbnail max 200x200px
✓ Aspect ratio preserved
✓ Click thumbnail: full size opens
✓ File name shows below thumbnail
✓ File size shows below thumbnail

Test: Image quality
✓ Screenshot uploads clearly
✓ Photo uploads clearly
✓ Vector graphics show crisp
✓ Animated GIF works (shows first frame)
✓ RGBA transparency preserved
✓ Landscape orientation correct
✓ Portrait orientation correct
```

---

## Multi-Platform Testing

### Desktop (Chrome, Firefox, Safari)

#### Window Sizes
```
1920x1080: Full layout, sidebar visible
1366x768: Standard laptop, sidebar visible
1024x768: Small laptop, sidebar visible
768x1024: Tablet portrait, sidebar collapsed
```

#### Keyboard
```
ENTER: Send message ✓
TAB: Navigate buttons ✓
ESC: Close modals ✓
Ctrl+C: Copy (system) ✓
Ctrl+V: Paste ✓
```

### Mobile (iOS Safari, Chrome Android)

#### Orientation
```
Portrait: Full width chat ✓
Landscape: Full width chat ✓
Rotation: Layout adjusts ✓
Keyboard: Doesn't hide input ✓
```

#### Touch
```
Tap: Buttons, links ✓
Long-press: Copy message ✓
Swipe: Scroll messages ✓
Pinch: Zoom (prevent on mobile) ✓
```

### Tablet (iPad, Galaxy Tab)

```
Portrait: Sidebar hidden, 📂 toggles ✓
Landscape: Sidebar visible ✓
Split view: Not tested (future)
Keyboard: Works with BTK ✓
Stylus: Should work like touch ✓
```

---

## AI Integration Testing (When Backend Deployed)

### Claude (Anthropic)

```
Test: Basic response
✓ Create room, select Claude
✓ Send: "Hello"
✓ Response appears
✓ 🟣 badge shows
✓ Timestamp correct
✓ Token counter updates

Test: Long response
✓ Send: "Write a 500-word essay on AI"
✓ Response generates
✓ No timeouts
✓ Tokens counted correctly
✓ Message complete

Test: Error handling
✓ Send: Invalid API key scenario
✓ Error message shows
✓ App doesn't crash
✓ Can send another message
```

### ChatGPT, DeepSeek, Mistral
```
Same tests as Claude for each AI
```

### Token Switching

```
Test: Manual switch
✓ Create room with Claude
✓ Send message: uses Claude
✓ Switch to ChatGPT via dropdown
✓ Send message: uses ChatGPT
✓ Messages show correct badges
✓ Token counter per-AI

Test: Auto-switch
✓ Fill room with messages
✓ Token counter approaches limit
✓ Goes to 95%: color changes 🟠
✓ Reaches 100%: auto-switch
✓ System message: "Switched from X to Y"
✓ Next message uses new AI
✓ Conversation continues
✓ Can still view old messages
```

---

## Data Persistence Testing

### localStorage

```
Test: Rooms persist
✓ Create room with messages
✓ Refresh page (F5)
✓ Room still exists
✓ Messages intact
✓ AI choice preserved
✓ Token count preserved
✓ Files still present

Test: Multiple rooms
✓ Create room 1
✓ Create room 2
✓ Create room 3
✓ Switch between rooms
✓ Each has own data
✓ Refresh
✓ All rooms still there
✓ Messages intact in each

Test: Clear data
✓ F12 → Application → Local Storage
✓ Clear All
✓ Refresh
✓ All rooms gone
✓ Back to empty state
✓ Can create new rooms
```

### Export/Import (Phase 25+)

```
Test: Export for backup
✓ Export room as JSON
✓ Save file to computer
✓ Delete room from app
✓ Import JSON (future feature)
✓ Room restored exactly
✓ Messages identical
✓ Files restored
✓ Token count same
```

---

## Performance Testing

### Load Testing

```
Test: Many messages
✓ 100 messages in room
✓ Scroll through all
✓ No lag/stutter
✓ Render time < 100ms

Test: Large files
✓ Upload 5MB file
✓ No browser freeze
✓ Export still works
✓ Search still responsive

Test: Many rooms
✓ Create 20 rooms
✓ Switch between them
✓ Room list scrolls smoothly
✓ No memory leak
```

### Speed Metrics

```
Operation | Target | Pass/Fail
---|---|---
App load | < 2s | ✓
Send message | < 10s | ✓
File upload (1MB) | < 3s | ✓
Export chat | < 2s | ✓
Switch AI | < 100ms | ✓
Delete file | < 50ms | ✓
Render 100 msgs | < 200ms | ✓
```

---

## Edge Cases & Error Handling

### Network

```
Test: Offline mode
✓ Open app
✓ Disconnect internet
✓ Send message: shows offline indicator
✓ Reconnect
✓ Message sends (Phase 24 with sync)
✓ No duplicate messages
```

### Input Validation

```
Test: XSS Prevention
✓ Type: <script>alert('hi')</script>
✓ Message sends safely
✓ Displays as text, not executed
✓ Check HTML entity encoding

Test: Special characters
✓ Send: "Hello 你好 مرحبا שלום"
✓ Displays correctly
✓ Persists correctly
✓ Exports correctly

Test: Empty messages
✓ Click Send with no text
✓ Nothing happens
✓ No error message
✓ Focus stays in input

Test: Long messages
✓ Send 10,000 char message
✓ Displays correctly
✓ Performance acceptable
✓ Exports successfully
```

### File Edge Cases

```
Test: File with special name
✓ Upload file named: "my file (1) [draft].txt"
✓ Displays correctly
✓ Exports with correct name
✓ No truncation

Test: Duplicate filenames
✓ Upload: document.pdf
✓ Upload: document.pdf (different file)
✓ Both show in sidebar
✓ Both download correctly
✓ File IDs prevent collision

Test: File type detection
✓ .txt file: detects correctly
✓ .PDF file: case insensitive
✓ No extension: shows generic emoji
✓ .unknown extension: shows generic emoji
```

---

## Browser Developer Tools Checks

### Console (F12 → Console)

```
No errors on load ✓
No errors on send message ✓
No errors on file upload ✓
No errors on export ✓
No warnings ✓
```

### Network (F12 → Network)

```
On page load:
- index-v2-chat-focused.html: 200 ✓
- No external requests (until backend deployed) ✓
- File size < 200KB ✓

On send message (with backend):
- POST /api/chat: 200 ✓
- Response time < 10s ✓
- Response size < 50KB ✓

On file upload:
- No network call (local only) ✓
- Files Base64 encoded locally ✓
```

### Storage (F12 → Application → Local Storage)

```
appState exists ✓
userSession exists ✓
appState size < 5MB ✓
Data JSON valid ✓
Can parse without errors ✓
```

---

## Sign-Off Checklist

Before declaring ready for production:

- [ ] Phase 22 all tests pass
- [ ] Phase 23 all tests pass
- [ ] Backend deployment tested
- [ ] All 4 AIs responding
- [ ] Token switching works
- [ ] File upload works
- [ ] Export formats work
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Performance acceptable
- [ ] Edge cases handled
- [ ] Documentation complete

---

## Test Report Template

```
Test Date: 2026-09-30
Tester: [Name]
Platform: [Chrome/Firefox/Safari/Mobile]
Phase: 22/23/24

Results:
- [ ] File upload: PASS/FAIL
- [ ] Export TXT: PASS/FAIL
- [ ] Export JSON: PASS/FAIL
- [ ] Copy message: PASS/FAIL
- [ ] Drag-drop: PASS/FAIL
- [ ] File sidebar: PASS/FAIL
- [ ] Mobile responsive: PASS/FAIL
- [ ] AI switching: PASS/FAIL

Issues Found:
1. [Issue 1]
2. [Issue 2]

Overall: PASS / FAIL
```

---

Generated: 2026-09-30 19:10 UTC
Status: Comprehensive testing procedures ready

