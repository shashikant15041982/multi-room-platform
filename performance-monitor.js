/**
 * Performance Monitor & Optimization
 * Track, analyze, and optimize app performance
 */

class PerformanceMonitor {
    constructor(config = {}) {
        this.config = {
            sampleInterval: config.sampleInterval || 5000, // 5 seconds
            metricsLimit: config.metricsLimit || 1000,
            ...config
        };

        this.metrics = {
            pageLoad: [],
            interactions: [],
            memory: [],
            rendering: [],
            api: []
        };

        this.startTime = performance.now();
        this.startMonitoring();
    }

    /**
     * Record page load performance
     */
    recordPageLoad() {
        const perfData = performance.getEntriesByType('navigation')[0];

        if (perfData) {
            const metric = {
                timestamp: new Date().toISOString(),
                dns: perfData.domainLookupEnd - perfData.domainLookupStart,
                tcp: perfData.connectEnd - perfData.connectStart,
                ttfb: perfData.responseStart - perfData.requestStart,
                download: perfData.responseEnd - perfData.responseStart,
                dom: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                load: perfData.loadEventEnd - perfData.loadEventStart,
                total: perfData.loadEventEnd - perfData.fetchStart,
                interactive: this.getInteractiveTime()
            };

            this.addMetric('pageLoad', metric);
            return metric;
        }
        return null;
    }

    /**
     * Record interaction latency
     */
    recordInteraction(action, duration) {
        const metric = {
            timestamp: new Date().toISOString(),
            action: action,
            duration: duration,
            type: this.categorizeDuration(duration)
        };

        this.addMetric('interactions', metric);
        return metric;
    }

    /**
     * Record memory usage
     */
    recordMemory() {
        if (performance.memory) {
            const metric = {
                timestamp: new Date().toISOString(),
                usedJSHeapSize: performance.memory.usedJSHeapSize / 1048576, // MB
                totalJSHeapSize: performance.memory.totalJSHeapSize / 1048576,
                jsHeapSizeLimit: performance.memory.jsHeapSizeLimit / 1048576,
                utilization: (performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100
            };

            this.addMetric('memory', metric);
            return metric;
        }
        return null;
    }

    /**
     * Record rendering performance
     */
    recordRendering(fps, frameTime) {
        const metric = {
            timestamp: new Date().toISOString(),
            fps: fps,
            frameTime: frameTime,
            quality: this.categorizePerformance(fps)
        };

        this.addMetric('rendering', metric);
        return metric;
    }

    /**
     * Record API latency
     */
    recordAPICall(endpoint, method, duration, status) {
        const metric = {
            timestamp: new Date().toISOString(),
            endpoint: endpoint,
            method: method,
            duration: duration,
            status: status,
            type: status < 300 ? 'success' : 'error'
        };

        this.addMetric('api', metric);
        return metric;
    }

    /**
     * Add metric (with auto-trimming)
     */
    addMetric(category, metric) {
        if (!this.metrics[category]) {
            this.metrics[category] = [];
        }

        this.metrics[category].push(metric);

        // Trim if exceeds limit
        if (this.metrics[category].length > this.config.metricsLimit) {
            this.metrics[category] = this.metrics[category].slice(-this.config.metricsLimit);
        }
    }

    /**
     * Get performance summary
     */
    getPerformanceSummary() {
        return {
            pageLoad: this.analyzePageLoad(),
            interactions: this.analyzeInteractions(),
            memory: this.analyzeMemory(),
            rendering: this.analyzeRendering(),
            api: this.analyzeAPI(),
            health: this.getHealthScore()
        };
    }

    /**
     * Analyze page load metrics
     */
    analyzePageLoad() {
        const loads = this.metrics.pageLoad;
        if (loads.length === 0) return null;

        const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

        return {
            averageLoadTime: Math.round(avg(loads.map(l => l.total))),
            avgInteractiveTime: Math.round(avg(loads.map(l => l.interactive))),
            fastest: Math.min(...loads.map(l => l.total)),
            slowest: Math.max(...loads.map(l => l.total)),
            samples: loads.length
        };
    }

    /**
     * Analyze interaction metrics
     */
    analyzeInteractions() {
        const interactions = this.metrics.interactions;
        if (interactions.length === 0) return null;

        const durations = interactions.map(i => i.duration);
        const avg = durations.reduce((a, b) => a + b, 0) / durations.length;

        return {
            averageLatency: Math.round(avg),
            median: this.calculateMedian(durations),
            p95: this.calculatePercentile(durations, 95),
            p99: this.calculatePercentile(durations, 99),
            slow: interactions.filter(i => i.duration > 100).length,
            samples: interactions.length
        };
    }

    /**
     * Analyze memory metrics
     */
    analyzeMemory() {
        const memory = this.metrics.memory;
        if (memory.length === 0) return null;

        const latest = memory[memory.length - 1];
        const avgUtilization = memory.reduce((sum, m) => sum + m.utilization, 0) / memory.length;

        return {
            currentUsage: Math.round(latest.usedJSHeapSize),
            totalHeap: Math.round(latest.totalJSHeapSize),
            heapLimit: Math.round(latest.jsHeapSizeLimit),
            utilization: Math.round(latest.utilization),
            averageUtilization: Math.round(avgUtilization),
            trend: this.getTrend(memory.map(m => m.utilization)),
            status: avgUtilization > 80 ? 'warning' : avgUtilization > 90 ? 'critical' : 'healthy'
        };
    }

    /**
     * Analyze rendering metrics
     */
    analyzeRendering() {
        const rendering = this.metrics.rendering;
        if (rendering.length === 0) return null;

        const fps = rendering.map(r => r.fps);
        const avgFPS = fps.reduce((a, b) => a + b, 0) / fps.length;

        return {
            averageFPS: Math.round(avgFPS),
            minFPS: Math.min(...fps),
            maxFPS: Math.max(...fps),
            droppedFrames: rendering.filter(r => r.fps < 30).length,
            quality: this.categorizePerformance(avgFPS),
            samples: rendering.length
        };
    }

    /**
     * Analyze API metrics
     */
    analyzeAPI() {
        const api = this.metrics.api;
        if (api.length === 0) return null;

        const durations = api.map(a => a.duration);
        const success = api.filter(a => a.type === 'success').length;

        return {
            totalCalls: api.length,
            successRate: Math.round((success / api.length) * 100),
            averageLatency: Math.round(durations.reduce((a, b) => a + b, 0) / durations.length),
            slowestCall: Math.max(...durations),
            fastestCall: Math.min(...durations),
            p95Latency: this.calculatePercentile(durations, 95)
        };
    }

    /**
     * Calculate health score (0-100)
     */
    getHealthScore() {
        let score = 100;

        // Page load (10 points)
        const pageLoad = this.analyzePageLoad();
        if (pageLoad && pageLoad.averageLoadTime > 2000) score -= 5;
        if (pageLoad && pageLoad.averageLoadTime > 3000) score -= 5;

        // Interactions (15 points)
        const interactions = this.analyzeInteractions();
        if (interactions && interactions.averageLatency > 100) score -= 5;
        if (interactions && interactions.p99 > 200) score -= 5;
        if (interactions && interactions.slow > 0) score -= 5;

        // Memory (15 points)
        const memory = this.analyzeMemory();
        if (memory && memory.utilization > 70) score -= 5;
        if (memory && memory.utilization > 85) score -= 10;

        // Rendering (15 points)
        const rendering = this.analyzeRendering();
        if (rendering && rendering.averageFPS < 55) score -= 5;
        if (rendering && rendering.averageFPS < 30) score -= 10;

        // API (15 points)
        const apiStats = this.analyzeAPI();
        if (apiStats && apiStats.successRate < 95) score -= 5;
        if (apiStats && apiStats.averageLatency > 300) score -= 5;
        if (apiStats && apiStats.averageLatency > 500) score -= 5;

        return Math.max(0, score);
    }

    /**
     * Get performance recommendations
     */
    getRecommendations() {
        const recommendations = [];
        const summary = this.getPerformanceSummary();

        // Page load recommendations
        if (summary.pageLoad?.averageLoadTime > 3000) {
            recommendations.push('✅ Optimize page load: Cache assets, enable compression, reduce CSS');
        }

        // Memory recommendations
        if (summary.memory?.utilization > 80) {
            recommendations.push('⚠️ Memory usage high: Clear old data, reduce localStorage, enable garbage collection');
        }

        // Rendering recommendations
        if (summary.rendering?.averageFPS < 50) {
            recommendations.push('🎯 Rendering slow: Reduce DOM manipulation, optimize CSS animations, enable hardware acceleration');
        }

        // API recommendations
        if (summary.api?.successRate < 95) {
            recommendations.push('🔌 API reliability: Add retry logic, implement circuit breaker, check backend');
        }

        if (summary.health > 80) {
            recommendations.push('✅ Performance is excellent! Keep up the good work!');
        }

        return recommendations;
    }

    /**
     * Start continuous monitoring
     */
    startMonitoring() {
        // Monitor memory every 10 seconds
        setInterval(() => {
            this.recordMemory();
        }, 10000);

        // Monitor rendering (simplified)
        let lastTime = performance.now();
        let frames = 0;

        const measureFPS = () => {
            const now = performance.now();
            const delta = now - lastTime;

            if (delta >= 1000) {
                this.recordRendering(Math.round((frames / delta) * 1000), delta / frames);
                frames = 0;
                lastTime = now;
            }

            frames++;
            requestAnimationFrame(measureFPS);
        };

        measureFPS();
    }

    /**
     * Helper functions
     */

    calculateMedian(arr) {
        const sorted = [...arr].sort((a, b) => a - b);
        return sorted[Math.floor(sorted.length / 2)];
    }

    calculatePercentile(arr, p) {
        const sorted = [...arr].sort((a, b) => a - b);
        const index = Math.ceil((p / 100) * sorted.length) - 1;
        return sorted[Math.max(0, index)];
    }

    categorizeDuration(ms) {
        if (ms < 50) return 'excellent';
        if (ms < 100) return 'good';
        if (ms < 200) return 'fair';
        return 'poor';
    }

    categorizePerformance(fps) {
        if (fps >= 55) return 'excellent';
        if (fps >= 45) return 'good';
        if (fps >= 30) return 'fair';
        return 'poor';
    }

    getTrend(values) {
        if (values.length < 2) return 'stable';
        const recent = values.slice(-5);
        const avg1 = recent.slice(0, 2).reduce((a, b) => a + b) / 2;
        const avg2 = recent.slice(-2).reduce((a, b) => a + b) / 2;
        if (avg2 > avg1) return 'increasing';
        if (avg2 < avg1) return 'decreasing';
        return 'stable';
    }

    getInteractiveTime() {
        const perfData = performance.getEntriesByType('navigation')[0];
        return perfData ? perfData.domInteractive - perfData.fetchStart : 0;
    }

    /**
     * Export metrics
     */
    exportMetrics() {
        return {
            exportDate: new Date().toISOString(),
            metrics: this.metrics,
            summary: this.getPerformanceSummary(),
            recommendations: this.getRecommendations()
        };
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceMonitor;
}
