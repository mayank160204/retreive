import { describe, expect, it } from '@jest/globals';

function hasResetToken(searchParams: Pick<URLSearchParams, 'get'>): boolean {
  return Boolean(searchParams.get('code') || searchParams.get('oobCode'));
}

describe('reset password token detection', () => {
  it('accepts code-based reset links', () => {
    expect(hasResetToken(new URLSearchParams('code=abc123'))).toBe(true);
  });

  it('accepts oobCode-based reset links', () => {
    expect(hasResetToken(new URLSearchParams('oobCode=xyz789'))).toBe(true);
  });

  it('rejects links without a reset token', () => {
    expect(hasResetToken(new URLSearchParams(''))).toBe(false);
  });
});