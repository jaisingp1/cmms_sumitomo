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

export const priorityOptions: string[] = ["Alta", "Media", "Baja"];

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
  priority?: string; // Prioridad de la OT (Alta, Media, Baja)
  motivoIngreso?: string;
  vendedor?: string;
  modelo?: string;
  recibidoPor?: string; // Quién recibió/gestionó inicialmente la OT (distinto de recepcionadoPor en bodega)
  fechaVentaCliente?: string;
  fechaRecepcion?: string; // Fecha de recepción general usada en el Header
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

// mockOrdenesTrabajo ha sido movido a src/data/examples.ts
