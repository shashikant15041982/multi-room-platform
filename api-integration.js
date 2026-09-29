/**
 * Real API Integration Module
 * Connects to actual job search, email, and social media APIs
 */

class APIIntegration {
    constructor(config = {}) {
        this.config = {
            linkedinApiKey: config.linkedinApiKey || 'LINKEDIN_API_KEY',
            indeedApiKey: config.indeedApiKey || 'INDEED_API_KEY',
            sendgridApiKey: config.sendgridApiKey || 'SENDGRID_API_KEY',
            twilioAccountSid: config.twilioAccountSid || 'TWILIO_SID',
            twilioAuthToken: config.twilioAuthToken || 'TWILIO_TOKEN',
            ...config
        };
    }

    /**
     * Search jobs from Indeed
     */
    async searchJobsIndeed(query, location, pageSize = 25) {
        try {
            const response = await fetch(
                `https://api.indeed.com/v2/jobs?query=${query}&location=${location}&limit=${pageSize}`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.config.indeedApiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            const data = await response.json();
            return data.results || [];
        } catch (error) {
            console.error('Indeed API error:', error);
            return [];
        }
    }

    /**
     * Search jobs from LinkedIn
     */
    async searchJobsLinkedIn(query, location, pageSize = 25) {
        try {
            const response = await fetch(
                `https://api.linkedin.com/v2/jobs/search?keywords=${query}&location=${location}&count=${pageSize}`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.config.linkedinApiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            const data = await response.json();
            return data.elements || [];
        } catch (error) {
            console.error('LinkedIn API error:', error);
            return [];
        }
    }

    /**
     * Send email via SendGrid
     */
    async sendEmailSendGrid(to, subject, htmlContent) {
        try {
            const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.config.sendgridApiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    personalizations: [
                        {
                            to: [{ email: to }],
                            subject: subject
                        }
                    ],
                    from: { email: 'noreply@multi-room-platform.com' },
                    content: [
                        {
                            type: 'text/html',
                            value: htmlContent
                        }
                    ]
                })
            });
            return response.status === 202;
        } catch (error) {
            console.error('SendGrid error:', error);
            return false;
        }
    }

    /**
     * Send SMS via Twilio
     */
    async sendSmsTwilio(phoneNumber, message) {
        try {
            const response = await fetch(
                `https://api.twilio.com/2010-04-01/Accounts/${this.config.twilioAccountSid}/Messages.json`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Basic ' + btoa(
                            `${this.config.twilioAccountSid}:${this.config.twilioAuthToken}`
                        ),
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams({
                        From: '+1234567890',
                        To: phoneNumber,
                        Body: message
                    })
                }
            );
            return response.status === 201;
        } catch (error) {
            console.error('Twilio error:', error);
            return false;
        }
    }

    /**
     * Get user profile from LinkedIn
     */
    async getLinkedInProfile(userId) {
        try {
            const response = await fetch(
                `https://api.linkedin.com/v2/me`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.config.linkedinApiKey}`
                    }
                }
            );
            return response.json();
        } catch (error) {
            console.error('LinkedIn profile error:', error);
            return null;
        }
    }

    /**
     * Send job matching email
     */
    async sendJobMatchEmail(recipientEmail, jobs, aiName) {
        const htmlContent = `
            <h2>Job Matches Found by ${aiName}</h2>
            <p>Found ${jobs.length} matching opportunities:</p>
            <ul>
                ${jobs.map(job => `
                    <li>
                        <strong>${job.title}</strong> at ${job.company}
                        <br/>Location: ${job.location}
                        <br/>Link: <a href="${job.url}">View Job</a>
                    </li>
                `).join('')}
            </ul>
            <p>Review and apply to promising opportunities!</p>
        `;
        
        return this.sendEmailSendGrid(
            recipientEmail,
            `${jobs.length} New Job Matches - ${aiName}`,
            htmlContent
        );
    }

    /**
     * Batch job search across multiple sources
     */
    async searchJobsBatch(query, location) {
        try {
            const [indeedJobs, linkedinJobs] = await Promise.all([
                this.searchJobsIndeed(query, location, 15),
                this.searchJobsLinkedIn(query, location, 15)
            ]);

            // Combine and deduplicate
            const allJobs = [...indeedJobs, ...linkedinJobs];
            const uniqueJobs = Array.from(
                new Map(allJobs.map(job => [job.id, job])).values()
            );

            return uniqueJobs;
        } catch (error) {
            console.error('Batch search error:', error);
            return [];
        }
    }

    /**
     * Send notification to user (SMS + Email)
     */
    async notifyUser(email, phone, message) {
        const results = await Promise.all([
            this.sendEmailSendGrid(email, 'Multi-Room Alert', `<p>${message}</p>`),
            phone ? this.sendSmsTwilio(phone, message) : Promise.resolve(true)
        ]);
        return results.every(r => r === true);
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = APIIntegration;
}
