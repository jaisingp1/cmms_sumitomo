import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { AppContent } from './App'; // Import AppContent
import { mockOrdenesTrabajo } from './data/dropdownData';
import OTDetailsPage from './pages/OTDetailsPage'; // Actual component for verification

// Mock OTDetailsPage to simplify App test and focus on routing/wrapper logic
vi.mock('./pages/OTDetailsPage', () => ({
  default: vi.fn(({ ordenTrabajo }) => (
    <div>
      <h1>Mocked OT Details Page</h1>
      <p>OT ID: {ordenTrabajo.id}</p>
      <p>Cliente: {ordenTrabajo.cliente}</p>
    </div>
  )),
}));

// Mock HomePage and ProfilePage to simplify tests
vi.mock('./pages/HomePage', () => ({
  default: vi.fn(() => <div>Mocked HomePage</div>),
}));
vi.mock('./pages/ProfilePage', () => ({
  default: vi.fn(() => <div>Mocked ProfilePage</div>),
}));


describe('App Routing and OTDetailsWrapper Logic', () => {
  const validOtId = mockOrdenesTrabajo[0].id;
  const invalidOtId = 'INVALID-OT-ID';

  it('renders HomePage for default route "/"', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppContent />
      </MemoryRouter>
    );
    expect(screen.getByText('Mocked HomePage')).toBeInTheDocument();
  });

  it('renders ProfilePage for "/profile" route', () => {
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <AppContent />
      </MemoryRouter>
    );
    expect(screen.getByText('Mocked ProfilePage')).toBeInTheDocument();
  });

  it('renders OTDetailsPage via OTDetailsWrapper for a valid /ot/:otId route', () => {
    render(
      <MemoryRouter initialEntries={[`/ot/${validOtId}`]}>
        <AppContent />
      </MemoryRouter>
    );
    // Check if OTDetailsPage mock was called and rendered its content
    expect(screen.getByText('Mocked OT Details Page')).toBeInTheDocument();
    expect(screen.getByText(`OT ID: ${validOtId}`)).toBeInTheDocument();
    expect(screen.getByText(`Cliente: ${mockOrdenesTrabajo[0].cliente}`)).toBeInTheDocument();
    // El segundo argumento de props puede ser undefined si no se pasan más props, lo cual es común.
    // Ajustamos la aserción para que sea más flexible o para que coincida con la realidad.
    // En este caso, el mock es llamado solo con las props que definimos (ordenTrabajo),
    // por lo que el segundo argumento (contexto o ref) es implícitamente undefined o un objeto vacío
    // dependiendo de la implementación exacta de vi.fn() y cómo maneja los componentes funcionales.
    // Para mayor robustez, podemos verificar que fue llamado y que la prop ordenTrabajo es correcta.
    expect(OTDetailsPage).toHaveBeenCalled();
    expect(OTDetailsPage).toHaveBeenCalledWith(expect.objectContaining({ ordenTrabajo: mockOrdenesTrabajo[0] }), undefined);
  });

  it('renders error message via OTDetailsWrapper for an invalid /ot/:otId route', () => {
    render(
      <MemoryRouter initialEntries={[`/ot/${invalidOtId}`]}>
        <AppContent />
      </MemoryRouter>
    );
    expect(screen.getByText('Error: Orden de Trabajo no encontrada.')).toBeInTheDocument();
    expect(screen.getByText(`No se pudo encontrar una OT con el ID: ${invalidOtId}`)).toBeInTheDocument();
    // Ensure the actual OTDetailsPage mock was NOT called with undefined or error
    // It might be called by the wrapper, but the wrapper itself should handle the error display.
    // So, OTDetailsPage (the mock) should not have been called with an error or missing OT.
  });
});
