import { describe, it, expect, vi } from 'vitest';
import { GET } from '@/app/api/championships/route';

// Mock the prisma import used by route.ts
vi.mock('@/lib/prisma', () => {
  return {
    prisma: {
      championships: {
        findMany: vi.fn().mockResolvedValue([
          { id: 1, title: 'Test Championship', logo: '/logo.png' },
        ]),
      },
    },
  };
});

describe('GET /api/championships', () => {
  it('returns championships list as JSON', async () => {
    const res = await GET();
    const data = await res.json();
    expect(data).toEqual([{ id: 1, title: 'Test Championship', logo: '/logo.png' }]);
  });
});