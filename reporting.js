/**
 * Advanced Reporting & Export System
 * Generate reports and export data in multiple formats
 */

class ReportingEngine {
    constructor(config = {}) {
        this.config = {
            companyName: config.companyName || 'Multi-Room Platform',
            generatedBy: config.generatedBy || 'Auto-Report',
            ...config
        };

        this.reports = {};
    }

    /**
     * Generate execution report
     */
    generateExecutionReport(executions, options = {}) {
        const report = {
            id: `exec-report-${Date.now()}`,
            type: 'Execution Report',
            generatedAt: new Date().toISOString(),
            generatedBy: this.config.generatedBy,
            period: options.period || 'All Time',
            summary: this.analyzeExecutions(executions),
            details: executions,
            metrics: this.calculateExecutionMetrics(executions)
        };

        this.reports[report.id] = report;
        return report;
    }

    /**
     * Generate performance report
     */
    generatePerformanceReport(executions, relays, options = {}) {
        const report = {
            id: `perf-report-${Date.now()}`,
            type: 'Performance Report',
            generatedAt: new Date().toISOString(),
            generatedBy: this.config.generatedBy,
            summary: {
                totalExecutions: executions.length,
                totalRelays: relays.length,
                averageExecutionTime: this.calculateAverageTime(executions),
                successRate: this.calculateSuccessRate(executions),
                aiEfficiency: this.analyzeAIEfficiency(executions)
            },
            breakdowns: {
                byAI: this.breakdownByAI(executions),
                byRoom: this.breakdownByRoom(executions),
                byStatus: this.breakdownByStatus(executions)
            }
        };

        this.reports[report.id] = report;
        return report;
    }

    /**
     * Generate cost analysis report
     */
    generateCostReport(executions, options = {}) {
        const report = {
            id: `cost-report-${Date.now()}`,
            type: 'Cost Analysis Report',
            generatedAt: new Date().toISOString(),
            generatedBy: this.config.generatedBy,
            summary: {
                totalTokensUsed: this.calculateTotalTokens(executions),
                estimatedCost: this.calculateTotalCost(executions),
                costPerExecution: this.calculateCostPerExecution(executions),
                mostExpensiveAI: this.findMostExpensiveAI(executions),
                cheapestAI: this.findCheapestAI(executions)
            },
            breakdown: {
                byAI: this.costBreakdownByAI(executions),
                byRoom: this.costBreakdownByRoom(executions),
                trend: this.generateCostTrend(executions)
            }
        };

        this.reports[report.id] = report;
        return report;
    }

    /**
     * Generate team activity report
     */
    generateTeamActivityReport(activities, options = {}) {
        const report = {
            id: `team-report-${Date.now()}`,
            type: 'Team Activity Report',
            generatedAt: new Date().toISOString(),
            generatedBy: this.config.generatedBy,
            summary: {
                totalActivities: activities.length,
                activeMembers: new Set(activities.map(a => a.user)).size,
                topContributors: this.getTopContributors(activities),
                activityTrend: this.getActivityTrend(activities)
            },
            details: {
                activities: activities,
                memberStats: this.getMemberStats(activities)
            }
        };

        this.reports[report.id] = report;
        return report;
    }

    /**
     * Export report to CSV
     */
    exportToCSV(reportId) {
        const report = this.reports[reportId];
        if (!report) return null;

        let csv = this.generateCSVHeader(report);

        if (report.type === 'Execution Report') {
            csv += this.executionToCSV(report.details);
        } else if (report.type === 'Performance Report') {
            csv += this.performanceToCSV(report);
        } else if (report.type === 'Cost Analysis Report') {
            csv += this.costToCSV(report);
        }

        return csv;
    }

    /**
     * Export report to JSON
     */
    exportToJSON(reportId) {
        const report = this.reports[reportId];
        if (!report) return null;

        return JSON.stringify(report, null, 2);
    }

    /**
     * Export report to HTML
     */
    exportToHTML(reportId) {
        const report = this.reports[reportId];
        if (!report) return null;

        const html = `
<!DOCTYPE html>
<html>
<head>
    <title>${report.type}</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
        h2 { color: #555; margin-top: 20px; }
        table { border-collapse: collapse; width: 100%; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #007bff; color: white; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .summary { background-color: #f0f8ff; padding: 15px; border-radius: 5px; }
        .metric { display: inline-block; margin: 10px 20px; }
        .metric-label { font-weight: bold; color: #333; }
        .metric-value { color: #007bff; font-size: 20px; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <h1>${report.type}</h1>
    <div class="summary">
        <p><strong>Generated:</strong> ${report.generatedAt}</p>
        <p><strong>By:</strong> ${report.generatedBy}</p>
    </div>
    ${this.htmlReportContent(report)}
    <div class="footer">
        <p>Generated by ${this.config.companyName} - Automated Report System</p>
    </div>
</body>
</html>
        `;

        return html;
    }

    /**
     * Export report to PDF (returns HTML that can be printed to PDF)
     */
    exportToPDF(reportId) {
        // Return HTML that can be printed/saved as PDF
        return this.exportToHTML(reportId);
    }

    /**
     * Download report file
     */
    downloadReport(reportId, format = 'json') {
        let content, filename, mimeType;

        if (format === 'csv') {
            content = this.exportToCSV(reportId);
            filename = `report-${reportId}.csv`;
            mimeType = 'text/csv';
        } else if (format === 'json') {
            content = this.exportToJSON(reportId);
            filename = `report-${reportId}.json`;
            mimeType = 'application/json';
        } else if (format === 'html') {
            content = this.exportToHTML(reportId);
            filename = `report-${reportId}.html`;
            mimeType = 'text/html';
        } else {
            return null;
        }

        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();

        return { success: true, filename };
    }

    /**
     * List all reports
     */
    listReports() {
        return Object.values(this.reports)
            .map(r => ({
                id: r.id,
                type: r.type,
                generatedAt: r.generatedAt,
                items: Object.keys(r).length
            }))
            .sort((a, b) => new Date(b.generatedAt) - new Date(a.generatedAt));
    }

    /**
     * Delete report
     */
    deleteReport(reportId) {
        if (this.reports[reportId]) {
            delete this.reports[reportId];
            return { success: true };
        }
        return { success: false };
    }

    /**
     * Helper methods
     */

    analyzeExecutions(executions) {
        return {
            total: executions.length,
            successful: executions.filter(e => e.status === 'success').length,
            failed: executions.filter(e => e.status === 'failed').length,
            pending: executions.filter(e => e.status === 'pending').length
        };
    }

    calculateExecutionMetrics(executions) {
        const times = executions.map(e => e.duration || 0);
        return {
            averageTime: times.reduce((a, b) => a + b, 0) / times.length,
            minTime: Math.min(...times),
            maxTime: Math.max(...times),
            totalTime: times.reduce((a, b) => a + b, 0)
        };
    }

    calculateAverageTime(executions) {
        const times = executions.map(e => e.duration || 0);
        return times.length > 0 ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0;
    }

    calculateSuccessRate(executions) {
        if (executions.length === 0) return 0;
        const successful = executions.filter(e => e.status === 'success').length;
        return Math.round((successful / executions.length) * 100);
    }

    analyzeAIEfficiency(executions) {
        const aiMap = {};
        executions.forEach(e => {
            if (!aiMap[e.ai]) aiMap[e.ai] = { count: 0, tokens: 0, cost: 0 };
            aiMap[e.ai].count++;
            aiMap[e.ai].tokens += e.tokenUsed || 0;
            aiMap[e.ai].cost += e.estimatedCost || 0;
        });
        return aiMap;
    }

    breakdownByAI(executions) {
        return this.analyzeAIEfficiency(executions);
    }

    breakdownByRoom(executions) {
        const roomMap = {};
        executions.forEach(e => {
            if (!roomMap[e.room]) roomMap[e.room] = [];
            roomMap[e.room].push(e);
        });
        return roomMap;
    }

    breakdownByStatus(executions) {
        return {
            success: executions.filter(e => e.status === 'success').length,
            failed: executions.filter(e => e.status === 'failed').length,
            pending: executions.filter(e => e.status === 'pending').length
        };
    }

    calculateTotalTokens(executions) {
        return executions.reduce((sum, e) => sum + (e.tokenUsed || 0), 0);
    }

    calculateTotalCost(executions) {
        return executions.reduce((sum, e) => sum + (e.estimatedCost || 0), 0);
    }

    calculateCostPerExecution(executions) {
        const total = this.calculateTotalCost(executions);
        return executions.length > 0 ? (total / executions.length).toFixed(4) : 0;
    }

    findMostExpensiveAI(executions) {
        const costs = {};
        executions.forEach(e => {
            costs[e.ai] = (costs[e.ai] || 0) + (e.estimatedCost || 0);
        });
        return Object.entries(costs).sort((a, b) => b[1] - a[1])[0];
    }

    findCheapestAI(executions) {
        const costs = {};
        executions.forEach(e => {
            costs[e.ai] = (costs[e.ai] || 0) + (e.estimatedCost || 0);
        });
        return Object.entries(costs).sort((a, b) => a[1] - b[1])[0];
    }

    costBreakdownByAI(executions) {
        const breakdown = {};
        executions.forEach(e => {
            if (!breakdown[e.ai]) breakdown[e.ai] = 0;
            breakdown[e.ai] += e.estimatedCost || 0;
        });
        return breakdown;
    }

    costBreakdownByRoom(executions) {
        const breakdown = {};
        executions.forEach(e => {
            if (!breakdown[e.room]) breakdown[e.room] = 0;
            breakdown[e.room] += e.estimatedCost || 0;
        });
        return breakdown;
    }

    generateCostTrend(executions) {
        // Group by date and calculate cumulative cost
        const trends = {};
        executions
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
            .forEach(e => {
                const date = new Date(e.timestamp).toLocaleDateString();
                trends[date] = (trends[date] || 0) + (e.estimatedCost || 0);
            });
        return trends;
    }

    getTopContributors(activities) {
        const contributors = {};
        activities.forEach(a => {
            contributors[a.user] = (contributors[a.user] || 0) + 1;
        });
        return Object.entries(contributors)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
    }

    getActivityTrend(activities) {
        const trends = {};
        activities
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
            .forEach(a => {
                const date = new Date(a.timestamp).toLocaleDateString();
                trends[date] = (trends[date] || 0) + 1;
            });
        return trends;
    }

    getMemberStats(activities) {
        const stats = {};
        activities.forEach(a => {
            if (!stats[a.user]) {
                stats[a.user] = { activities: 0, actions: {} };
            }
            stats[a.user].activities++;
            stats[a.user].actions[a.action] = (stats[a.user].actions[a.action] || 0) + 1;
        });
        return stats;
    }

    generateCSVHeader(report) {
        return `"${report.type}"\n"Generated: ${report.generatedAt}"\n"By: ${report.generatedBy}"\n\n`;
    }

    executionToCSV(executions) {
        let csv = '"Timestamp","AI","Room","Status","Duration","Tokens","Cost"\n';
        executions.forEach(e => {
            csv += `"${e.timestamp}","${e.ai}","${e.room}","${e.status}","${e.duration}","${e.tokenUsed}","${e.estimatedCost}"\n`;
        });
        return csv;
    }

    performanceToCSV(report) {
        return ''; // Simplified
    }

    costToCSV(report) {
        let csv = '"AI","Total Tokens","Estimated Cost"\n';
        Object.entries(report.breakdown.byAI).forEach(([ai, cost]) => {
            csv += `"${ai}","","${cost}"\n`;
        });
        return csv;
    }

    htmlReportContent(report) {
        let html = '<div class="summary">';
        Object.entries(report.summary).forEach(([key, value]) => {
            if (typeof value !== 'object') {
                html += `<div class="metric"><span class="metric-label">${key}:</span> <span class="metric-value">${value}</span></div>`;
            }
        });
        html += '</div>';
        return html;
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ReportingEngine;
}
