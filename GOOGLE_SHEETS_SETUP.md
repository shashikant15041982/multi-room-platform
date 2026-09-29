# 🔗 Google Sheets Integration Setup

## What It Does
Connects your Multi-Room Platform to Google Sheets for permanent cloud storage and analytics.

## Setup Steps

### 1. Create a Google Project
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project: "Multi-Room Platform"
3. Enable Google Sheets API
4. Create a Service Account
5. Download the JSON key file

### 2. Create Google Sheet
1. Create new spreadsheet: "Multi-Room Data"
2. Note the Spreadsheet ID from the URL
3. Share with your service account email

### 3. Add to Your App
```javascript
const sheetsManager = new GoogleSheetsManager({
    SPREADSHEET_ID: 'your-spreadsheet-id',
    API_KEY: 'your-api-key',
    CLIENT_ID: 'your-client-id'
});

// Authenticate
await sheetsManager.authenticate();

// Create initial structure
await sheetsManager.createSheetStructure();

// Sync data
await sheetsManager.syncExecutions(executionData);
await sheetsManager.syncRelays(relayData);
await sheetsManager.syncEmails(emailData);
await sheetsManager.syncTokens(tokenData);
```

### 4. Data Structure
The integration creates 5 sheets:

**Rooms**
- room_id, title, current_ai, status, executions, emails, relays, last_updated

**Executions**
- execution_id, room_id, timestamp, jobs_found, duration, tokens_used

**Relays**
- relay_id, room_id, from_ai, to_ai, message_count, context_kb, timestamp

**Emails**
- email_id, room_id, recipient, subject, status, timestamp

**Tokens**
- entry_id, room_id, ai_name, tokens_used, percent_used, timestamp

### 5. Auto-Sync
Enable auto-sync in your app:
```javascript
setInterval(() => {
    sheetsManager.syncExecutions(appState.executions);
    sheetsManager.syncRelays(appState.relays);
    sheetsManager.syncEmails(appState.emails);
    sheetsManager.syncTokens(appState.tokens);
}, 60000); // Every minute
```

## Benefits
✅ Unlimited cloud storage  
✅ Real-time analytics  
✅ Shareable reports  
✅ Data backup  
✅ Advanced filtering  

## Security
- Use environment variables for API keys
- Restrict access to service account
- Enable Google Sheets audit logging
- Encrypt sensitive data

