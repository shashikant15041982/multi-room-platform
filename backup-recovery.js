/**
 * Backup & Recovery System
 * Automatic backup, manual export, and disaster recovery
 */

class BackupRecoveryManager {
    constructor(config = {}) {
        this.config = {
            autoBackupInterval: config.autoBackupInterval || 3600000, // 1 hour
            maxBackups: config.maxBackups || 10,
            ...config
        };

        this.backups = {};
        this.recoveryLog = [];
        this.startAutoBackup();
    }

    /**
     * Create backup of entire app state
     */
    createBackup(label = null) {
        const backupId = `backup-${Date.now()}`;
        const timestamp = new Date().toISOString();

        // Capture all localStorage data
        const appState = localStorage.getItem('appState');
        const userSession = localStorage.getItem('userSession');
        const backendState = localStorage.getItem('backendState');

        this.backups[backupId] = {
            id: backupId,
            label: label || `Auto Backup ${timestamp}`,
            timestamp: timestamp,
            size: this.estimateSize({ appState, userSession, backendState }),
            data: {
                appState: appState ? JSON.parse(appState) : null,
                userSession: userSession ? JSON.parse(userSession) : null,
                backendState: backendState ? JSON.parse(backendState) : null
            },
            checksum: this.calculateChecksum({ appState, userSession, backendState })
        };

        // Trim old backups
        this.trimBackups();

        // Log backup
        this.recordLog('backup_created', {
            backupId: backupId,
            label: this.backups[backupId].label,
            size: this.backups[backupId].size
        });

        return this.backups[backupId];
    }

    /**
     * Restore from backup
     */
    restoreBackup(backupId) {
        const backup = this.backups[backupId];
        if (!backup) {
            return { success: false, error: 'Backup not found' };
        }

        // Verify checksum
        const currentChecksum = this.calculateChecksum({
            appState: JSON.stringify(backup.data.appState),
            userSession: JSON.stringify(backup.data.userSession),
            backendState: JSON.stringify(backup.data.backendState)
        });

        if (currentChecksum !== backup.checksum) {
            return { success: false, error: 'Backup corrupted - checksum mismatch' };
        }

        // Restore data
        if (backup.data.appState) {
            localStorage.setItem('appState', JSON.stringify(backup.data.appState));
        }
        if (backup.data.userSession) {
            localStorage.setItem('userSession', JSON.stringify(backup.data.userSession));
        }
        if (backup.data.backendState) {
            localStorage.setItem('backendState', JSON.stringify(backup.data.backendState));
        }

        // Log recovery
        this.recordLog('backup_restored', {
            backupId: backupId,
            label: backup.label,
            timestamp: backup.timestamp
        });

        return { success: true, backup: backup };
    }

    /**
     * Export backup as JSON file
     */
    exportBackup(backupId) {
        const backup = this.backups[backupId];
        if (!backup) return null;

        const exportData = {
            meta: {
                exportDate: new Date().toISOString(),
                backupId: backupId,
                label: backup.label,
                originalTimestamp: backup.timestamp,
                version: '1.0.0'
            },
            backup: backup,
            instructions: 'To restore: 1. Copy backup ID, 2. Use importBackup(json), 3. Restore with backupId'
        };

        return JSON.stringify(exportData, null, 2);
    }

    /**
     * Import backup from JSON file
     */
    importBackup(jsonData) {
        try {
            const imported = JSON.parse(jsonData);
            const backupId = imported.backup.id;

            this.backups[backupId] = imported.backup;
            this.trimBackups();

            this.recordLog('backup_imported', {
                backupId: backupId,
                label: imported.backup.label
            });

            return { success: true, backupId: backupId };
        } catch (error) {
            return { success: false, error: 'Invalid backup file' };
        }
    }

    /**
     * List all backups
     */
    listBackups() {
        return Object.values(this.backups)
            .map(backup => ({
                id: backup.id,
                label: backup.label,
                timestamp: backup.timestamp,
                size: backup.size,
                checksum: backup.checksum
            }))
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    /**
     * Delete specific backup
     */
    deleteBackup(backupId) {
        if (this.backups[backupId]) {
            delete this.backups[backupId];

            this.recordLog('backup_deleted', { backupId });

            return { success: true };
        }
        return { success: false, error: 'Backup not found' };
    }

    /**
     * Auto backup at interval
     */
    startAutoBackup() {
        setInterval(() => {
            this.createBackup(`Auto Backup ${new Date().toLocaleString()}`);
        }, this.config.autoBackupInterval);
    }

    /**
     * Calculate checksum of data
     */
    calculateChecksum(data) {
        const str = JSON.stringify(data);
        let hash = 0;

        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit
        }

        return Math.abs(hash).toString(16);
    }

    /**
     * Estimate data size in KB
     */
    estimateSize(data) {
        const str = JSON.stringify(data);
        return Math.ceil(new Blob([str]).size / 1024);
    }

    /**
     * Trim oldest backups if exceeds limit
     */
    trimBackups() {
        const backupList = Object.values(this.backups)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        if (backupList.length > this.config.maxBackups) {
            const toDelete = backupList.slice(this.config.maxBackups);
            toDelete.forEach(backup => {
                delete this.backups[backup.id];
            });
        }
    }

    /**
     * Record event in recovery log
     */
    recordLog(action, details) {
        this.recoveryLog.push({
            timestamp: new Date().toISOString(),
            action: action,
            details: details
        });

        // Keep only recent 1000 entries
        if (this.recoveryLog.length > 1000) {
            this.recoveryLog = this.recoveryLog.slice(-1000);
        }
    }

    /**
     * Get recovery log
     */
    getRecoveryLog(limit = 50) {
        return this.recoveryLog.slice(-limit).reverse();
    }

    /**
     * Generate backup statistics
     */
    getBackupStats() {
        const backups = Object.values(this.backups);

        return {
            totalBackups: backups.length,
            totalSize: backups.reduce((sum, b) => sum + b.size, 0),
            oldestBackup: backups.length > 0 ? backups[backups.length - 1].timestamp : null,
            newestBackup: backups.length > 0 ? backups[0].timestamp : null,
            averageSize: backups.length > 0 ? Math.round(backups.reduce((sum, b) => sum + b.size, 0) / backups.length) : 0
        };
    }

    /**
     * Verify backup integrity
     */
    verifyBackupIntegrity(backupId) {
        const backup = this.backups[backupId];
        if (!backup) return { valid: false, error: 'Backup not found' };

        const calculated = this.calculateChecksum({
            appState: JSON.stringify(backup.data.appState),
            userSession: JSON.stringify(backup.data.userSession),
            backendState: JSON.stringify(backup.data.backendState)
        });

        const valid = calculated === backup.checksum;

        return {
            valid: valid,
            storedChecksum: backup.checksum,
            calculatedChecksum: calculated,
            timestamp: backup.timestamp
        };
    }

    /**
     * Export all backups for archival
     */
    exportAllBackups() {
        return {
            exportDate: new Date().toISOString(),
            totalBackups: Object.keys(this.backups).length,
            backups: Object.values(this.backups),
            recoveryLog: this.recoveryLog,
            stats: this.getBackupStats()
        };
    }

    /**
     * Disaster recovery - restore from full archive
     */
    restoreFromArchive(archiveData) {
        try {
            const archive = JSON.parse(archiveData);

            // Restore all backups
            archive.backups.forEach(backup => {
                this.backups[backup.id] = backup;
            });

            // Restore recovery log
            this.recoveryLog = archive.recoveryLog || [];

            this.recordLog('archive_restored', {
                backupsRestored: archive.totalBackups
            });

            return { success: true, backupsRestored: archive.totalBackups };
        } catch (error) {
            return { success: false, error: 'Invalid archive file' };
        }
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BackupRecoveryManager;
}
