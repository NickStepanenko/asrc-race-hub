import '@testing-library/jest-dom';
import React from 'react';
import { vi } from 'vitest';

// Mock CSS modules (virtual)
vi.mock('*.module.css', () => ({}));

// Mock next/image to render a simple img in tests
vi.mock('next/image', () => {
  return {
    __esModule: true,
    default: (props: { src: string, alt: string }) => {
      return React.createElement('img', { ...(props) });
    },
  };
});

// If you use next/navigation or next/router in components, you can mock them here as needed.
// Example:
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => ({ get: vi.fn() }),
  usePathname: () => ({ startsWith: vi.fn() }),
}));

// Optionally stub antd components used in tests to avoid heavy internals (Skeleton example)
vi.mock('antd', async () => {
  const actual = await vi.importActual<any>('antd');
  return {
    ...actual,
    Skeleton: (props: any) => props.children || null,
  };
});
