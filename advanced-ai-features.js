/**
 * Advanced AI Features Module
 * Context compression, token optimization, intelligent relay logic
 */

class AdvancedAIEngine {
    constructor(config = {}) {
        this.config = {
            compressionRatio: config.compressionRatio || 0.7,
            contextWindow: config.contextWindow || 8000,
            maxRetries: config.maxRetries || 3,
            ...config
        };

        this.aiProfiles = {
            claude: { strength: 'reasoning', efficiency: 95, costPerK: 0.003 },
            chatgpt: { strength: 'consistency', efficiency: 87, costPerK: 0.002 },
            deepseek: { strength: 'speed', efficiency: 82, costPerK: 0.0015 },
            mistral: { strength: 'cost', efficiency: 79, costPerK: 0.0014 }
        };
    }

    /**
     * Compress context while preserving meaning
     */
    compressContext(context, targetSize = 2000) {
        const words = context.split(' ');
        const compressionFactor = targetSize / context.length;

        if (compressionFactor >= 1) return context; // No compression needed

        // Prioritize sentences with key terms
        const keyTerms = ['important', 'critical', 'must', 'should', 'error', 'failure'];
        const sentences = context.match(/[^.!?]+[.!?]+/g) || [];

        const scoredSentences = sentences.map(sentence => {
            let score = sentence.length;
            keyTerms.forEach(term => {
                if (sentence.toLowerCase().includes(term)) {
                    score += 100;
                }
            });
            return { sentence: sentence.trim(), score };
        });

        // Keep high-scoring sentences
        const targetSentences = Math.ceil(sentences.length * compressionFactor);
        const selected = scoredSentences
            .sort((a, b) => b.score - a.score)
            .slice(0, targetSentences)
            .sort((a, b) => sentences.indexOf(a.sentence) - sentences.indexOf(b.sentence))
            .map(s => s.sentence)
            .join(' ');

        return selected;
    }

    /**
     * Analyze context quality and size
     */
    analyzeContext(context) {
        return {
            length: context.length,
            wordCount: context.split(' ').length,
            sentenceCount: (context.match(/[.!?]/g) || []).length,
            estimatedTokens: Math.ceil(context.length / 4),
            quality: this.calculateContextQuality(context)
        };
    }

    /**
     * Calculate context quality score (0-100)
     */
    calculateContextQuality(context) {
        let score = 50;

        // Boost for key information markers
        const markers = ['timestamp', 'execution', 'result', 'error', 'status'];
        markers.forEach(marker => {
            if (context.toLowerCase().includes(marker)) {
                score += 5;
            }
        });

        // Reduce for duplication
        const words = context.split(' ');
        const uniqueWords = new Set(words).size;
        const deduplicationScore = (uniqueWords / words.length) * 50;
        score = (score + deduplicationScore) / 2;

        return Math.min(100, Math.max(0, score));
    }

    /**
     * Intelligent AI selection based on task
     */
    selectBestAI(taskType, priority = 'balance') {
        const rankings = {
            reasoning: { claude: 1, chatgpt: 2, deepseek: 3, mistral: 4 },
            consistency: { chatgpt: 1, claude: 2, deepseek: 3, mistral: 4 },
            speed: { deepseek: 1, mistral: 2, chatgpt: 3, claude: 4 },
            cost: { mistral: 1, deepseek: 2, chatgpt: 3, claude: 4 },
            balance: { claude: 1, chatgpt: 2, mistral: 3, deepseek: 4 }
        };

        const ranking = rankings[taskType] || rankings.balance;
        const sorted = Object.entries(ranking)
            .sort((a, b) => a[1] - b[1])
            .map(([ai]) => ai);

        return sorted[0];
    }

    /**
     * Advanced relay logic - predict best handoff
     */
    predictRelayNeed(executionHistory, currentAI, tokenUsage) {
        const threshold = currentAI === 'claude' ? 0.85 : 0.80;
        const tokenRatio = tokenUsage.used / tokenUsage.limit;

        if (tokenRatio >= threshold) {
            return {
                needsRelay: true,
                urgency: 'high',
                reason: 'Token threshold exceeded',
                recommendedAI: this.selectBestAI('balance')
            };
        }

        // Check for performance degradation
        const recentPerformance = executionHistory.slice(-5);
        const avgQuality = recentPerformance.reduce((sum, exec) => sum + exec.quality, 0) / recentPerformance.length;

        if (avgQuality < 60) {
            return {
                needsRelay: true,
                urgency: 'medium',
                reason: 'Performance degradation detected',
                recommendedAI: this.selectBestAI('reasoning')
            };
        }

        return { needsRelay: false };
    }

    /**
     * Optimize prompt for specific AI
     */
    optimizePromptForAI(prompt, aiName) {
        const optimizations = {
            claude: (p) => `You are an expert AI assistant. ${p}\nProvide detailed reasoning and step-by-step analysis.`,
            chatgpt: (p) => `${p}\nBe clear, concise, and structured in your response.`,
            deepseek: (p) => `${p}\nPrioritize speed and efficiency in your analysis.`,
            mistral: (p) => `${p}\nFocus on practical, actionable insights.`
        };

        const optimizer = optimizations[aiName] || ((p) => p);
        return optimizer(prompt);
    }

    /**
     * Calculate execution quality score
     */
    calculateExecutionQuality(execution) {
        let score = 50;

        // Speed bonus
        if (execution.duration < 2) score += 20;
        if (execution.duration < 5) score += 10;

        // Result quality
        if (execution.jobsFound > 20) score += 20;
        if (execution.jobsFound > 10) score += 10;

        // Token efficiency
        const tokenEfficiency = execution.jobsFound / (execution.tokensUsed / 1000);
        if (tokenEfficiency > 10) score += 15;
        if (tokenEfficiency > 5) score += 8;

        return Math.min(100, Math.max(0, score));
    }

    /**
     * Predictive handoff - anticipate when user might need relay
     */
    predictiveRelay(room, upcomingExecutions = []) {
        const predictions = [];

        upcomingExecutions.forEach((exec, index) => {
            const projectedTokens = room.tokenUsed + (exec.estimatedTokens || 5000);
            const projectedRatio = projectedTokens / (room.tokenBudget || 100000);

            if (projectedRatio >= 0.80) {
                predictions.push({
                    executionIndex: index,
                    projectedTokenRatio: projectedRatio,
                    recommendedAction: 'Prepare for relay',
                    suggestedAI: this.selectBestAI('balance')
                });
            }
        });

        return predictions;
    }

    /**
     * Context memory management
     */
    manageContextMemory(messages, maxMemoryTokens = 4000) {
        let totalTokens = 0;
        const retained = [];

        // Keep recent messages up to token limit
        for (let i = messages.length - 1; i >= 0; i--) {
            const msgTokens = Math.ceil(messages[i].text.length / 4);
            if (totalTokens + msgTokens <= maxMemoryTokens) {
                retained.unshift(messages[i]);
                totalTokens += msgTokens;
            } else {
                break;
            }
        }

        return {
            retained: retained,
            discarded: messages.length - retained.length,
            totalTokens: totalTokens,
            compressionRate: retained.length / messages.length
        };
    }

    /**
     * Batch optimization - process multiple tasks efficiently
     */
    optimizeBatch(tasks, aiAssignments = {}) {
        const optimized = tasks.map(task => {
            const ai = aiAssignments[task.id] || this.selectBestAI(task.type);
            const optimizedPrompt = this.optimizePromptForAI(task.prompt, ai);

            return {
                ...task,
                assignedAI: ai,
                optimizedPrompt: optimizedPrompt,
                estimatedCost: this.estimateCost(ai, optimizedPrompt)
            };
        });

        // Sort by estimated cost to batch cheaper tasks
        return optimized.sort((a, b) => a.estimatedCost - b.estimatedCost);
    }

    /**
     * Estimate execution cost
     */
    estimateCost(aiName, prompt) {
        const profile = this.aiProfiles[aiName];
        if (!profile) return 0;

        const inputTokens = Math.ceil(prompt.length / 4);
        const outputTokens = inputTokens * 0.5; // Estimate

        return ((inputTokens + outputTokens) / 1000) * profile.costPerK;
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedAIEngine;
}
