// src/data/examples.ts
// Este archivo contendrá datos de ejemplo y mocks para la aplicación.

import { OrdenTrabajo, clienteOptions, vendedorOptions, modeloEquipoOptions, tipoProductoOptions, productoGBOptions, productoGMOptions, orientacionOptions, reduccionOptions, otStatusOptions, decisionPiezaOptions, tipoLimpiezaOptions } from './dropdownData';

// Mock data para Ordenes de Trabajo que antes estaba en dropdownData.ts
export const mockOrdenesTrabajo: OrdenTrabajo[] = [
  {
    id: "OT-20240715-1030",
    fechaCreacion: new Date().toISOString(),
    creadoPor: "UsuarioSistema",
    fechaPosibleRecepcion: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 días desde ahora
    numeroSerie: "111",
    tipoProducto: tipoProductoOptions[0], // GB
    producto: productoGBOptions[0], // Paramax
    orientacion: orientacionOptions[1], // Horizontal
    reduccion: reduccionOptions[1], // Doble reducción
    cliente: clienteOptions[0], // Cliente A
    vendedor: vendedorOptions[0], // Ana Gómez
    modelo: modeloEquipoOptions[0], // Laptop HP EliteBook 840 G5
    fechaVentaCliente: "2023-01-15", // Fecha de ejemplo
    estado: otStatusOptions[0], // Creada
    priority: "Media", // Added priority
    historial: [
      { fecha: new Date().toISOString(), evento: "OT Creada", responsable: "UsuarioSistema" },
    ],
    adjuntos: [
      { url: "/path/to/doc_inicial.pdf", descripcion: "Solicitud Cliente", fecha: new Date().toISOString(), subidoPor: "UsuarioSistema" }
    ]
  },
  {
    id: "OT-20240716-1100",
    fechaCreacion: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Ayer
    creadoPor: "Ana Gómez",
    fechaPosibleRecepcion: new Date().toISOString(),
    numeroSerie: "222",
    tipoProducto: tipoProductoOptions[1], // GM
    producto: productoGMOptions[0], // Cyclo
    orientacion: orientacionOptions[0], // Vertical
    reduccion: reduccionOptions[0], // Reducción simple
    cliente: clienteOptions[1], // Empresa XYZ
    estado: otStatusOptions[1], // Equipo Recepcionado
    priority: "Alta", // Added priority
    fechaRecepcionBodega: new Date().toISOString(),
    recepcionadoPor: "David Ríos (Bodega)",
    fotoPlaca: { url: "/path/to/placa_222.jpg", descripcion: "Placa equipo SN 222", fecha: new Date().toISOString(), subidoPor: "David Ríos (Bodega)"},
    historial: [
      { fecha: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), evento: "OT Creada", responsable: "Ana Gómez" },
      { fecha: new Date().toISOString(), evento: "Equipo Recepcionado en Bodega", responsable: "David Ríos (Bodega)", notas: "Se tomó foto de la placa." },
    ],
  },
  {
    id: "OT-20240717-0915",
    fechaCreacion: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // Hace 2 días
    creadoPor: "Carlos Rodríguez",
    numeroSerie: "333", // Producto Otro
    tipoProducto: tipoProductoOptions[0], // GB
    producto: "Otro",
    productoOtro: "Reductor especial marca Patito",
    orientacion: orientacionOptions[1], // Horizontal
    reduccion: reduccionOptions[2], // Triple reducción
    cliente: clienteOptions[2], // Juan Pérez
    estado: otStatusOptions[2], // Inspección Visual Realizada
    priority: "Media", // Added priority
    fechaRecepcionBodega: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    recepcionadoPor: "Elena Sánchez (Recepción)",
    fotoPlaca: { url: "/path/to/placa_333.jpg", descripcion: "Placa equipo SN 333", fecha: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), subidoPor: "Elena Sánchez (Recepción)"},
    inspeccionVisual: {
      fotos: [
        { url: "/path/to/inspeccion1_333.jpg", descripcion: "Vista general", fecha: new Date().toISOString(), subidoPor: "TecnicoMecanico"},
        { url: "/path/to/inspeccion2_333.jpg", descripcion: "Daño visible carcasa", fecha: new Date().toISOString(), subidoPor: "TecnicoMecanico"}
      ],
      comentarios: "Equipo con signos de sobrecarga, carcasa con fisura.",
      fecha: new Date().toISOString(),
      realizadoPor: "TecnicoMecanico",
    },
    historial: [
      { fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), evento: "OT Creada", responsable: "Carlos Rodríguez" },
      { fecha: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), evento: "Equipo Recepcionado", responsable: "Elena Sánchez" },
      { fecha: new Date().toISOString(), evento: "Inspección Visual Completada", responsable: "TecnicoMecanico" },
    ],
  },
  {
    id: "OT-20240718-1400",
    fechaCreacion: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    creadoPor: "Sofía López",
    numeroSerie: "444",
    tipoProducto: tipoProductoOptions[1], // GM
    producto: productoGMOptions[1], // BBB
    orientacion: orientacionOptions[0], // Vertical
    reduccion: reduccionOptions[3], // Cuadruple reducción
    cliente: clienteOptions[3], // Servicios TI Ltda.
    estado: otStatusOptions[6], // Presupuesto Enviado
    priority: "Baja", // Added priority
    // ... (datos de etapas anteriores poblados)
    fechaRecepcionBodega: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    recepcionadoPor: "David Ríos (Bodega)",
    fotoPlaca: { url: "/path/to/placa_444.jpg", descripcion: "Placa equipo SN 444", fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), subidoPor: "David Ríos (Bodega)"},
    inspeccionVisual: {realizadoPor: "TM1", fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), comentarios: "Ok"},
    limpiezaEquipo: {tipoLavado: tipoLimpiezaOptions[0], fechaRealizacion: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), internoOProveedor: "Interno", realizadoPor: "AuxLimpieza"},
    desarme: {fecha: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), realizadoPor: "TM2", piezasIdentificadas: ["Eje Principal", "Rodamiento A", "Rodamiento B", "Carcasa"]},
    diagnosticoPiezas: {
      piezas: [
        { nombre: "Eje Principal", decision: decisionPiezaOptions[2], comentarios: "Desgaste leve, reutilizable" },
        { nombre: "Rodamiento A", decision: decisionPiezaOptions[0], foto: {url: "/path/to/rodA.jpg", subidoPor: "TM2", fecha:new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()}, mediciones: "Holgura excesiva", ensayosNoDestructivos: "N/A", comentarios: "Requiere reemplazo urgente."},
        { nombre: "Rodamiento B", decision: decisionPiezaOptions[0], comentarios: "Dañado, necesita reemplazo."},
        { nombre: "Carcasa", decision: decisionPiezaOptions[1], comentarios: "Fisura reparable con soldadura especial."}
      ],
      fecha: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // Hace 12 horas
      realizadoPor: "TM2",
    },
    presupuesto: {
      items: [
        { descripcion: "Rodamiento A (SKF 6205)", cantidad: 1, valorUnitario: 50, valorTotal: 50 },
        { descripcion: "Rodamiento B (SKF 6304)", cantidad: 1, valorUnitario: 65, valorTotal: 65 },
        { descripcion: "Reparación Carcasa (Soldadura)", cantidad: 1, valorUnitario: 120, valorTotal: 120 },
        { descripcion: "Mano de Obra Desarme y Diagnóstico", cantidad: 4, valorUnitario: 30, valorTotal: 120 },
        { descripcion: "Mano de Obra Reparación y Armado", cantidad: 6, valorUnitario: 35, valorTotal: 210 },
      ],
      valorTotal: 565, // Este valorTotal es el del presupuesto general, no la suma de items.
      fechaCreacion: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // Hace 6 horas
      creadoPor: "Ana Gómez",
      fechaEnvio: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // Hace 1 hora
    },
    historial: [
        { fecha: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), evento: "OT Creada", responsable: "Sofía López" },
        { fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), evento: "Equipo Recepcionado", responsable: "David Ríos" },
        { fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), evento: "Inspección Visual", responsable: "TM1" },
        { fecha: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), evento: "Limpieza Equipo", responsable: "AuxLimpieza" },
        { fecha: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), evento: "Desarme Equipo", responsable: "TM2" },
        { fecha: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), evento: "Diagnóstico Piezas", responsable: "TM2" },
        { fecha: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), evento: "Presupuesto Creado", responsable: "Ana Gómez" },
        { fecha: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), evento: "Presupuesto Enviado a Cliente", responsable: "Ana Gómez" },
    ],
  },
  // Ejemplo de OT sin número de serie (carga manual)
  {
    id: "OT-20240719-1500",
    fechaCreacion: new Date().toISOString(),
    creadoPor: "UsuarioMostrador",
    cliente: clienteOptions[4], // Global Solutions S.A.
    estado: otStatusOptions[0], // Creada
    priority: "Media", // Added priority
    // numeroSerie es undefined
    tipoProducto: tipoProductoOptions[0], // GB
    producto: productoGBOptions[1], // Hansen
    productoOtro: undefined,
    orientacion: orientacionOptions[0], // Vertical
    reduccion: reduccionOptions[0], // Reducción simple
    fechaPosibleRecepcion: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    historial: [
      { fecha: new Date().toISOString(), evento: "OT Creada (sin N/S, manual)", responsable: "UsuarioMostrador" },
    ],
  }
];

// Podrías agregar más ejemplos o mocks aquí si es necesario en el futuro.
// Por ejemplo, un mock para un usuario específico, configuraciones, etc.
