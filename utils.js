/**
 * Utility functions for Civic AI
 * Separated for architectural purity and testability.
 */
const utils = {
    /**
     * Sanitizes input text to prevent XSS attacks.
     * Uses DOMPurify if available in the browser, otherwise falls back to basic HTML escaping.
     * @param {string} str - The raw input string
     * @returns {string} - The sanitized string
     */
    sanitizeText: (str) => {
        if (!str) return "";
        if (typeof DOMPurify !== 'undefined') {
            return DOMPurify.sanitize(str);
        }
        // Fallback basic sanitization for Node environments (testing) or if CDN fails
        return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    },

    /**
     * Analyzes conversation context to determine the current step in the election journey.
     * @param {string} textContext - The combined text of recent chat messages
     * @returns {number} - The step number (1 to 4)
     */
    calculateTimelineStep: (textContext) => {
        const lower = textContext.toLowerCase();
        if (lower.includes('research') || lower.includes('measure') || lower.includes('candidate')) {
            return 2;
        } else if (lower.includes('mail') || lower.includes('absentee') || lower.includes('plan')) {
            return 3;
        } else if (lower.includes('day') || lower.includes('vote')) {
            return 4;
        }
        return 1;
    }
};

// Export for Jest (Node.js) or attach to window for Browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = utils;
} else {
    window.utils = utils;
}
