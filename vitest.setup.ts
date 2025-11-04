import '@testing-library/jest-dom';
import React from 'react';
import { vi } from 'vitest';

// Mock CSS modules (virtual)
vi.mock('*.module.css', () => ({}));

// Mock next/image to render a simple img in tests
vi.mock('next/image', () => {
  return {
    __esModule: true,
    default: (props: any) => {
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return React.createElement('img', { src: props.src, alt: props.alt, ...(props as any) });
    },
  };
});

// If you use next/navigation or next/router in components, you can mock them here as needed.
// Example:
// vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }));

// Optionally stub antd components used in tests to avoid heavy internals (Skeleton example)
vi.mock('antd', async () => {
  const actual = await vi.importActual<any>('antd');
  return {
    ...actual,
    Skeleton: (props: any) => props.children || null,
  };
});
