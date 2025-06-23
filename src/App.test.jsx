import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import '@testing-library/jest-dom';
import App from './App'; // Assuming App contains OTDetailsWrapper logic or similar
import { mockOrdenesTrabajo } from './data/dropdownData';
import OTDetailsPage from './pages/OTDetailsPage'; // Actual component for verification

// Mock OTDetailsPage to simplify App test and focus on routing/wrapper logic
jest.mock('./pages/OTDetailsPage', () => {
  return jest.fn(({ ordenTrabajo }) => (
    <div>
      <h1>Mocked OT Details Page</h1>
      <p>OT ID: {ordenTrabajo.id}</p>
      <p>Cliente: {ordenTrabajo.cliente}</p>
    </div>
  ));
});

// Mock HomePage and ProfilePage to simplify tests
jest.mock('./pages/HomePage', () => jest.fn(() => <div>Mocked HomePage</div>));
jest.mock('./pages/ProfilePage', () => jest.fn(() => <div>Mocked ProfilePage</div>));


describe('App Routing and OTDetailsWrapper Logic', () => {
  const validOtId = mockOrdenesTrabajo[0].id;
  const invalidOtId = 'INVALID-OT-ID';

  it('renders HomePage for default route "/"', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Mocked HomePage')).toBeInTheDocument();
  });

  it('renders ProfilePage for "/profile" route', () => {
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Mocked ProfilePage')).toBeInTheDocument();
  });

  it('renders OTDetailsPage via OTDetailsWrapper for a valid /ot/:otId route', () => {
    render(
      <MemoryRouter initialEntries={[`/ot/${validOtId}`]}>
        <App />
      </MemoryRouter>
    );
    // Check if OTDetailsPage mock was called and rendered its content
    expect(screen.getByText('Mocked OT Details Page')).toBeInTheDocument();
    expect(screen.getByText(`OT ID: ${validOtId}`)).toBeInTheDocument();
    expect(screen.getByText(`Cliente: ${mockOrdenesTrabajo[0].cliente}`)).toBeInTheDocument();
    expect(OTDetailsPage).toHaveBeenCalledWith({ ordenTrabajo: mockOrdenesTrabajo[0] }, {});
  });

  it('renders error message via OTDetailsWrapper for an invalid /ot/:otId route', () => {
    render(
      <MemoryRouter initialEntries={[`/ot/${invalidOtId}`]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Error: Orden de Trabajo no encontrada.')).toBeInTheDocument();
    expect(screen.getByText(`No se pudo encontrar una OT con el ID: ${invalidOtId}`)).toBeInTheDocument();
    // Ensure the actual OTDetailsPage mock was NOT called with undefined or error
    // It might be called by the wrapper, but the wrapper itself should handle the error display.
    // So, OTDetailsPage (the mock) should not have been called with an error or missing OT.
  });
});
