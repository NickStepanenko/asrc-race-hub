import React from 'react';
import { render, screen } from '@testing-library/react';
import { beforeEach, vi } from 'vitest';

import Home from '@/app/page';

vi.mock('@/app/downloads/page', () => ({
  __esModule: true,
  default: () => <div>Advanced Simulation Modding Group</div>,
}));

describe('Home Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the downloads page content inside the main tag', async () => {
    render(<Home />);

    expect(await screen.findByText('Advanced Simulation Modding Group')).toBeInTheDocument();
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
  });

  it('applies the default padding to the main container', () => {
    render(<Home />);

    const main = screen.getByRole('main');
    expect(main).toHaveStyle({ padding: '16px' });
  });
});
