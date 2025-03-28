import { describe, expect, it } from 'bun:test';
import { initialized } from '@/index.ts';

describe('Initial Test', () => {
    it('is a place holder for now', () => {
        expect(initialized).toBeTrue();
    });
});
