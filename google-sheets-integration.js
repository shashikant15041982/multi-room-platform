/**
 * Google Sheets Integration for Multi-Room Platform
 * Connects to Google Sheets for persistent cloud storage
 */

const GOOGLE_SHEETS_CONFIG = {
    SPREADSHEET_ID: 'YOUR_SPREADSHEET_ID',
    API_KEY: 'YOUR_API_KEY',
    SHEET_NAMES: {
        ROOMS: 'Rooms',
        EXECUTIONS: 'Executions',
        RELAYS: 'Relays',
        EMAILS: 'Emails',
        TOKENS: 'Tokens'
    }
};

class GoogleSheetsManager {
    constructor(config) {
        this.config = config;
        this.authToken = null;
    }

    /**
     * Authenticate with Google using OAuth
     */
    async authenticate() {
        try {
            const response = await fetch('https://accounts.google.com/o/oauth2/v2/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    client_id: this.config.CLIENT_ID,
                    scope: 'https://www.googleapis.com/auth/spreadsheets',
                    redirect_uri: this.config.REDIRECT_URI,
                    response_type: 'token'
                })
            });
            return response.json();
        } catch (error) {
            console.error('Authentication error:', error);
            return null;
        }
    }

    /**
     * Append data to Google Sheet
     */
    async appendData(sheetName, values) {
        try {
            const response = await fetch(
                `https://sheets.googleapis.com/v4/spreadsheets/${this.config.SPREADSHEET_ID}/values/${sheetName}!A:Z:append?key=${this.config.API_KEY}`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.authToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        values: [values],
                        majorDimension: 'ROWS',
                        insertDataOption: 'INSERT_ROWS'
                    })
                }
            );
            return response.json();
        } catch (error) {
            console.error('Append error:', error);
            return null;
        }
    }

    /**
     * Read data from Google Sheet
     */
    async readData(sheetName, range = 'A:Z') {
        try {
            const response = await fetch(
                `https://sheets.googleapis.com/v4/spreadsheets/${this.config.SPREADSHEET_ID}/values/${sheetName}!${range}?key=${this.config.API_KEY}`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${this.authToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.json();
        } catch (error) {
            console.error('Read error:', error);
            return null;
        }
    }

    /**
     * Sync local execution data to Google Sheets
     */
    async syncExecutions(executions) {
        const rows = executions.map(exec => [
            exec.execution_id,
            exec.room_id,
            exec.timestamp,
            exec.jobsFound,
            exec.duration,
            exec.tokensUsed
        ]);
        return this.appendData(this.config.SHEET_NAMES.EXECUTIONS, rows[0]);
    }

    /**
     * Sync relay events to Google Sheets
     */
    async syncRelays(relays) {
        const rows = relays.map(relay => [
            relay.relay_id,
            relay.room_id,
            relay.from_ai,
            relay.to_ai,
            relay.message_count,
            relay.context_kb,
            relay.timestamp
        ]);
        return this.appendData(this.config.SHEET_NAMES.RELAYS, rows[0]);
    }

    /**
     * Sync emails to Google Sheets
     */
    async syncEmails(emails) {
        const rows = emails.map(email => [
            email.email_id,
            email.room_id,
            email.recipient,
            email.subject,
            email.status,
            email.timestamp
        ]);
        return this.appendData(this.config.SHEET_NAMES.EMAILS, rows[0]);
    }

    /**
     * Sync token usage to Google Sheets
     */
    async syncTokens(tokenRecords) {
        const rows = tokenRecords.map(record => [
            record.entry_id,
            record.room_id,
            record.ai_name,
            record.tokens_used,
            record.percent_used,
            record.timestamp
        ]);
        return this.appendData(this.config.SHEET_NAMES.TOKENS, rows[0]);
    }

    /**
     * Create sheets structure (run once)
     */
    async createSheetStructure() {
        const sheets = [
            {
                name: this.config.SHEET_NAMES.ROOMS,
                headers: ['room_id', 'title', 'current_ai', 'status', 'executions', 'emails', 'relays', 'last_updated']
            },
            {
                name: this.config.SHEET_NAMES.EXECUTIONS,
                headers: ['execution_id', 'room_id', 'timestamp', 'jobs_found', 'duration', 'tokens_used']
            },
            {
                name: this.config.SHEET_NAMES.RELAYS,
                headers: ['relay_id', 'room_id', 'from_ai', 'to_ai', 'message_count', 'context_kb', 'timestamp']
            },
            {
                name: this.config.SHEET_NAMES.EMAILS,
                headers: ['email_id', 'room_id', 'recipient', 'subject', 'status', 'timestamp']
            },
            {
                name: this.config.SHEET_NAMES.TOKENS,
                headers: ['entry_id', 'room_id', 'ai_name', 'tokens_used', 'percent_used', 'timestamp']
            }
        ];

        for (const sheet of sheets) {
            await this.appendData(sheet.name, sheet.headers);
        }

        return true;
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GoogleSheetsManager;
}
