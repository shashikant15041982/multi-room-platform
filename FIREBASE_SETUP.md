# Firebase Setup Guide — Phase 24 Cloud Backup

## Overview
Firebase Realtime Database integration for cloud backup, cross-device sync, and automatic data persistence.

---

## Step 1: Create Firebase Project

1. Go to: https://console.firebase.google.com
2. Click "Add project"
3. Project name: `multi-room-platform`
4. Continue through setup (default settings OK)
5. Create project

---

## Step 2: Enable Realtime Database

1. In Firebase Console → Left sidebar → "Realtime Database"
2. Click "Create Database"
3. Start location: `us-central1` (default)
4. Security rules: **"Start in test mode"** (change later)
5. Click "Enable"
6. Copy your Database URL: `https://YOUR-PROJECT.firebaseio.com`

---

## Step 3: Get Firebase Config

1. Firebase Console → Project Settings (⚙️ icon)
2. Under "Your apps" → Web app icon
3. If no app exists: Click "Add app" → Select "Web"
4. App nickname: `multi-room-platform-web`
5. Check "Also set up Firebase Hosting" (optional)
6. Register app
7. Copy the config object:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project.firebaseio.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

---

## Step 4: Update HTML File

In `index-v2-phase-24.html` (to be created), add Firebase config:

```javascript
// At the top of <script> section, after const declarations
const firebaseConfig = {
  apiKey: "[Your API Key]",
  authDomain: "[Your Auth Domain]",
  databaseURL: "[Your Database URL]",
  projectId: "[Your Project ID]",
  storageBucket: "[Your Storage Bucket]",
  messagingSenderId: "[Your Messaging Sender ID]",
  appId: "[Your App ID]"
};
```

---

## Step 5: Security Rules

In Firebase Console → Realtime Database → Rules tab, replace with:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

---

## Step 6: Test Connection

After deploying Phase 24:
1. Sign up user
2. Create room
3. Go to Firebase Console → Realtime Database
4. Check data appears under `users/{userId}/rooms`

---

## Database Structure

```
firebase
├── users/
│   └── {userId}/
│       ├── email: "user@example.com"
│       ├── lastSync: 1696089600000
│       └── rooms/
│           └── {roomId}/
│               ├── id: "room-1696089600000"
│               ├── name: "Project Alpha"
│               ├── currentAI: "Claude"
│               ├── tokenCount: 45234
│               ├── createdAt: "2026-09-30T18:45:00Z"
│               ├── messages: [...]
│               ├── files: [...]
│               └── _versions: [...]
```

---

## Key Features

### Auto-Sync
- Every room update syncs to cloud
- Real-time listener updates local on changes
- Offline support (sync on reconnect)

### Cross-Device
- Sign in on phone
- Changes sync to desktop
- All devices see latest data

### Version History
- Keep last 5 versions
- Restore from history
- Timestamp tracking

### Conflict Resolution
- Last-write-wins (client)
- Server timestamp for verification
- Merge on conflict

---

## Implementation Checklist

- [ ] Firebase project created
- [ ] Realtime Database enabled
- [ ] Firebase config copied
- [ ] Security rules updated
- [ ] Phase 24 HTML created
- [ ] Firebase library imported
- [ ] Auth initialized
- [ ] Sync functions added
- [ ] Testing completed

---

## Troubleshooting

**"Permission denied" error**:
- Check security rules are set correctly
- Verify auth.uid is populated
- Check database URL in config

**"Data not syncing"**:
- Check network connection
- Verify Firebase is initialized
- Check browser console for errors
- Ensure auth is successful first

**"Quota exceeded"**:
- Firebase free tier has limits
- Move to Blaze plan if needed
- Implement data compression

---

## Cost Estimation (Free Tier)

| Operation | Free Tier Limit |
|-----------|-----------------|
| Concurrent connections | 100 |
| Data stored | 1GB |
| Read/write ops/month | 100,000 |
| Bandwidth | 10GB |

Estimated cost for 100 active users: **FREE** (within limits)

