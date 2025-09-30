/**
 * ErrorHandler - Global error handling and logging
 */

export class ErrorHandler {
    constructor() {
        this.errors = [];
        this.maxErrors = 50;
        this.setupGlobalHandlers();
    }

    setupGlobalHandlers() {
        // Catch unhandled errors
        window.addEventListener('error', (event) => {
            this.logError('Runtime Error', event.error || event.message, {
                filename: event.filename,
                line: event.lineno,
                column: event.colno
            });
        });

        // Catch unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.logError('Unhandled Promise Rejection', event.reason);
        });

        // WebGL context loss
        window.addEventListener('webglcontextlost', (event) => {
            event.preventDefault();
            this.logError('WebGL Context Lost', 'GPU error or browser tab backgrounded');
            this.showUserError('Graphics error detected. Please refresh the page.');
        });
    }

    logError(type, message, details = {}) {
        const error = {
            type,
            message: message?.toString() || 'Unknown error',
            details,
            timestamp: Date.now(),
            stack: message?.stack || new Error().stack
        };

        this.errors.push(error);
        
        // Keep only recent errors
        if (this.errors.length > this.maxErrors) {
            this.errors.shift();
        }

        // Log to console
        console.error(`[${type}]`, message, details);

        // In production, would send to error tracking service
        return error;
    }

    showUserError(message) {
        // Show user-friendly error message
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #ff4444;
            color: white;
            padding: 20px 40px;
            border-radius: 8px;
            z-index: 10000;
            font-family: 'Inter', sans-serif;
            font-size: 16px;
            text-align: center;
            max-width: 400px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        `;
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            errorDiv.style.opacity = '0';
            errorDiv.style.transition = 'opacity 0.5s';
            setTimeout(() => errorDiv.remove(), 500);
        }, 5000);
    }

    getErrors() {
        return this.errors;
    }

    clearErrors() {
        this.errors = [];
    }

    checkCompatibility() {
        const issues = [];

        // Check WebGL
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
        if (!gl) {
            issues.push('WebGL not supported');
        }

        // Check Web Audio API
        if (!window.AudioContext && !window.webkitAudioContext) {
            issues.push('Web Audio API not supported');
        }

        // Check Pointer Lock API
        if (!document.body.requestPointerLock) {
            issues.push('Pointer Lock API not supported');
        }

        // Check localStorage
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
        } catch (e) {
            issues.push('LocalStorage not available');
        }

        if (issues.length > 0) {
            console.warn('Compatibility issues:', issues);
            this.showUserError(
                'Your browser may not support all features. ' +
                'Please use a modern browser like Chrome or Firefox.'
            );
        }

        return issues;
    }
}

export default ErrorHandler;