# 🔌 Real API Integration Setup Guide

## Available APIs

### 1. Indeed Jobs API
**Purpose:** Search job listings  
**Setup:**
```javascript
const api = new APIIntegration({
    indeedApiKey: 'your-indeed-api-key'
});

const jobs = await api.searchJobsIndeed('Finance', 'New Delhi', 25);
```

### 2. LinkedIn Jobs API
**Purpose:** Premium job search  
**Setup:**
```javascript
const api = new APIIntegration({
    linkedinApiKey: 'your-linkedin-api-key'
});

const jobs = await api.searchJobsLinkedIn('R2R Analyst', 'India', 25);
```

### 3. SendGrid Email API
**Purpose:** Send email notifications  
**Setup:**
```javascript
const api = new APIIntegration({
    sendgridApiKey: 'your-sendgrid-api-key'
});

await api.sendEmailSendGrid(
    'recruiter@example.com',
    'Job Matches',
    '<h1>New Jobs Found!</h1>'
);
```

### 4. Twilio SMS API
**Purpose:** Send SMS alerts  
**Setup:**
```javascript
const api = new APIIntegration({
    twilioAccountSid: 'your-sid',
    twilioAuthToken: 'your-token'
});

await api.sendSmsTwilio('+91-9999-999999', 'New job match found!');
```

## Setup Steps

### Indeed
1. Register at https://opensource.indeedeng.io/
2. Get API key
3. Add to config

### LinkedIn
1. Create LinkedIn App at https://www.linkedin.com/developers/
2. Request access token
3. Add to config

### SendGrid
1. Register at https://sendgrid.com
2. Create API key
3. Add to config

### Twilio
1. Register at https://www.twilio.com
2. Get Account SID and Auth Token
3. Add to config

## Usage Example

```javascript
const api = new APIIntegration({
    indeedApiKey: 'KEY1',
    linkedinApiKey: 'KEY2',
    sendgridApiKey: 'KEY3'
});

// Search jobs
const jobs = await api.searchJobsBatch('R2R Analyst', 'New Delhi');

// Send to user
await api.sendJobMatchEmail(
    'shashikant15041982@gmail.com',
    jobs.slice(0, 5),
    'Claude AI'
);

// Notify user
await api.notifyUser(
    'shashikant15041982@gmail.com',
    '+91-9999-999999',
    `Found ${jobs.length} new opportunities!`
);
```

## Features Included
✅ Multi-source job search  
✅ Email notifications  
✅ SMS alerts  
✅ LinkedIn profile integration  
✅ Batch processing  
✅ Error handling  
✅ Rate limiting ready  

