// src/data/dropdownData.ts

export const otStatusOptions: string[] = [
  "Creada",
  "Equipo Recepcionado",
  "Inspección Visual Realizada",
  "Equipo Limpio",
  "Equipo Desarmado",
  "Diagnóstico de Piezas Realizado",
  "Presupuesto Enviado",
  "Presupuesto Aprobado",
  "Reparación en Progreso",
  "Pruebas Dinámicas Realizadas",
  "Aprobación de Calidad Realizada",
  "Despachado",
  "Cerrada",
  "Rechazada",
];

export const tipoProductoOptions: string[] = ["GB", "GM"];

export const productoGBOptions: string[] = [
  "Paramax",
  "Hansen",
  "Flender",
  "Sew",
  "Falk",
  "Otro",
];

export const productoGMOptions: string[] = [
  "Cyclo",
  "BBB",
  "HSM",
  "Hyponic",
  "Helical (HHB)",
  "Otro",
];

export const orientacionOptions: string[] = ["Vertical", "Horizontal"];

export const reduccionOptions: string[] = [
  "Reducción simple",
  "Doble reducción",
  "Triple reducción",
  "Cuadruple reducción",
];

export const tipoLimpiezaOptions: string[] = ["Limpieza General", "Lavado Profundo"];

export const decisionPiezaOptions: string[] = ["Reemplazar", "Reparar", "Reutilizar"];


export const motivoIngresoOptions: string[] = [
  "Diagnóstico",
  "Reparación",
  "Mantenimiento Preventivo",
  "Garantía",
  "Actualización de Software",
  "Revisión General",
  "Otro",
];

export const clienteOptions: string[] = [
  "Cliente A",
  "Empresa XYZ",
  "Juan Pérez",
  "Servicios TI Ltda.",
  "Global Solutions S.A.",
  "Tecno Avanzada",
];

export const vendedorOptions: string[] = [
  "Ana Gómez",
  "Carlos Rodríguez",
  "Sofía López",
  "Luis Martínez",
];

export const modeloEquipoOptions: string[] = [
  "Laptop HP EliteBook 840 G5",
  "Desktop Dell OptiPlex 7070",
  "Servidor Lenovo ThinkSystem SR650",
  "Impresora Epson EcoTank L3250",
  "Router Cisco RV340",
  "Switch TP-Link TL-SG108",
];

export const recibidoPorOptions: string[] = [
  "David Ríos (Bodega)",
  "Elena Sánchez (Recepción)",
  "Miguel Castro (Técnico)",
];

// Puedes agregar más listas según sea necesario
// Por ejemplo, tipos de reparación, piezas comunes, etc.

export interface HistorialEntry {
  fecha: string;
  evento: string;
  responsable: string;
  notas?: string;
}

export interface FotoEntry {
  url: string;
  descripcion?: string;
  fecha: string;
  subidoPor: string;
}

export interface PiezaDetalle {
  nombre: string;
  foto?: FotoEntry;
  mediciones?: string; // Podría ser un objeto más complejo si es necesario
  ensayosNoDestructivos?: string; // Ídem
  decision: string; // Reemplazar, Reparar, Reutilizar
  comentarios?: string;
}

export interface PresupuestoItem {
  descripcion: string;
  cantidad: number;
  valorUnitario: number;
  valorTotal: number;
}

export interface OrdenTrabajo {
  id: string; // OT-number (ej: OT-YYYYMMDD-HHMM)
  // Información general y de creación
  fechaCreacion: string; // ISO date string
  creadoPor: string; // Usuario que crea la OT
  fechaPosibleRecepcion?: string; // ISO date string
  numeroSerie?: string; // Si no existe, se cargan los campos manualmente
  tipoProducto?: string; // GB, GM
  producto?: string; // Paramax, Cyclo, Otro (con campo adicional)
  productoOtro?: string; // Si producto es "Otro"
  orientacion?: string; // Vertical, Horizontal
  reduccion?: string; // Simple, Doble, etc.
  cliente: string; // Nombre del cliente
  estado: string; // Estado actual de la OT
  motivoIngreso?: string;
  vendedor?: string;
  modelo?: string;
  recibidoPor?: string; // Quién recibió/gestionó inicialmente la OT (distinto de recepcionadoPor en bodega)
  fechaVentaCliente?: string;
  fotoPlaca?: FotoEntry; // Foto de la placa del equipo
  adjuntos?: FotoEntry[]; // Adjuntos generales a la OT

  // Pestaña/Sección: Recepción en Bodega
  fechaRecepcionBodega?: string; // ISO date string
  recepcionadoPor?: string; // Usuario que recepciona

  // Pestaña/Sección: Inspección Visual
  inspeccionVisual?: {
    fotos?: FotoEntry[];
    comentarios?: string;
    fecha: string;
    realizadoPor: string;
  };

  // Pestaña/Sección: Limpieza de Equipo
  limpiezaEquipo?: {
    tipoLavado?: string; // Limpieza general, Lavado profundo
    fechaRealizacion?: string; // ISO date string
    internoOProveedor?: "Interno" | "Proveedor";
    proveedor?: string; // Si es Proveedor
    realizadoPor: string; // User who performed the action/update
    comentarios?: string; // Changed from notas to comentarios for consistency
    fotos?: FotoEntry[];   // Added fotos array
  };

  // Pestaña/Sección: Desarme
  desarme?: {
    fecha: string;
    realizadoPor: string;
    accionARealizar?: string; // Changed from comentarios to match UI
    piezasIdentificadas?: string[]; // Nombres de las piezas principales
    fotos?: FotoEntry[]; // Added fotos
  };

  // Pestaña/Sección: Diagnóstico de Piezas
  diagnosticoPiezas?: {
    piezas: PiezaDetalle[];
    fecha: string;
    realizadoPor: string;
    comentariosGenerales?: string;
  };

  // Pestaña/Sección: Presupuesto
  presupuesto?: {
    items: PresupuestoItem[];
    valorTotal: number;
    fechaCreacion: string;
    creadoPor: string;
    fechaEnvio?: string; // Fecha en que se envía al cliente
    aprobadoPorCliente?: boolean;
    fechaAprobacionCliente?: string; // ISO date string
    aprobadoPor?: string; // Quién aprueba internamente o registra aprobación cliente
    comentarios?: string;
    // Fields used by BudgetTab's UI and calculations
    subtotal?: number;
    impuestos?: number;
    totalGeneral?: number;
    aprobado?: boolean; // For internal approval checkbox
    fechaAprobacion?: string; // Date for internal approval
    responsable?: string; // User responsible for internal approval
  };

  // Pestaña/Sección: Reparación
  reparacion?: {
    piezasAdicionales?: Array<{ nombre: string; cantidad: number; motivo: string }>;
    fechaInicio?: string; // ISO date string
    fechaFin?: string; // ISO date string
    realizadoPor: string;
    comentarios?: string;
  };

  // Pestaña/Sección: Pruebas Dinámicas
  pruebasDinamicas?: {
    tipoPrueba?: string;
    resultados?: string;
    fecha: string;
    realizadoPor: string;
    comentarios?: string;
    fotos?: FotoEntry[]; // Added fotos
  };

  // Pestaña/Sección: Aprobación de Calidad
  aprobacionCalidad?: {
    aprobado: boolean;
    fecha: string; // ISO date string
    aprobadoPor: string; // Nombre del validador/responsable
    comentarios?: string;
    firma?: string; // For storing signature data/status text
  };

  // Pestaña/Sección: Despacho
  despacho?: {
    guiaDespacho?: string; // Número o URL al archivo
    fechaDespacho?: string; // ISO date string
    despachadoPor?: string;
    comentarios?: string;
    adjuntos?: FotoEntry[]; // Added for attachments
  };

  // Historial de cambios de estado y acciones importantes
  historial: HistorialEntry[];
  changeLog?: ChangeHistoryEntry[]; // Added for new immutable history
}

// Define types for Change History (moved from OTDetailsPage.tsx)
export interface ChangeHistoryEntry {
  id: string;
  timestamp: string;
  user: string;
  changeType: ChangeType;
  description: string;
  details?: Record<string, any>;
}

export type ChangeType =
  | "OT_CREATION"
  | "STATUS_UPDATE"
  | "HEADER_FIELD_UPDATE"
  | "INSPECTION_UPDATE"
  | "CLEANING_UPDATE"
  | "DISASSEMBLY_UPDATE"
  | "PARTS_UPDATE"
  | "BUDGET_ITEM_ADD"
  | "BUDGET_ITEM_REMOVE"
  | "BUDGET_ITEM_UPDATE"
  | "BUDGET_APPROVAL"
  | "REPAIR_NOTES_UPDATE"
  | "ADDITIONAL_PART_ADD"
  | "ADDITIONAL_PART_REMOVE"
  | "ADDITIONAL_PART_UPDATE"
  | "TESTING_UPDATE"
  | "QUALITY_APPROVAL"
  | "CLOSURE_UPDATE";

// Datos simulados para la tabla
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
    estado: otStatusOptions[0], // Creada
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
      valorTotal: 565,
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
