// src/data/dropdownData.ts

export const otStatusOptions: string[] = [
  "Creación",
  "Recepción de equipo",
  "Revisión inicial",
  "Presupuesto Enviado",
  "Aprobado",
  "En Reparación",
  "Reparado",
  "Enviado al Cliente",
  "Finalizada",
  "Rechazado",
];

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

export interface OrdenTrabajo {
  id: string; // OT-number
  fechaCreacion: string;
  fechaRecepcion?: string;
  motivoIngreso: string;
  cliente: string;
  vendedor?: string;
  numeroSerie?: string;
  modelo?: string;
  recibidoPor?: string;
  fechaVentaCliente?: string;
  estado: string;
  // Campos para el historial y detalles
  historial?: Array<{ fecha: string; evento: string; responsable: string; notas?: string }>;
  fotos?: string[]; // URLs o paths de las imágenes
  diagnosticoInicial?: string;
  detallesRevision?: Array<{ pieza: string; descripcion: string; costoEstimado?: number; requiereReemplazo?: boolean }>;
  presupuesto?: {
    items: Array<{ descripcion: string; cantidad: number; precioUnitario: number; total: number }>;
    subtotal: number;
    impuestos: number;
    totalGeneral: number;
    aprobado?: boolean;
    fechaAprobacion?: string;
  };
  repuestosUtilizados?: Array<{ repuesto: string; cantidad: number; costo: number }>;
  resumenCostos?: {
    manoDeObra: number;
    repuestos: number;
    otros: number;
    total: number;
  };
  notasReparacion?: string;
}
// Datos simulados para la tabla
export const mockOrdenesTrabajo: OrdenTrabajo[] = [
  {
    id: "OT-2024001",
    fechaCreacion: "2024-07-01",
    fechaRecepcion: "2024-07-02",
    motivoIngreso: motivoIngresoOptions[0], // Diagnóstico
    cliente: clienteOptions[0], // Cliente A
    vendedor: vendedorOptions[0], // Ana Gómez
    numeroSerie: "SN12345XYZ",
    modelo: modeloEquipoOptions[0], // Laptop HP EliteBook 840 G5
    recibidoPor: recibidoPorOptions[0], // David Ríos (Bodega)
    fechaVentaCliente: "2023-01-15",
    estado: otStatusOptions[1], // Recepción de equipo
    historial: [
      { fecha: "2024-07-01", evento: "OT Creada", responsable: "Admin" },
      { fecha: "2024-07-02", evento: "Equipo Recibido en Bodega", responsable: "David Ríos", notas: "Se tomó foto de la placa." },
    ],
    fotos: ["/path/to/placa1.jpg"],
    diagnosticoInicial: "El equipo no enciende.",
  },
  {
    id: "OT-2024002",
    fechaCreacion: "2024-07-03",
    motivoIngreso: motivoIngresoOptions[1], // Reparación
    cliente: clienteOptions[1], // Empresa XYZ
    vendedor: vendedorOptions[1], // Carlos Rodríguez
    estado: otStatusOptions[0], // Creación
    // Faltan más datos porque está recién creada
  },
  {
    id: "OT-2024003",
    fechaCreacion: "2024-06-28",
    fechaRecepcion: "2024-06-29",
    motivoIngreso: motivoIngresoOptions[2], // Mantenimiento Preventivo
    cliente: clienteOptions[2], // Juan Pérez
    numeroSerie: "SN98765ABC",
    modelo: modeloEquipoOptions[1], // Desktop Dell OptiPlex 7070
    recibidoPor: recibidoPorOptions[1], // Elena Sánchez (Recepción)
    estado: otStatusOptions[2], // Revisión inicial
    historial: [
        { fecha: "2024-06-28", evento: "OT Creada", responsable: "Vendedor: Sofía López" },
        { fecha: "2024-06-29", evento: "Equipo Recibido", responsable: "Elena Sánchez" },
        { fecha: "2024-06-30", evento: "Revisión Inicial Completada", responsable: "Técnico: Miguel Castro", notas: "Limpieza interna realizada, ventiladores OK." },
    ],
    fotos: ["/path/to/equipo_antes.jpg", "/path/to/equipo_despues.jpg"],
    diagnosticoInicial: "Mantenimiento preventivo programado.",
    detallesRevision: [
        { pieza: "Ventilador CPU", descripcion: "Funciona correctamente, un poco de polvo.", requiereReemplazo: false },
        { pieza: "Disco Duro", descripcion: "Estado SMART OK.", requiereReemplazo: false },
        { pieza: "Memoria RAM", descripcion: "Tests pasados sin errores.", requiereReemplazo: false },
    ],
  },
  {
    id: "OT-2024004",
    fechaCreacion: "2024-07-05",
    fechaRecepcion: "2024-07-06",
    motivoIngreso: motivoIngresoOptions[0], // Diagnóstico
    cliente: clienteOptions[3], // Servicios TI Ltda.
    vendedor: vendedorOptions[0], // Ana Gómez
    numeroSerie: "SNABC123",
    modelo: modeloEquipoOptions[2], // Servidor Lenovo ThinkSystem SR650
    recibidoPor: recibidoPorOptions[0], // David Ríos (Bodega)
    estado: otStatusOptions[4], // Aprobado
    historial: [
        { fecha: "2024-07-05", evento: "OT Creada", responsable: "Vendedor: Ana Gómez" },
        { fecha: "2024-07-06", evento: "Equipo Recibido", responsable: "David Ríos" },
        { fecha: "2024-07-07", evento: "Diagnóstico Realizado", responsable: "Técnico: Laura Pausini", notas: "Falla en fuente de poder." },
        { fecha: "2024-07-08", evento: "Presupuesto Enviado", responsable: "Ana Gómez" },
        { fecha: "2024-07-09", evento: "Presupuesto Aprobado por Cliente", responsable: "Cliente: Servicios TI Ltda." },
    ],
    presupuesto: {
        items: [{ descripcion: "Reemplazo Fuente de Poder ATX 750W", cantidad: 1, precioUnitario: 120, total: 120 }],
        subtotal: 120,
        impuestos: 22.8, // Asumiendo 19% IVA
        totalGeneral: 142.8,
        aprobado: true,
        fechaAprobacion: "2024-07-09",
    }
  },
  {
    id: "OT-2024005",
    fechaCreacion: "2024-07-10",
    motivoIngreso: motivoIngresoOptions[3], // Garantía
    cliente: clienteOptions[4], // Global Solutions S.A.
    vendedor: vendedorOptions[2], // Sofía López
    numeroSerie: "SNDEF456",
    modelo: modeloEquipoOptions[3], // Impresora Epson EcoTank L3250
    fechaVentaCliente: "2024-03-01",
    estado: otStatusOptions[5], // En Reparación
    historial: [
        { fecha: "2024-07-10", evento: "OT Creada por Garantía", responsable: "Vendedor: Sofía López" },
        { fecha: "2024-07-11", evento: "Equipo Recibido", responsable: "Elena Sánchez" },
        { fecha: "2024-07-12", evento: "Inicio de Reparación", responsable: "Técnico: Ricardo Arjona", notes: "Revisando cabezales de impresión." },
    ],
    notasReparacion: "Se están limpiando los inyectores del cabezal de impresión obstruidos."
  }
];
