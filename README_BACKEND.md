# Chat Workspace Backend

Simple Node.js backend to handle Claude API calls.

## Setup

### Local Development
1. Install Node.js
2. Copy `.env.example` to `.env`
3. Add your Claude API key to `.env`
4. Install dependencies: `npm install`
5. Run: `npm start`
6. Server runs on http://localhost:3000

### Deploy to Replit
1. Go to https://replit.com
2. Create new Node.js project
3. Upload these files: server.js, package.json
4. Click "Secrets" and add ANTHROPIC_API_KEY
5. Click "Run" - it deploys automatically!
6. Your backend URL: https://your-replit-name.replit.dev

## API

### POST /api/chat
Send messages, get Claude response.

Request:
```json
{
  "messages": [
    {"role": "user", "content": "Hello"},
    {"role": "assistant", "content": "Hi there!"}
  ]
}
```

Response:
```json
{
  "content": "Claude's response here"
}
```

