import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('next/font/google', () => ({
  Kanit: () => ({ variable: '--font-kanit' }),
}));

import RootLayout, { metadata } from '@/app/layout';

describe('RootLayout', () => {
  it('renders children inside the layout', async () => {
    render(
      <RootLayout>{<div>Test Child</div>}</RootLayout>
    );

    const layoutElement = await RootLayout({ children: <div>Test Child</div> });
    const bodyElement = layoutElement?.props.children;

    expect(bodyElement.props.className).toContain('--font-kanit');
    expect(bodyElement.props.className).toContain('antialiased');
    expect(await screen.findByText('Test Child')).toBeInTheDocument();
  });

  it('exports correct metadata', () => {
    expect(metadata.title).toBe('Advanced Simulation Modding Group');
    expect(metadata.description).toBe('A web endpoint to access content made by the Advanced Simulation Modding Group and online championship hosted by Advanced Simulation Racing Club');
  });
});
