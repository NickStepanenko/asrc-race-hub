import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import CarCard from '@/app/components/CarElement';

vi.mock('@/app/components/CarElement/colorPicker', () => ({
  __esModule: true,
  default: vi.fn().mockResolvedValue('#fff'),
}));

describe('CarCard', () => {
  it('renders driver name and number and responds to async color', async () => {
    render(
      <CarCard
        carNumber={70}
        firstName="Driver"
        lastName="Name"
        teamName="Team Name"
        teamLogo="/logo.png"
        carImage="/car.png"
        championshipLogo="/champ.png"
        flagImage="/flag.png"
      />
    );

    expect(await screen.findByText('Driver Name')).toBeInTheDocument();
    expect(await screen.findByText('70')).toBeInTheDocument();
    expect(await screen.findByTestId('card-team-name')).toBeInTheDocument();
  });
});
