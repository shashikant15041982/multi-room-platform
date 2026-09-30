# 📁 PHASE 22: FILE UPLOAD & EXPORT — IN PROGRESS

**Status**: Planning & Design | **Features**: Upload, Export, Share

---

## 📋 What Will Be Built

### Feature 1: Document Upload
```
User can upload files to chat:
- PDFs
- Text files (.txt, .md)
- Word documents (.docx)
- Images (.png, .jpg)
- CSVs

Files stored in localStorage (base64)
Displayed in chat as attachments
Sent to AI as context
```

### Feature 2: Chat Export
```
Export entire conversation as:
- PDF (formatted, ready to print)
- TXT (plain text)
- MD (markdown, for docs)
- JSON (raw data, for backup)

One-click download
Includes timestamps, AI names, tokens
Ready to share
```

### Feature 3: Message Sharing
```
Copy message to clipboard
Share individual message
Generate shareable links
Print conversation
```

---

## 🎯 Implementation Plan

### Frontend Changes
1. Add file upload button
2. Display file preview
3. Add export buttons
4. File management UI
5. Share/copy controls

### Backend Changes
1. Accept file uploads
2. Parse PDFs (if needed)
3. Send file context to AI
4. Return processed content

### Storage
1. Store files in localStorage (base64)
2. Max 5MB per file
3. Limit 3 files per room
4. Compress images

---

## 🔧 Rough Implementation

### File Upload Button
```html
<div class="file-area">
  <input type="file" id="fileInput" accept=".pdf,.txt,.md,.csv,.jpg,.png,.docx">
  <button onclick="uploadFile()">📎 Attach File</button>
</div>
```

### Export Buttons
```html
<div class="export-buttons">
  <button onclick="exportPDF()">📄 Export as PDF</button>
  <button onclick="exportTXT()">📝 Export as TXT</button>
  <button onclick="exportMD()">📖 Export as MD</button>
  <button onclick="exportJSON()">⚙️ Export as JSON</button>
</div>
```

### File Display in Chat
```javascript
if (msg.type === 'file') {
  return `<div class="message file">
    <span class="file-icon">📎</span>
    <div class="file-info">
      <div class="file-name">${msg.filename}</div>
      <div class="file-size">${msg.size} bytes</div>
    </div>
  </div>`;
}
```

---

## 📊 Data Structure Changes

### Message Object (New Fields)
```javascript
{
  type: 'file',           // NEW TYPE
  filename: 'data.pdf',
  filesize: 245600,
  mimetype: 'application/pdf',
  content: 'base64encoded...',  // base64 string
  uploadedAt: '2026-09-30T...',
  uploadedBy: 'user'
}
```

### Room Object (New Fields)
```javascript
{
  id: '...',
  name: '...',
  files: [          // NEW
    {
      id: 'file-1',
      name: 'data.pdf',
      size: 245600,
      uploaded: '2026-09-30T...'
    }
  ],
  exportHistory: [] // NEW: track exports
}
```

---

## 🎨 UI Layout

### Chat Screen (With File Upload)
```
┌─────────────────────────────────┐
│  ← Chat Title     🟣 Claude     │  (header)
├─────────────────────────────────┤
│                                 │
│  Messages here...               │
│                                 │
├─────────────────────────────────┤
│ 📎  [file input]  [Attach]      │  (NEW: file upload)
├─────────────────────────────────┤
│ [Text input......] [Send]       │
├─────────────────────────────────┤
│ 📄 PDF | 📝 TXT | 📖 MD | ⚙️ JSON│ (NEW: export buttons)
└─────────────────────────────────┘
```

---

## 🧪 Testing Scenarios

### Test 1: Upload PDF
```
1. Click "Attach File" button
2. Select a PDF from computer
3. File preview shows in chat
4. Can send message with file
5. AI can see file name & context
```

### Test 2: Export as PDF
```
1. Have a conversation in room
2. Click "Export as PDF"
3. Browser downloads formatted PDF
4. PDF includes: date, messages, AI names
```

### Test 3: Export as JSON
```
1. Click "Export as JSON"
2. Browser downloads raw JSON
3. Contains all metadata
4. Can re-import later
```

### Test 4: Share Message
```
1. Right-click message
2. "Copy to clipboard"
3. Message copied
4. Can paste elsewhere
```

---

## ⚠️ Considerations

### File Size Limits
- Single file: max 5MB
- Total per room: max 15MB
- Stored in localStorage (limited capacity)

### Supported Formats
- ✅ Text: .txt, .md
- ✅ Data: .csv, .json
- ✅ Images: .png, .jpg
- ✅ Documents: .pdf, .docx
- ❌ Video: too large
- ❌ Audio: too large

### Export Format Quality
- PDF: Professional formatted
- TXT: Plain text, easy to share
- MD: Markdown, for docs
- JSON: Complete backup

---

## 🚀 Implementation Order

1. **Add file upload UI** (button, input)
2. **Handle file selection** (validate, preview)
3. **Store in localStorage** (base64 encoding)
4. **Display in chat** (show attachments)
5. **Export as PDF** (using jsPDF library)
6. **Export as TXT** (simple text format)
7. **Export as MD** (markdown format)
8. **Export as JSON** (raw data)
9. **Share buttons** (copy to clipboard)
10. **Error handling** (file size, format)

---

## 📚 Libraries Needed

### For PDF Export
- `jsPDF` (or `pdfkit`)
- Handles formatting & layout

### For File Upload
- Native FileReader API (no library needed)

### For CSV/Data
- Papaparse (CSV parsing)
- Optional

---

## 🎯 Success Criteria

- [ ] Upload button appears in chat
- [ ] Can select files from computer
- [ ] File appears in message thread
- [ ] Export buttons generate downloadable files
- [ ] PDF looks professional
- [ ] TXT is plain & readable
- [ ] JSON is valid & complete
- [ ] MD preserves formatting
- [ ] File limits are enforced
- [ ] Works on mobile

---

## 📝 Next Steps After Phase 22

### Phase 23: Cloud Backup
- Firebase storage
- Cross-device sync
- Auto-backup
- Restore from backup

### Phase 24: Collaboration
- Share rooms with users
- Invite to conversations
- Real-time sync
- Permissions/roles

---

**Status**: Design Complete | Next: Implementation

