# 👥 Team Collaboration Features

## Features

### 1. Team Management
Create and manage teams:
```javascript
const team = new TeamCollaborationManager();

// Create team
const myTeam = team.createTeam('team-1', 'Finance Team', 'owner@example.com');

// Invite members
team.inviteMember('team-1', 'analyst1@example.com', 'member');
team.inviteMember('team-1', 'admin1@example.com', 'admin');
```

### 2. Room Sharing
Share rooms with team:
```javascript
// Share room with entire team
team.shareRoom('team-1', 'room-1', 'owner@example.com');
```

### 3. Role-Based Access
- **Owner**: Full control, can manage team
- **Admin**: Manage rooms, add members
- **Member**: Read/write access
- **Viewer**: Read-only access

### 4. Activity Logging
Track all team activities:
```javascript
const timeline = team.getActivityTimeline('team-1', 50);
// Shows: member added, rooms shared, executions run, etc.
```

### 5. Team Analytics
View team performance:
```javascript
const analytics = team.getTeamAnalytics('team-1', rooms);
// Returns: member count, active rooms, execution stats, etc.
```

### 6. Member Profiles
See who's on the team:
```javascript
const profile = team.getMemberProfile('team-1', 'analyst1@example.com');
// Returns: role, joined date, permissions, status
```

### 7. Leaderboards
Rank team members:
```javascript
const leaderboard = team.getTeamLeaderboard('team-1', rooms);
// Top performers ranked by executions & emails
```

### 8. Data Export
Export team data:
```javascript
const export = team.exportTeamData('team-1');
// Download team data, member list, activity logs
```

## Usage Example

```javascript
const collab = new TeamCollaborationManager();

// 1. Create team
collab.createTeam('finance-2024', 'Finance Team 2024', 'shashikant15041982@gmail.com');

// 2. Add team members
collab.inviteMember('finance-2024', 'analyst1@example.com', 'member');
collab.inviteMember('finance-2024', 'analyst2@example.com', 'member');
collab.inviteMember('finance-2024', 'lead@example.com', 'admin');

// 3. Share rooms
collab.shareRoom('finance-2024', 'room-1', 'shashikant15041982@gmail.com');

// 4. View analytics
const stats = collab.getTeamAnalytics('finance-2024', rooms);
console.log(`Team has ${stats.totalMembers} members`);
console.log(`${stats.activeRooms} active rooms`);
console.log(`${stats.totalExecutions} total executions`);

// 5. View leaderboard
const leaders = collab.getTeamLeaderboard('finance-2024', rooms);
leaders.forEach((member, idx) => {
    console.log(`${idx + 1}. ${member.email}: ${member.score} points`);
});

// 6. Export data
const backup = collab.exportTeamData('finance-2024');
console.log('Team data exported');
```

## Permissions Matrix

| Role | Read | Write | Admin | Share | Delete |
|------|------|-------|-------|-------|--------|
| Owner | ✅ | ✅ | ✅ | ✅ | ✅ |
| Admin | ✅ | ✅ | ✅ | ✅ | ❌ |
| Member | ✅ | ✅ | ❌ | ❌ | ❌ |
| Viewer | ✅ | ❌ | ❌ | ❌ | ❌ |

## Benefits
✅ Collaborate with team members  
✅ Share rooms securely  
✅ Track team activity  
✅ View team analytics  
✅ Rank performance  
✅ Export data for backup  

