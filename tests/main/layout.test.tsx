import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('next/font/google', () => ({
  Kanit: (opts: any) => ({ variable: '--font-kanit' }),
}));

import RootLayout, { metadata } from '@/app/layout';

describe('RootLayout', () => {
  it('renders children inside the layout', async () => {
    render(
      <RootLayout children={<div>Test Child</div>} />
    );

    const layoutElement = RootLayout({ children: <div>Test Child</div> }) as any;
    const bodyElement = layoutElement.props.children as any;

    expect(bodyElement.props.className).toContain('--font-kanit');
    expect(bodyElement.props.className).toContain('antialiased');
    expect(await screen.findByText('Test Child')).toBeInTheDocument();
  });

  it('exports correct metadata', () => {
    expect(metadata.title).toBe('ASRC Race Hub');
    expect(metadata.description).toBe('Single-page hub built with Next.js and Ant Design');
  });
});
