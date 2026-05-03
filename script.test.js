const utils = require('./utils.js');

describe('Civic AI Utilities', () => {
    describe('Security: sanitizeText', () => {
        it('should escape HTML tags to prevent XSS', () => {
            const maliciousInput = '<script>alert("XSS")</script>';
            const safeOutput = utils.sanitizeText(maliciousInput);
            expect(safeOutput).not.toContain('<script>');
            expect(safeOutput).toContain('&lt;script&gt;');
        });

        it('should handle empty or null strings gracefully', () => {
            expect(utils.sanitizeText('')).toBe('');
            expect(utils.sanitizeText(null)).toBe('');
        });
    });

    describe('Logic: calculateTimelineStep', () => {
        it('should return 1 (Registration) for generic text', () => {
            expect(utils.calculateTimelineStep('Hello, how do I start?')).toBe(1);
        });

        it('should return 2 (Research) when discussing candidates', () => {
            expect(utils.calculateTimelineStep('I want to research the local candidates')).toBe(2);
            expect(utils.calculateTimelineStep('What are the ballot measures?')).toBe(2);
        });

        it('should return 3 (Voting Plan) when discussing mail-in ballots', () => {
            expect(utils.calculateTimelineStep('How do I vote by mail?')).toBe(3);
            expect(utils.calculateTimelineStep('I need an absentee ballot')).toBe(3);
        });

        it('should return 4 (Election Day) when discussing voting day', () => {
            expect(utils.calculateTimelineStep('What do I bring on election day?')).toBe(4);
            expect(utils.calculateTimelineStep('Where do I cast my vote?')).toBe(4);
        });
    });
});
