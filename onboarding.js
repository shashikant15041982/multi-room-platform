/**
 * User Onboarding & Training System
 * Interactive tutorials and guided experiences
 */

class OnboardingManager {
    constructor(config = {}) {
        this.config = {
            skipAllowed: config.skipAllowed !== false,
            ...config
        };

        this.tutorials = this.initializeTutorials();
        this.userProgress = {};
        this.activeTutorial = null;
    }

    /**
     * Initialize all available tutorials
     */
    initializeTutorials() {
        return {
            'first-login': {
                id: 'first-login',
                title: 'Welcome to Multi-Room Platform',
                description: 'Get started in 3 steps',
                duration: '5 min',
                steps: [
                    {
                        title: 'Sign In',
                        description: 'Enter your email and sign in to the platform',
                        action: 'auth',
                        highlight: '.login-form'
                    },
                    {
                        title: 'Choose a Room',
                        description: 'Select Room 1, 2, or 3 to work in',
                        action: 'room-select',
                        highlight: '.room-selector'
                    },
                    {
                        title: 'Run Your First Execution',
                        description: 'Click "Run Execution" to see the AI in action',
                        action: 'execution',
                        highlight: '.run-execution-btn'
                    }
                ]
            },

            'execution-guide': {
                id: 'execution-guide',
                title: 'Running Executions',
                description: 'Learn how to run and manage executions',
                duration: '3 min',
                steps: [
                    {
                        title: 'Click Run Execution',
                        description: 'Click the blue "Run Execution" button to start',
                        action: 'click-run',
                        highlight: '.run-execution-btn'
                    },
                    {
                        title: 'View Results',
                        description: 'Check the Executions tab for results',
                        action: 'view-results',
                        highlight: '.executions-tab'
                    },
                    {
                        title: 'Monitor Token Usage',
                        description: 'Watch token usage in the status bar',
                        action: 'monitor-tokens',
                        highlight: '.token-usage'
                    }
                ]
            },

            'email-relay': {
                id: 'email-relay',
                title: 'Email & Relay System',
                description: 'Send emails and manage relay events',
                duration: '3 min',
                steps: [
                    {
                        title: 'Send Email',
                        description: 'Click "Send Email" to compose and send',
                        action: 'send-email',
                        highlight: '.send-email-btn'
                    },
                    {
                        title: 'View Emails',
                        description: 'Check Emails tab for sent messages',
                        action: 'view-emails',
                        highlight: '.emails-tab'
                    },
                    {
                        title: 'Track Relays',
                        description: 'See relay events in the Relays tab',
                        action: 'view-relays',
                        highlight: '.relays-tab'
                    }
                ]
            },

            'ai-switching': {
                id: 'ai-switching',
                title: 'AI Auto-Switching',
                description: 'Understand how AI switches when tokens run out',
                duration: '2 min',
                steps: [
                    {
                        title: 'Current AI',
                        description: 'See current AI in status bar',
                        action: 'current-ai',
                        highlight: '.current-ai'
                    },
                    {
                        title: 'Token Monitor',
                        description: 'When 85% of tokens used, AI switches automatically',
                        action: 'token-alert',
                        highlight: '.token-warning'
                    },
                    {
                        title: 'Relay Event',
                        description: 'Relay event created when switching occurs',
                        action: 'relay-event',
                        highlight: '.relays-tab'
                    }
                ]
            },

            'analytics': {
                id: 'analytics',
                title: 'Analytics Dashboard',
                description: 'View performance metrics and insights',
                duration: '4 min',
                steps: [
                    {
                        title: 'Open Analytics',
                        description: 'Click Analytics link to view dashboard',
                        action: 'open-analytics',
                        highlight: '.analytics-link'
                    },
                    {
                        title: 'KPIs',
                        description: 'See key performance indicators at the top',
                        action: 'view-kpis',
                        highlight: '.kpi-cards'
                    },
                    {
                        title: 'Charts',
                        description: 'Analyze trends with interactive charts',
                        action: 'view-charts',
                        highlight: '.charts-container'
                    }
                ]
            },

            'team-setup': {
                id: 'team-setup',
                title: 'Team Collaboration',
                description: 'Create a team and invite members',
                duration: '5 min',
                steps: [
                    {
                        title: 'Create Team',
                        description: 'Go to settings and click "Create Team"',
                        action: 'create-team',
                        highlight: '.create-team-btn'
                    },
                    {
                        title: 'Invite Members',
                        description: 'Enter emails to invite collaborators',
                        action: 'invite-members',
                        highlight: '.invite-form'
                    },
                    {
                        title: 'Set Permissions',
                        description: 'Assign roles: Owner, Admin, Member, Viewer',
                        action: 'set-permissions',
                        highlight: '.permissions-section'
                    }
                ]
            }
        };
    }

    /**
     * Start a tutorial
     */
    startTutorial(tutorialId) {
        const tutorial = this.tutorials[tutorialId];
        if (!tutorial) return null;

        this.activeTutorial = {
            id: tutorialId,
            currentStep: 0,
            startTime: new Date().toISOString(),
            completed: false
        };

        return this.getCurrentStep();
    }

    /**
     * Get current step of active tutorial
     */
    getCurrentStep() {
        if (!this.activeTutorial) return null;

        const tutorial = this.tutorials[this.activeTutorial.id];
        const step = tutorial.steps[this.activeTutorial.currentStep];

        return {
            tutorial: tutorial,
            step: step,
            stepNumber: this.activeTutorial.currentStep + 1,
            totalSteps: tutorial.steps.length,
            progress: Math.round(((this.activeTutorial.currentStep + 1) / tutorial.steps.length) * 100)
        };
    }

    /**
     * Move to next step
     */
    nextStep() {
        if (!this.activeTutorial) return null;

        const tutorial = this.tutorials[this.activeTutorial.id];
        this.activeTutorial.currentStep++;

        if (this.activeTutorial.currentStep >= tutorial.steps.length) {
            return this.completeTutorial();
        }

        return this.getCurrentStep();
    }

    /**
     * Complete tutorial
     */
    completeTutorial() {
        if (!this.activeTutorial) return null;

        this.activeTutorial.completed = true;
        this.activeTutorial.completionTime = new Date().toISOString();

        // Save progress
        this.userProgress[this.activeTutorial.id] = {
            completed: true,
            completedAt: this.activeTutorial.completionTime,
            startedAt: this.activeTutorial.startTime
        };

        const result = {
            tutorial: this.tutorials[this.activeTutorial.id],
            ...this.activeTutorial
        };

        this.activeTutorial = null;

        return result;
    }

    /**
     * Skip tutorial
     */
    skipTutorial() {
        if (!this.config.skipAllowed) return null;

        if (this.activeTutorial) {
            this.userProgress[this.activeTutorial.id] = {
                skipped: true,
                skippedAt: new Date().toISOString()
            };

            this.activeTutorial = null;
        }

        return { skipped: true };
    }

    /**
     * List all tutorials
     */
    listTutorials() {
        return Object.values(this.tutorials).map(tutorial => ({
            id: tutorial.id,
            title: tutorial.title,
            description: tutorial.description,
            duration: tutorial.duration,
            steps: tutorial.steps.length,
            completed: this.userProgress[tutorial.id]?.completed || false
        }));
    }

    /**
     * Get tutorial by ID
     */
    getTutorial(tutorialId) {
        return this.tutorials[tutorialId];
    }

    /**
     * Get user progress
     */
    getProgress() {
        const allTutorials = Object.keys(this.tutorials).length;
        const completed = Object.values(this.userProgress).filter(p => p.completed).length;

        return {
            completedTutorials: completed,
            totalTutorials: allTutorials,
            completionPercentage: Math.round((completed / allTutorials) * 100),
            progress: this.userProgress
        };
    }

    /**
     * Highlight UI element for tutorial
     */
    highlightElement(selector) {
        const element = document.querySelector(selector);
        if (!element) return false;

        // Remove previous highlights
        document.querySelectorAll('.tutorial-highlight').forEach(el => {
            el.classList.remove('tutorial-highlight');
        });

        // Add highlight
        element.classList.add('tutorial-highlight');
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });

        return true;
    }

    /**
     * Show tutorial tooltip
     */
    showTooltip(selector, title, description) {
        const element = document.querySelector(selector);
        if (!element) return false;

        const tooltip = document.createElement('div');
        tooltip.className = 'tutorial-tooltip';
        tooltip.innerHTML = `
            <div class="tutorial-tooltip-content">
                <h4>${title}</h4>
                <p>${description}</p>
            </div>
        `;

        // Position near element
        const rect = element.getBoundingClientRect();
        tooltip.style.position = 'fixed';
        tooltip.style.left = (rect.right + 10) + 'px';
        tooltip.style.top = rect.top + 'px';

        document.body.appendChild(tooltip);

        return tooltip;
    }

    /**
     * Get onboarding checklist
     */
    getOnboardingChecklist() {
        return [
            {
                task: 'Complete first login',
                completed: !!this.userProgress['first-login']?.completed
            },
            {
                task: 'Run an execution',
                completed: !!this.userProgress['execution-guide']?.completed
            },
            {
                task: 'Send an email',
                completed: !!this.userProgress['email-relay']?.completed
            },
            {
                task: 'View analytics',
                completed: !!this.userProgress['analytics']?.completed
            },
            {
                task: 'Create a team',
                completed: !!this.userProgress['team-setup']?.completed
            }
        ];
    }

    /**
     * Auto-recommend next tutorial
     */
    getRecommendedTutorial() {
        const completed = new Set(
            Object.entries(this.userProgress)
                .filter(([_, p]) => p.completed)
                .map(([id]) => id)
        );

        const order = [
            'first-login',
            'execution-guide',
            'email-relay',
            'ai-switching',
            'analytics',
            'team-setup'
        ];

        for (const tutorialId of order) {
            if (!completed.has(tutorialId)) {
                return this.tutorials[tutorialId];
            }
        }

        return null; // All tutorials completed
    }

    /**
     * Export progress
     */
    exportProgress() {
        return {
            progress: this.userProgress,
            checklist: this.getOnboardingChecklist(),
            completionPercentage: this.getProgress().completionPercentage,
            exportDate: new Date().toISOString()
        };
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OnboardingManager;
}
