# Phase 25: Team Collaboration — Design & Specification

**Status**: 📋 DESIGN PHASE  
**Date**: 2026-09-30  
**Target Implementation**: Phase 25+

---

## 🎯 Vision

Enable teams to collaborate on shared AI chat rooms:
- Share rooms with team members
- Real-time collaborative editing
- Granular permissions (view/edit/admin)
- Comment threads on messages
- Activity log & presence
- Role-based access control

---

## 📊 Architecture Overview

### Current (Phase 24)
```
User Account (Firebase Auth)
└─ Rooms (owned by user)
   └─ Messages (created by user)
```

### Phase 25 (Proposed)
```
User Account (Firebase Auth)
├─ Owned Rooms
│  └─ Members (shared)
│     ├─ View access
│     ├─ Edit access
│     └─ Admin access
│
└─ Shared Rooms
   ├─ Other owner's room
   ├─ View messages
   └─ Add comments/reactions
```

---

## 🔑 Core Features

### 1. Room Sharing

#### Share Dialog
```
Share Room: "Project Alpha"
├─ Copy link: [Link icon] shared-room-abc123
├─ Invite members
│  ├─ Email: user@example.com
│  └─ Role: [View | Edit | Admin]
└─ Current members (3)
   ├─ alice@example.com (Owner)
   ├─ bob@example.com (Edit)
   └─ charlie@example.com (View)
```

#### Permissions Model
```
Role      | View | Comment | Edit | Delete | Manage
----------|------|---------|------|--------|-------
Owner     |  ✅  |   ✅    |  ✅  |   ✅   |   ✅
Admin     |  ✅  |   ✅    |  ✅  |   ✅   |   ✅
Edit      |  ✅  |   ✅    |  ✅  |   ❌   |   ❌
Comment   |  ✅  |   ✅    |  ❌  |   ❌   |   ❌
View      |  ✅  |   ❌    |  ❌  |   ❌   |   ❌
```

### 2. Real-Time Presence

#### Presence Status
```
Message area shows:
👤 alice@example.com (viewing)
👤 bob@example.com (typing...)
```

#### Activity Indicator
```
Room card shows:
📋 Project Alpha
👥 3 members, 2 online
⚡ last activity: 2m ago
```

### 3. Comment Threads

#### Message Comments
```
Message: "Can you summarize this?"
└─ Comments (2)
   ├─ bob@example.com (5m ago)
   │  "I'll work on this"
   │  └─ Reply from alice (4m ago)
   │     "Thanks!"
   └─ charlie@example.com (2m ago)
      "Maybe add examples?"
```

### 4. Activity Log

#### Room Activity Timeline
```
Room: Project Alpha
├─ 14:30 alice: Added bob@example.com (Edit)
├─ 14:32 bob: Sent message
├─ 14:35 alice: Sent message
├─ 14:40 charlie: Viewed room
├─ 14:42 bob: Changed AI to ChatGPT
└─ 14:45 charlie: Added comment
```

### 5. Notifications

#### Real-Time Notifications
```
User receives notification when:
- Added to shared room
- Room permissions changed
- New message in shared room
- Comment on their message
- Room owner deleted room
```

#### Notification Preferences
```
Settings → Notifications
├─ New messages in shared rooms: ON
├─ Comments on my messages: ON
├─ Permission changes: ON
├─ Activity summary (daily): OFF
└─ Email notifications: OFF
```

---

## 💾 Data Model

### Shared Room Structure (Firebase)

```javascript
{
  rooms: {
    "room-123": {
      // Original room data
      id: "room-123",
      name: "Project Alpha",
      ownerId: "user-alice",
      messages: [...],
      currentAI: "Claude",
      
      // Phase 25 additions
      isShared: true,
      members: {
        "user-alice": {
          email: "alice@example.com",
          role: "owner",
          joinedAt: "2026-09-30T10:00:00Z",
          lastActive: "2026-09-30T15:30:00Z"
        },
        "user-bob": {
          email: "bob@example.com",
          role: "edit",
          joinedAt: "2026-09-30T11:00:00Z",
          lastActive: "2026-09-30T15:25:00Z"
        },
        "user-charlie": {
          email: "charlie@example.com",
          role: "view",
          joinedAt: "2026-09-30T12:00:00Z",
          lastActive: "2026-09-30T15:20:00Z"
        }
      },
      
      // Share link
      shareLink: "shared-room-abc123",
      shareSettings: {
        isPublic: false,
        requireApproval: false,
        allowComments: true,
        allowExport: true
      },
      
      // Activity tracking
      activityLog: [
        {
          timestamp: "2026-09-30T14:30:00Z",
          userId: "user-alice",
          action: "add_member",
          details: { memberId: "user-bob", role: "edit" }
        }
      ]
    }
  },
  
  // Comments (separate collection)
  roomComments: {
    "room-123": {
      "msg-456": {
        "comment-789": {
          authorId: "user-bob",
          text: "I'll work on this",
          timestamp: "2026-09-30T14:32:00Z",
          replies: {
            "reply-001": {
              authorId: "user-alice",
              text: "Thanks!",
              timestamp: "2026-09-30T14:35:00Z"
            }
          }
        }
      }
    }
  },
  
  // Presence (temporary, expires)
  presence: {
    "room-123": {
      "user-alice": {
        status: "viewing",
        lastUpdate: "2026-09-30T15:30:00Z"
      },
      "user-bob": {
        status: "typing",
        lastUpdate: "2026-09-30T15:30:05Z"
      }
    }
  }
}
```

---

## 🎨 UI Changes

### Room List (Updated)
```
📋 Owned Rooms
├─ 📄 Project Alpha (3 members, 2 online)
├─ 📄 Research Doc (1 member)
└─ 📄 Quick Notes

📤 Shared Rooms (Invited To)
├─ 🔒 Team Strategy (owner: alice@example.com)
├─ 🔓 Public Research (owner: bob@example.com)
└─ 🔐 Confidential (owner: charlie@example.com)
```

### Chat Header (Updated)
```
[← Back] Project Alpha    [AI selector] [Share 👥] [Settings ⚙️]
                          [👥 3 members, 2 online | ✅ Syncing]
```

### Share Modal (New)
```
╔═══════════════════════════════════╗
║     Share "Project Alpha"         ║
╠═══════════════════════════════════╣
║ Copy link:                        ║
║ [shared-room-abc123] [Copy icon] ║
║                                   ║
║ Invite members:                   ║
║ Email: [_____________]            ║
║ Role: [View ▼]                    ║
║ [+ Invite]                        ║
║                                   ║
║ Members (3):                      ║
║ ├─ alice@ex (Owner) [Remove ×]   ║
║ ├─ bob@ex (Edit) [Change role]    ║
║ └─ charlie@ex (View) [Remove ×]  ║
║                                   ║
║ [✓ Allow comments] [✓ Allow export]║
║                                   ║
║ [Cancel]            [Save changes]║
╚═══════════════════════════════════╝
```

### Comments UI (New)
```
Message: "What's the analysis?"
└─ [👤 alice, 2m ago] View • Edit • Delete
   
   💬 Comments (1)
   ├─ [👤 bob, 1m ago]
   │  "I'm working on it"
   │  [Reply] [Like] [More...]
   │  └─ [👤 alice, 30s ago] (reply)
   │     "Thanks!"
   │
   └─ [+ Add comment...]
```

---

## 🔐 Security & Permissions

### Firebase Security Rules (Phase 25)

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "sharedRooms": {
      "$roomId": {
        ".read": "root.child('sharedRooms').child($roomId).child('members').hasChild(auth.uid)",
        ".write": "root.child('sharedRooms').child($roomId).child('ownerId').val() === auth.uid",
        "members": {
          ".write": "root.child('sharedRooms').child($roomId).child('ownerId').val() === auth.uid"
        },
        "messages": {
          ".write": "root.child('sharedRooms').child($roomId).child('members').child(auth.uid).child('role').val() in ['owner', 'admin', 'edit']"
        },
        "comments": {
          ".write": "root.child('sharedRooms').child($roomId).child('members').child(auth.uid).child('role').val() in ['owner', 'admin', 'edit', 'comment']"
        }
      }
    }
  }
}
```

---

## 🔄 Implementation Phases

### Phase 25.1: Basic Sharing
- [ ] Share modal
- [ ] Member management
- [ ] Permissions enforcement
- [ ] Shared room list
- **Timeline**: 1-2 weeks

### Phase 25.2: Real-Time Presence
- [ ] Presence tracking
- [ ] Online status
- [ ] Typing indicator
- [ ] Activity indicators
- **Timeline**: 1 week

### Phase 25.3: Comments & Threads
- [ ] Comment UI
- [ ] Reply threads
- [ ] Comment notifications
- [ ] Comment moderation
- **Timeline**: 1-2 weeks

### Phase 25.4: Activity & Notifications
- [ ] Activity log
- [ ] Push notifications
- [ ] Email notifications
- [ ] Activity digest
- **Timeline**: 1-2 weeks

---

## 📈 API Endpoints (Backend)

### New Endpoints (server-enhanced.js)

```javascript
// Share management
POST   /api/rooms/:roomId/share
       { memberEmail, role }
       → { success, memberId }

GET    /api/rooms/:roomId/members
       → { members: [...] }

DELETE /api/rooms/:roomId/members/:memberId
       → { success }

PATCH  /api/rooms/:roomId/members/:memberId
       { role }
       → { success }

// Share links
GET    /api/shared-rooms/:shareLink
       → { room, members, permissions }

// Comments
POST   /api/rooms/:roomId/messages/:msgId/comments
       { text }
       → { commentId, comment }

GET    /api/rooms/:roomId/messages/:msgId/comments
       → { comments: [...] }

DELETE /api/rooms/:roomId/comments/:commentId
       → { success }

// Presence
POST   /api/presence/:roomId
       { status, lastUpdate }
       → { success }

GET    /api/presence/:roomId
       → { presence: {...} }

// Activity
GET    /api/rooms/:roomId/activity
       → { activityLog: [...] }
```

---

## 🧪 Testing Scenarios

### Scenario 1: Share Room with Team
```
1. Alice creates room "Project Alpha"
2. Alice clicks Share
3. Invites bob@example.com (Edit)
4. Invites charlie@example.com (View)
5. Bob sees room in his list
6. Charlie sees room in his list
✅ All see same messages
✅ Bob can send messages
✅ Charlie can only view
```

### Scenario 2: Real-Time Collaboration
```
1. Alice opens room
2. Bob opens same room
3. Alice sees "bob@example (viewing)"
4. Bob types message
5. Alice sees "bob@example (typing...)"
6. Bob sends message
7. Alice receives instantly
✅ Real-time collaboration works
```

### Scenario 3: Comment Discussion
```
1. Message: "Analyze this data"
2. Bob comments: "I'm on it"
3. Alice replies: "Great!"
4. Charlie comments: "Update?"
✅ Thread develops naturally
✅ All notified of updates
```

### Scenario 4: Permission Enforcement
```
1. Charlie (View only) tries to send message
2. System blocks message
3. Shows: "You don't have permission"
✅ Permissions enforced
✅ No silent failures
```

---

## 📊 Performance Considerations

### Scaling
```
Rooms per user: 100 → 10,000
Members per room: 10 → 1,000
Messages per room: 100 → 10,000
Comments per message: 5 → 50
```

### Optimization Strategies
```
1. Index shared rooms by member
2. Paginate activity log
3. Cache presence (TTL: 5 min)
4. Archive old comments
5. Lazy-load member details
```

### Expected Latency
```
Add member: < 1s
Send message: < 2s
Add comment: < 1s
Load room: < 3s
Member presence: 2-3s
```

---

## 🚀 Rollout Plan

### Internal Testing (Week 1)
- Team uses Phase 25 beta
- Collect feedback
- Fix issues

### Closed Beta (Week 2)
- 10-20 pilot users
- Monitor performance
- Gather suggestions

### Open Release (Week 3)
- Deploy to all users
- Monitor metrics
- Support team ready

### Marketing
- Blog post
- Email announcement
- Feature highlight

---

## 📚 Related Documentation

- [FEATURES_ROADMAP.md](FEATURES_ROADMAP.md) — All phases
- [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) → Team features
- [TESTING_GUIDE.md](TESTING_GUIDE.md) → Phase 25 tests

---

## ✨ Future Enhancements

### Phase 26+
- Mentions (@username)
- Reactions (👍 ❤️ 😂)
- Rich text editing
- File attachments
- Integration with team tools (Slack, Teams)
- Analytics by team member
- Advanced permissions (room templates, roles)

---

**Design Status**: Ready for development  
**Next Step**: Phase 25.1 implementation

Generated: 2026-09-30 19:45 UTC

