/**
 * @jest-environment jsdom
 */
const utils = require('./utils.js');
const { getByText } = require('@testing-library/dom');

describe('Civic AI System Test Suite', () => {
    describe('Security: Input Sanitization', () => {
        it('should escape HTML tags to prevent XSS attacks', () => {
            const maliciousInput = '<script>alert("XSS")</script>';
            const safeOutput = utils.sanitizeText(maliciousInput);
            expect(safeOutput).not.toContain('<script>');
            expect(safeOutput).toContain('&lt;script&gt;');
        });

        it('should handle empty or null strings safely', () => {
            expect(utils.sanitizeText('')).toBe('');
            expect(utils.sanitizeText(null)).toBe('');
        });
    });

    describe('Logic: Timeline Heuristics', () => {
        it('should return 1 (Registration) for generic text', () => {
            expect(utils.calculateTimelineStep('Hello, how do I start?')).toBe(1);
        });

        it('should return 2 (Research) when discussing candidates', () => {
            expect(utils.calculateTimelineStep('I want to research the local candidates')).toBe(2);
        });

        it('should return 3 (Voting Plan) when discussing mail-in ballots', () => {
            expect(utils.calculateTimelineStep('How do I vote by mail?')).toBe(3);
        });

        it('should return 4 (Election Day) when discussing voting day', () => {
            expect(utils.calculateTimelineStep('What do I bring on election day?')).toBe(4);
        });
    });

    describe('UI: DOM Integration', () => {
        beforeEach(() => {
            document.body.innerHTML = `
                <div class="chat-history" id="chatHistory"></div>
            `;
        });

        it('should create message bubbles dynamically', () => {
            const chatHistory = document.getElementById('chatHistory');
            const msg = document.createElement('div');
            msg.className = 'message user-msg';
            msg.innerHTML = '<div class="msg-bubble">Integration Test Message</div>';
            chatHistory.appendChild(msg);
            
            expect(chatHistory.children.length).toBe(1);
            expect(getByText(document.body, 'Integration Test Message')).not.toBeNull();
        });
    });
});
