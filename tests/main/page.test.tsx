import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import Home from '@/app/page';

vi.mock('@/app/components/SinglePageLayout', () => ({
  __esModule: true,
  default: () => <div>ASRC Race Hub</div>,
}));

describe('Home Page', () => {
  it('renders main page content', async () => {
    render(<Home />);
    expect(await screen.findByText('ASRC Race Hub')).toBeInTheDocument();
  });
});
