import React from 'react';
import { OrdenTrabajo, HistorialEntry, FotoEntry, PiezaDetalle, PresupuestoItem } from '../data/dropdownData'; // Adjust path as needed

interface OTDetailsPageProps {
  ordenTrabajo: OrdenTrabajo;
}

const OTDetailsPage: React.FC<OTDetailsPageProps> = ({ ordenTrabajo }) => {
  if (!ordenTrabajo) {
    return <div>Orden de Trabajo no encontrada.</div>;
  }

  // Helper function to render a section
  const renderSection = (title: string, children: React.ReactNode, isVisible: boolean = true) => {
    if (!isVisible) return null;
    return (
      <div style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
        <h2>{title}</h2>
        {children}
      </div>
    );
  };

  // Helper to display photos
  const renderFotos = (fotos: FotoEntry[] | undefined, title: string) => {
    if (!fotos || fotos.length === 0) return <p>No hay fotos para {title}.</p>;
    return (
      <div>
        <h4>{title}</h4>
        {fotos.map((foto, index) => (
          <div key={index} style={{ marginBottom: '5px' }}>
            <img src={foto.url} alt={foto.descripcion || `foto ${index + 1}`} style={{ maxWidth: '200px', maxHeight: '200px' }} />
            <p>{foto.descripcion} (Subido por: {foto.subidoPor} el {new Date(foto.fecha).toLocaleDateString()})</p>
          </div>
        ))}
      </div>
    );
  };

  // Define which sections are visible based on state
  const isStateReached = (currentState: string, targetState: string): boolean => {
    const stateOrder = [
      "Creada", "Equipo Recepcionado", "Inspección Visual Realizada", "Equipo Limpio",
      "Equipo Desarmado", "Diagnóstico de Piezas Realizado", "Presupuesto Enviado",
      "Presupuesto Aprobado", "Reparación en Progreso", "Pruebas Dinámicas Realizadas",
      "Aprobación de Calidad Realizada", "Despachado", "Cerrada"
    ];
    const currentIndex = stateOrder.indexOf(currentState);
    const targetIndex = stateOrder.indexOf(targetState);
    return currentIndex >= targetIndex;
  };

  return (
    <div>
      <h1>Detalle Orden de Trabajo: {ordenTrabajo.id}</h1>

      {/* Header Info */}
      <div style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '20px', backgroundColor: '#f9f9f9' }}>
        <h2>Información General</h2>
        <p><strong>Cliente:</strong> {ordenTrabajo.cliente}</p>
        <p><strong>Estado:</strong> {ordenTrabajo.estado}</p>
        <p><strong>Número de Serie:</strong> {ordenTrabajo.numeroSerie || 'N/A'}</p>
        <p><strong>Tipo Producto:</strong> {ordenTrabajo.tipoProducto} {ordenTrabajo.productoOtro && `(${ordenTrabajo.productoOtro})`}</p>
        <p><strong>Producto:</strong> {ordenTrabajo.producto}</p>
        <p><strong>Orientación:</strong> {ordenTrabajo.orientacion}</p>
        <p><strong>Reducción:</strong> {ordenTrabajo.reduccion}</p>
        {ordenTrabajo.fotoPlaca && renderFotos([ordenTrabajo.fotoPlaca], "Foto de Placa")}
      </div>

      {/* Tabs or Accordion System - For now, simple sections */}
      <div>
        {renderSection("Recepción en Bodega", (
          <>
            <p><strong>Fecha Recepción:</strong> {ordenTrabajo.fechaRecepcionBodega ? new Date(ordenTrabajo.fechaRecepcionBodega).toLocaleString() : 'N/A'}</p>
            <p><strong>Recepcionado por:</strong> {ordenTrabajo.recepcionadoPor || 'N/A'}</p>
          </>
        ), isStateReached(ordenTrabajo.estado, "Equipo Recepcionado"))}

        {renderSection("Inspección Visual", (
          <>
            {ordenTrabajo.inspeccionVisual?.fotos && renderFotos(ordenTrabajo.inspeccionVisual.fotos, "Fotos Inspección")}
            <p><strong>Comentarios:</strong> {ordenTrabajo.inspeccionVisual?.comentarios || 'N/A'}</p>
            <p><strong>Realizado por:</strong> {ordenTrabajo.inspeccionVisual?.realizadoPor} el {ordenTrabajo.inspeccionVisual?.fecha ? new Date(ordenTrabajo.inspeccionVisual.fecha).toLocaleString() : ''}</p>
          </>
        ), isStateReached(ordenTrabajo.estado, "Inspección Visual Realizada"))}

        {renderSection("Limpieza de Equipo", (
          <>
            <p><strong>Tipo Lavado:</strong> {ordenTrabajo.limpiezaEquipo?.tipoLavado || 'N/A'}</p>
            <p><strong>Fecha Realización:</strong> {ordenTrabajo.limpiezaEquipo?.fechaRealizacion ? new Date(ordenTrabajo.limpiezaEquipo.fechaRealizacion).toLocaleString() : 'N/A'}</p>
            <p><strong>Realizado:</strong> {ordenTrabajo.limpiezaEquipo?.internoOProveedor} {ordenTrabajo.limpiezaEquipo?.proveedor && `(${ordenTrabajo.limpiezaEquipo.proveedor})`}</p>
            <p><strong>Realizado por:</strong> {ordenTrabajo.limpiezaEquipo?.realizadoPor || 'N/A'}</p>
          </>
        ), isStateReached(ordenTrabajo.estado, "Equipo Limpio"))}

        {renderSection("Desarme", (
          <>
            <p><strong>Piezas Identificadas:</strong> {ordenTrabajo.desarme?.piezasIdentificadas?.join(', ') || 'N/A'}</p>
            <p><strong>Comentarios:</strong> {ordenTrabajo.desarme?.comentarios || 'N/A'}</p>
            <p><strong>Realizado por:</strong> {ordenTrabajo.desarme?.realizadoPor} el {ordenTrabajo.desarme?.fecha ? new Date(ordenTrabajo.desarme.fecha).toLocaleString() : ''}</p>
          </>
        ), isStateReached(ordenTrabajo.estado, "Equipo Desarmado"))}

        {renderSection("Diagnóstico de Piezas", (
          <>
            {ordenTrabajo.diagnosticoPiezas?.piezas.map((pieza, index) => (
              <div key={index} style={{ borderBottom: '1px solid #eee', marginBottom: '10px', paddingBottom: '10px' }}>
                <p><strong>Pieza:</strong> {pieza.nombre}</p>
                {pieza.foto && renderFotos([pieza.foto], `Foto ${pieza.nombre}`)}
                <p><strong>Mediciones:</strong> {pieza.mediciones || 'N/A'}</p>
                <p><strong>Ensayos ND:</strong> {pieza.ensayosNoDestructivos || 'N/A'}</p>
                <p><strong>Decisión:</strong> {pieza.decision}</p>
                <p><strong>Comentarios:</strong> {pieza.comentarios || 'N/A'}</p>
              </div>
            ))}
            <p><strong>Comentarios Generales:</strong> {ordenTrabajo.diagnosticoPiezas?.comentariosGenerales || 'N/A'}</p>
            <p><strong>Realizado por:</strong> {ordenTrabajo.diagnosticoPiezas?.realizadoPor} el {ordenTrabajo.diagnosticoPiezas?.fecha ? new Date(ordenTrabajo.diagnosticoPiezas.fecha).toLocaleString() : ''}</p>
          </>
        ), isStateReached(ordenTrabajo.estado, "Diagnóstico de Piezas Realizado"))}

        {renderSection("Presupuesto", (
          <>
            <h4>Items:</h4>
            {ordenTrabajo.presupuesto?.items.map((item, index) => (
              <p key={index}>{item.descripcion} - Cant: {item.cantidad}, V.Unit: ${item.valorUnitario}, V.Total: ${item.valorTotal}</p>
            ))}
            <p><strong>Valor Total Presupuesto:</strong> ${ordenTrabajo.presupuesto?.valorTotal || 0}</p>
            <p><strong>Creado por:</strong> {ordenTrabajo.presupuesto?.creadoPor} el {ordenTrabajo.presupuesto?.fechaCreacion ? new Date(ordenTrabajo.presupuesto.fechaCreacion).toLocaleString() : ''}</p>
            {ordenTrabajo.presupuesto?.fechaEnvio && <p><strong>Enviado:</strong> {new Date(ordenTrabajo.presupuesto.fechaEnvio).toLocaleString()}</p>}
             {ordenTrabajo.presupuesto?.aprobadoPorCliente && <p><strong>Aprobado por Cliente:</strong> Sí ({ordenTrabajo.presupuesto?.fechaAprobacionCliente ? new Date(ordenTrabajo.presupuesto.fechaAprobacionCliente).toLocaleString() : ''} por {ordenTrabajo.presupuesto?.aprobadoPor})</p>}
            <p><strong>Comentarios:</strong> {ordenTrabajo.presupuesto?.comentarios || 'N/A'}</p>
          </>
        ), isStateReached(ordenTrabajo.estado, "Presupuesto Enviado"))}

        {/* Placeholder for other sections based on state */}
        {renderSection("Reparación", <p>Detalles de la reparación...</p>, isStateReached(ordenTrabajo.estado, "Reparación en Progreso"))}
        {renderSection("Pruebas Dinámicas", <p>Resultados de pruebas...</p>, isStateReached(ordenTrabajo.estado, "Pruebas Dinámicas Realizadas"))}
        {renderSection("Aprobación de Calidad", <p>Información de aprobación...</p>, isStateReached(ordenTrabajo.estado, "Aprobación de Calidad Realizada"))}
        {renderSection("Despacho", <p>Guía de despacho...</p>, isStateReached(ordenTrabajo.estado, "Despachado"))}

      </div>

      {/* Adjuntos Generales */}
      {ordenTrabajo.adjuntos && ordenTrabajo.adjuntos.length > 0 && renderSection("Adjuntos Generales", (
        renderFotos(ordenTrabajo.adjuntos, "")
      ))}

      {/* Historial */}
      {renderSection("Historial de Cambios", (
        <ul>
          {ordenTrabajo.historial.map((entry, index) => (
            <li key={index}>
              {new Date(entry.fecha).toLocaleString()}: {entry.evento} (Responsable: {entry.responsable}) {entry.notas && `- ${entry.notas}`}
            </li>
          ))}
        </ul>
      ))}

    </div>
  );
};

export default OTDetailsPage;
