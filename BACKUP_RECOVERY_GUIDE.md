# 🔄 Backup & Recovery System Guide

## What It Does

Automatically backs up your data and provides disaster recovery options.

## Features

### ✅ Automatic Backups
- Every hour (configurable)
- Max 10 backups stored
- Old backups auto-deleted

### ✅ Manual Backups
- Create backup on demand
- Custom labels
- Export as JSON

### ✅ Integrity Checking
- Checksums verify data
- Detects corruption
- Restore with confidence

### ✅ Recovery Options
- Restore from any backup
- Import exported backups
- Archive for long-term storage

## Usage

```javascript
const backup = new BackupRecoveryManager();

// Create backup
const b1 = backup.createBackup('Before big changes');

// List backups
const all = backup.listBackups();

// Restore
backup.restoreBackup('backup-123');

// Export
const json = backup.exportBackup('backup-123');

// Import
backup.importBackup(json);

// Verify integrity
const verified = backup.verifyBackupIntegrity('backup-123');

// Statistics
const stats = backup.getBackupStats();
// Returns: totalBackups, totalSize, oldestBackup, newestBackup, averageSize
```

## Auto-Backup Schedule

```
Every 1 hour: Automatic backup created
Keeps last 10 backups
Deletes oldest when limit reached
```

## Manual Backup Process

1. Create backup: `backup.createBackup('Label')`
2. Export to JSON: `backup.exportBackup('backup-id')`
3. Download file to computer
4. Store in safe location

## Recovery Process

### From Recent Backup
```javascript
backup.restoreBackup('backup-123');
// Data restored immediately
location.reload(); // Refresh page
```

### From Exported File
```javascript
// 1. Upload/paste exported JSON
backup.importBackup(jsonString);

// 2. Restore
backup.restoreBackup('backup-123');

// 3. Refresh
location.reload();
```

## Disaster Recovery

### Step 1: Export Archive
```javascript
const archive = backup.exportAllBackups();
const json = JSON.stringify(archive);
// Save to file
```

### Step 2: Store Archive
- Download JSON file
- Upload to Google Drive
- Email to yourself
- Store on USB drive

### Step 3: Restore If Needed
```javascript
// Load archive file
backup.restoreFromArchive(jsonString);
// All backups restored
```

## Backup Statistics

```javascript
const stats = backup.getBackupStats();
console.log(stats);
// {
//   totalBackups: 10,
//   totalSize: 245,  // KB
//   oldestBackup: '2026-09-29T01:00:00Z',
//   newestBackup: '2026-09-29T11:00:00Z',
//   averageSize: 24.5
// }
```

## Recovery Log

```javascript
const log = backup.getRecoveryLog(50);
// Shows all backup/restore actions
// Helpful for auditing
```

## Verify Backup Integrity

```javascript
const check = backup.verifyBackupIntegrity('backup-123');
console.log(check.valid); // true or false

if (!check.valid) {
    console.log('Backup corrupted!');
    console.log('Stored:', check.storedChecksum);
    console.log('Calculated:', check.calculatedChecksum);
}
```

## Best Practices

1. **Weekly Archive Export**
   - Export all backups every week
   - Store in cloud (Google Drive, Dropbox)
   - Keep local copy

2. **Monthly Full Backup**
   - Create labeled backup: "Monthly-2026-09"
   - Export to external storage
   - Archive for 1 year

3. **Before Major Changes**
   - Create backup: "Before new feature"
   - Proceed with changes
   - Keep backup for 30 days

4. **Recovery Testing**
   - Monthly: Test restore process
   - Verify data integrity
   - Document procedure

## Backup File Format

```json
{
  "meta": {
    "exportDate": "2026-09-29T12:00:00Z",
    "backupId": "backup-123",
    "label": "Backup Label",
    "version": "1.0.0"
  },
  "backup": {
    "id": "backup-123",
    "timestamp": "2026-09-29T12:00:00Z",
    "data": {
      "appState": { ... },
      "userSession": { ... },
      "backendState": { ... }
    },
    "checksum": "abc123def456"
  }
}
```

## Troubleshooting

### Backup Failed
- Check localStorage space
- Clear old data
- Try again

### Restore Not Working
- Verify backup ID
- Check backup integrity
- Try different backup

### Checksum Mismatch
- Backup may be corrupted
- Try another backup
- Contact support

