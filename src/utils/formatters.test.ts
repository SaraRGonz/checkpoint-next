import { describe, it, expect } from 'vitest';
import { formatDate, formatRating } from './formatters';

describe('formatters', () => {
    describe('formatDate', () => {
        it('return formatted date -> GB locale', () => {
            const result = formatDate('2026-04-15T10:00:00Z');
            expect(result).toContain('15');
            expect(result).toContain('2026');
        });

        it('return "Unknown date" -> undefined input', () => {
            expect(formatDate(undefined)).toBe('Unknown date');
        });
    });

    describe('formatRating', () => {
        it('format integer -> 1 decimal', () => {
            expect(formatRating(4)).toBe('4.0');
        });

        it('return "N/A" -> 0 input', () => {
            expect(formatRating(0)).toBe('N/A');
        });

        it('keep decimal -> float input', () => {
            expect(formatRating(4.5)).toBe('4.5');
        });
    });
});