/**
 * Team Collaboration Module
 * Multi-user support, room sharing, activity logs, team analytics
 */

class TeamCollaborationManager {
    constructor(config = {}) {
        this.config = {
            maxTeamMembers: config.maxTeamMembers || 10,
            ...config
        };
        
        this.teams = {};
        this.teamMembers = {};
        this.activityLogs = {};
        this.sharePermissions = {};
    }

    /**
     * Create new team
     */
    createTeam(teamId, teamName, ownerEmail) {
        this.teams[teamId] = {
            id: teamId,
            name: teamName,
            owner: ownerEmail,
            createdAt: new Date().toISOString(),
            members: [ownerEmail],
            settings: {
                visibility: 'private',
                allowSharing: true,
                autoSync: true
            }
        };

        this.teamMembers[teamId] = {
            [ownerEmail]: {
                role: 'owner',
                joinedAt: new Date().toISOString(),
                permissions: ['read', 'write', 'admin', 'share']
            }
        };

        return this.teams[teamId];
    }

    /**
     * Invite member to team
     */
    inviteMember(teamId, email, role = 'member') {
        if (!this.teams[teamId]) return { success: false, error: 'Team not found' };

        const permissions = {
            owner: ['read', 'write', 'admin', 'share', 'delete'],
            admin: ['read', 'write', 'admin', 'share'],
            member: ['read', 'write'],
            viewer: ['read']
        };

        this.teamMembers[teamId][email] = {
            role: role,
            joinedAt: new Date().toISOString(),
            permissions: permissions[role] || ['read']
        };

        this.teams[teamId].members.push(email);

        // Log activity
        this.logActivity(teamId, 'member_added', {
            addedUser: email,
            role: role,
            addedBy: this.getTeamOwner(teamId)
        });

        return { success: true, member: this.teamMembers[teamId][email] };
    }

    /**
     * Share room with team
     */
    shareRoom(teamId, roomId, userEmail) {
        if (!this.canUserShare(teamId, userEmail)) {
            return { success: false, error: 'No permission to share' };
        }

        const shareId = `${teamId}-${roomId}`;
        this.sharePermissions[shareId] = {
            roomId: roomId,
            teamId: teamId,
            sharedBy: userEmail,
            sharedAt: new Date().toISOString(),
            accessLevel: 'read-write',
            viewers: this.teams[teamId].members
        };

        this.logActivity(teamId, 'room_shared', {
            roomId: roomId,
            sharedWith: this.teams[teamId].members.length,
            sharedBy: userEmail
        });

        return { success: true, shareId: shareId };
    }

    /**
     * Check if user can share
     */
    canUserShare(teamId, userEmail) {
        const member = this.teamMembers[teamId]?.[userEmail];
        return member && member.permissions.includes('share');
    }

    /**
     * Log team activity
     */
    logActivity(teamId, action, details) {
        if (!this.activityLogs[teamId]) {
            this.activityLogs[teamId] = [];
        }

        this.activityLogs[teamId].push({
            timestamp: new Date().toISOString(),
            action: action,
            details: details
        });

        // Keep only recent 1000 entries
        if (this.activityLogs[teamId].length > 1000) {
            this.activityLogs[teamId] = this.activityLogs[teamId].slice(-1000);
        }
    }

    /**
     * Get activity timeline
     */
    getActivityTimeline(teamId, limit = 50) {
        const logs = this.activityLogs[teamId] || [];
        return logs.slice(-limit).reverse();
    }

    /**
     * Get team analytics
     */
    getTeamAnalytics(teamId, rooms) {
        const timeline = this.getActivityTimeline(teamId, 100);
        const members = this.teamMembers[teamId] || {};

        const stats = {
            totalMembers: Object.keys(members).length,
            totalRooms: Object.values(rooms).length,
            activeRooms: Object.values(rooms).filter(r => r.status === 'active').length,
            totalExecutions: Object.values(rooms).reduce((sum, r) => sum + r.executions.length, 0),
            totalEmails: Object.values(rooms).reduce((sum, r) => sum + r.emails.length, 0),
            activities: {
                membersAdded: timeline.filter(t => t.action === 'member_added').length,
                roomsShared: timeline.filter(t => t.action === 'room_shared').length,
                executionsRun: timeline.filter(t => t.action === 'execution_run').length
            },
            memberRoles: Object.values(members).reduce((acc, m) => {
                acc[m.role] = (acc[m.role] || 0) + 1;
                return acc;
            }, {})
        };

        return stats;
    }

    /**
     * Get team member profile
     */
    getMemberProfile(teamId, email) {
        const member = this.teamMembers[teamId]?.[email];
        if (!member) return null;

        return {
            email: email,
            role: member.role,
            joinedAt: member.joinedAt,
            permissions: member.permissions,
            status: 'active'
        };
    }

    /**
     * Remove team member
     */
    removeMember(teamId, email, removedBy) {
        if (this.getTeamOwner(teamId) === email) {
            return { success: false, error: 'Cannot remove team owner' };
        }

        delete this.teamMembers[teamId][email];
        this.teams[teamId].members = this.teams[teamId].members.filter(e => e !== email);

        this.logActivity(teamId, 'member_removed', {
            removedUser: email,
            removedBy: removedBy
        });

        return { success: true };
    }

    /**
     * Update member role
     */
    updateMemberRole(teamId, email, newRole, updatedBy) {
        const member = this.teamMembers[teamId]?.[email];
        if (!member) return { success: false, error: 'Member not found' };

        const permissions = {
            owner: ['read', 'write', 'admin', 'share', 'delete'],
            admin: ['read', 'write', 'admin', 'share'],
            member: ['read', 'write'],
            viewer: ['read']
        };

        member.role = newRole;
        member.permissions = permissions[newRole] || ['read'];

        this.logActivity(teamId, 'role_changed', {
            user: email,
            newRole: newRole,
            changedBy: updatedBy
        });

        return { success: true, member: member };
    }

    /**
     * Get team leaderboard
     */
    getTeamLeaderboard(teamId, rooms) {
        const members = Object.keys(this.teamMembers[teamId] || {});
        const leaderboard = [];

        members.forEach(email => {
            let executionCount = 0;
            let emailCount = 0;

            Object.values(rooms).forEach(room => {
                // This is simplified - in real app, track per-user stats
                executionCount += room.executions.length;
                emailCount += room.emails.length;
            });

            leaderboard.push({
                email: email,
                executions: Math.floor(executionCount / members.length),
                emails: Math.floor(emailCount / members.length),
                score: (Math.floor(executionCount / members.length) * 10) + 
                       (Math.floor(emailCount / members.length) * 5)
            });
        });

        return leaderboard.sort((a, b) => b.score - a.score);
    }

    /**
     * Bulk export team data
     */
    exportTeamData(teamId) {
        return {
            team: this.teams[teamId],
            members: this.teamMembers[teamId],
            activities: this.activityLogs[teamId] || [],
            exportedAt: new Date().toISOString()
        };
    }

    /**
     * Helper: Get team owner
     */
    getTeamOwner(teamId) {
        return this.teams[teamId]?.owner;
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TeamCollaborationManager;
}
