#!/usr/bin/env node

/**
 * Optimized Keep-Alive Service for Socioambiental Blog
 * Consolidates multiple keep-alive scripts into a single efficient service
 * 
 * Usage: node optimized-keep-alive.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
    // Primary endpoints to keep alive
    endpoints: [
        'https://blogsocioambiental-afs.vercel.app/api/health',
        'https://blogsocioambiental-afs.vercel.app/api/posts'
    ],
    
    // Timing configuration
    interval: 5 * 60 * 1000, // 5 minutes
    timeout: 10000, // 10 seconds
    
    // Logging
    logFile: path.join(__dirname, 'keep-alive-optimized.log'),
    
    // Retry configuration
    maxRetries: 3,
    retryDelay: 1000
};

class OptimizedKeepAlive {
    constructor(config) {
        this.config = config;
        this.isRunning = false;
        this.retryCount = 0;
    }

    log(message) {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] ${message}\n`;
        
        console.log(message);
        
        // Append to log file
        fs.appendFileSync(this.config.logFile, logEntry);
    }

    async checkEndpoint(url) {
        return new Promise((resolve, reject) => {
            const options = {
                hostname: new URL(url).hostname,
                path: new URL(url).pathname,
                method: 'GET',
                timeout: this.config.timeout
            };

            const req = https.request(options, (res) => {
                const isHealthy = res.statusCode >= 200 && res.statusCode < 400;
                resolve({ url, status: res.statusCode, healthy: isHealthy });
            });

            req.on('error', (error) => {
                resolve({ url, error: error.message, healthy: false });
            });

            req.on('timeout', () => {
                req.destroy();
                resolve({ url, error: 'Timeout', healthy: false });
            });

            req.end();
        });
    }

    async checkAllEndpoints() {
        this.log('Starting health check round...');
        
        const results = await Promise.allSettled(
            this.config.endpoints.map(url => this.checkEndpoint(url))
        );

        const successful = [];
        const failed = [];

        results.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                const { url, status, healthy, error } = result.value;
                if (healthy) {
                    successful.push({ url, status });
                    this.log(`✅ ${url} - Status: ${status}`);
                } else {
                    failed.push({ url, error: error || `HTTP ${status}` });
                    this.log(`❌ ${url} - Error: ${error || status}`);
                }
            } else {
                failed.push({ url: this.config.endpoints[index], error: result.reason });
                this.log(`❌ ${this.config.endpoints[index]} - Error: ${result.reason}`);
            }
        });

        return { successful, failed };
    }

    async runHealthCheck() {
        try {
            const { successful, failed } = await this.checkAllEndpoints();
            
            if (failed.length > 0) {
                this.retryCount++;
                this.log(`Health check failed for ${failed.length} endpoints. Retry: ${this.retryCount}/${this.config.maxRetries}`);
                
                if (this.retryCount >= this.config.maxRetries) {
                    this.log('Max retries reached. Resetting counter.');
                    this.retryCount = 0;
                }
            } else {
                this.retryCount = 0;
                this.log(`All ${successful.length} endpoints are healthy`);
            }
        } catch (error) {
            this.log(`Health check error: ${error.message}`);
        }
    }

    start() {
        if (this.isRunning) {
            this.log('Keep-alive service is already running');
            return;
        }

        this.isRunning = true;
        this.log('Starting optimized keep-alive service...');
        
        // Initial check
        this.runHealthCheck();
        
        // Schedule recurring checks
        this.intervalId = setInterval(() => {
            this.runHealthCheck();
        }, this.config.interval);

        this.log(`Keep-alive service started. Checking every ${this.config.interval / 1000 / 60} minutes`);
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.isRunning = false;
        this.log('Keep-alive service stopped');
    }
}

// CLI Interface
if (require.main === module) {
    const keepAlive = new OptimizedKeepAlive(CONFIG);
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
        keepAlive.stop();
        process.exit(0);
    });

    process.on('SIGTERM', () => {
        keepAlive.stop();
        process.exit(0);
    });

    // Start the service
    keepAlive.start();
}

module.exports = OptimizedKeepAlive;
