import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import OTDetailsPage from './OTDetailsPage';
import { mockOrdenesTrabajo, otStatusOptions } from '../data/dropdownData';

// Mock one OT for testing
const testOT = {
  ...mockOrdenesTrabajo[0], // Use the first mock OT
  id: "OT-TEST-001",
  estado: otStatusOptions[0], // Creada
  cliente: "Cliente de Prueba",
  numeroSerie: "SN-TEST-123",
  inspeccionVisual: {
      fotos: [{ url: "test.jpg", descripcion: "Test Foto", fecha: new Date().toISOString(), subidoPor: "TestUser"}],
      comentarios: "Comentarios de prueba",
      fecha: new Date().toISOString(),
      realizadoPor: "Inspector Prueba",
  }
};

describe('OTDetailsPage', () => {
  it('renders OT details correctly when an OT is provided', () => {
    render(<OTDetailsPage ordenTrabajo={testOT} />);

    // Check for some key information
    expect(screen.getByText(`Detalle Orden de Trabajo: ${testOT.id}`)).toBeInTheDocument();
    expect(screen.getByText(`Cliente: ${testOT.cliente}`)).toBeInTheDocument();
    expect(screen.getByText(`Estado: ${testOT.estado}`)).toBeInTheDocument();
    expect(screen.getByText(`Número de Serie: ${testOT.numeroSerie}`)).toBeInTheDocument();

    // Check if the "Recepción en Bodega" section is NOT visible if state is "Creada"
    // (as per isStateReached logic)
    expect(screen.queryByText('Recepción en Bodega')).not.toBeInTheDocument();

    // Check if "Inspección Visual" section is also not visible if state is "Creada"
    // This depends on the exact order in otStatusOptions and isStateReached
    // For "Creada", only Creada related info should be directly visible, sections are conditional
    const inspeccionVisualHeader = screen.queryByRole('heading', { name: /Inspección Visual/i });
    expect(inspeccionVisualHeader).not.toBeInTheDocument();

  });

  it('renders specific section when state allows', () => {
    const otInInspeccionState = {
        ...testOT,
        estado: "Inspección Visual Realizada", // Ensure this state allows the section
        inspeccionVisual: {
            fotos: [{ url: "test.jpg", descripcion: "Foto Insp", fecha: new Date().toISOString(), subidoPor: "UserTest"}],
            comentarios: "Todo OK en inspección",
            fecha: new Date().toISOString(),
            realizadoPor: "InspectorTest",
        }
    };
    render(<OTDetailsPage ordenTrabajo={otInInspeccionState} />);

    expect(screen.getByText(`Detalle Orden de Trabajo: ${otInInspeccionState.id}`)).toBeInTheDocument();

    const inspeccionVisualHeader = screen.getByRole('heading', { name: /Inspección Visual/i });
    expect(inspeccionVisualHeader).toBeInTheDocument();
    expect(screen.getByText("Comentarios: Todo OK en inspección")).toBeInTheDocument();
    expect(screen.getByText(/Foto Insp/)).toBeInTheDocument(); // Check for photo description
  });

  it('shows "Orden de Trabajo no encontrada." if no OT data is passed (though props currently require it)', () => {
    // This scenario is less likely with TypeScript props, but good to be aware of
    // @ts-expect-error testing with null prop
    render(<OTDetailsPage ordenTrabajo={null} />);
    expect(screen.getByText('Orden de Trabajo no encontrada.')).toBeInTheDocument();
  });
});
