import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Asegurar que useNavigate esté importado
import { 
  otStatusOptions, 
  clienteOptions, 
  vendedorOptions, 
  modeloEquipoOptions, 
  recibidoPorOptions,
  // mockOrdenesTrabajo, // Movido a examples.ts
  ChangeHistoryEntry,
  ChangeType,
  OrdenTrabajo,
  FotoEntry,        // Added import
  PiezaDetalle,     // Added import
  PresupuestoItem   // Added import
} from '../data/dropdownData';
import { mockOrdenesTrabajo } from '../data/examples'; // Importar desde examples.ts

// Define common props for Tab components
interface TabComponentProps {
  workOrder: OrdenTrabajo; // Use the imported OrdenTrabajo type
  setWorkOrder: React.Dispatch<React.SetStateAction<OrdenTrabajo>>;
  addChangeLogEntry: (entryData: Omit<ChangeHistoryEntry, 'id' | 'timestamp' | 'user'>) => void;
}

// Helper to generate unique IDs
const generateUUID = () => crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);

// Helper to generate OT ID in the format OTAAMMDDcorrelativo
const generateOtId = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const correlativo = "001"; // Simplificación por ahora
  return `OT${year}${month}${day}${correlativo}`;
};

interface WorkOrderFormProps {
  ordenTrabajo?: OrdenTrabajo;
  isNew?: boolean;
}

const WorkOrderForm: React.FC<WorkOrderFormProps> = ({ ordenTrabajo: initialOt, isNew }) => {
  // State for the current work order
  const [workOrder, setWorkOrder] = useState<OrdenTrabajo>(() => {
    // console.log("WorkOrderForm props - isNew:", isNew, "initialOt:", initialOt); // Log para props
    // console.log("useState initializer - isNew:", isNew, "initialOt:", initialOt); // Log dentro de useState
    if (isNew) {
      // console.log("useState initializer - Creating NEW work order");
      const newOtId = generateOtId();
      const newWorkOrder: OrdenTrabajo = {
        id: newOtId,
        fechaCreacion: new Date().toISOString().split('T')[0],
        creadoPor: "UsuarioActual", // Placeholder
        estado: "Creada", // Default estado for new OT
        motivoIngreso: '',
        cliente: '',
        vendedor: '',
        numeroSerie: '',
        modelo: '',
        recibidoPor: '',
        fechaVentaCliente: '',
        fechaRecepcion: '',
        tipoProducto: '',
        producto: '', // Corresponds to tipoGB or tipoGM based on tipoProducto
        productoOtro: '',
        orientacion: '',
        reduccion: '',
        tipoGB: '', // Ensure these are initialized if you have specific fields for them
        tipoGM: '', // Ensure these are initialized
        historial: [{ fecha: new Date().toISOString(), evento: "OT Creada", responsable: "UsuarioActual" }],
        // Initialize all other sections to their empty/default states
        inspeccionVisual: { realizadoPor: '', fecha: '', comentarios: '', fotos: [] },
        limpiezaEquipo: { tipoLavado: '', fechaRealizacion: '', internoOProveedor: undefined, realizadoPor: '', comentarios: '', fotos: [] },
        desarme: { accionARealizar: '', fecha: '', realizadoPor: '', fotos: [] },
        diagnosticoPiezas: { piezas: [], fecha: '', realizadoPor: '' },
        presupuesto: { items: [], valorTotal: 0, fechaCreacion: '', creadoPor: '', subtotal: 0, impuestos: 0, totalGeneral: 0 },
        reparacion: { piezasAdicionales: [], comentarios: '', realizadoPor: '' },
        pruebasDinamicas: { tipoPrueba: '', resultados: '', fotos: [], fecha: '', realizadoPor: '' },
        aprobacionCalidad: { aprobado: false, firma: '', fecha: '', aprobadoPor: '' },
        despacho: { guiaDespacho: '', fechaDespacho: '', despachadoPor: '', comentarios: '', adjuntos: [] },
        changeLog: [{
          id: generateUUID(),
          timestamp: new Date().toISOString(),
          user: "Sistema",
          changeType: "OT_CREATION",
          description: `Nueva Orden de Trabajo ${newOtId} creada.`,
          details: { otId: newOtId }
        }]
      };
      return newWorkOrder;
    } else if (initialOt) {
      // console.log("useState initializer - Using initialOt:", initialOt);
      if (!initialOt.changeLog) {
        initialOt.changeLog = [{
          id: generateUUID(),
          timestamp: new Date().toISOString(),
          user: "Sistema",
          changeType: "OT_CREATION",
          description: `Historial de cambios inicializado para OT ${initialOt.id} (N/S: ${initialOt.numeroSerie || 'N/A'}).`,
          details: { numeroSerie: initialOt.numeroSerie }
        }];
      }
      return initialOt;
    } else {
      // Fallback si ni isNew es true ni initialOt es provisto (escenario inesperado)
      console.error("OTDetailsPage: Ni isNew ni initialOt fueron provistos. Creando OT de emergencia.");
      const emergencyId = generateOtId();
      const emergencyOt: OrdenTrabajo = {
        id: emergencyId,
        fechaCreacion: new Date().toISOString().split('T')[0],
        creadoPor: "SistemaEmergencia",
        estado: "Error",
        motivoIngreso: '',
        cliente: '',
        vendedor: '',
        numeroSerie: 'ERROR',
        modelo: '',
        recibidoPor: '',
        fechaVentaCliente: '',
        fechaRecepcion: '',
        tipoProducto: '',
        producto: '',
        productoOtro: '',
        orientacion: '',
        reduccion: '',
        historial: [{ fecha: new Date().toISOString(), evento: "OT de Emergencia Creada", responsable: "SistemaEmergencia" }],
        inspeccionVisual: { realizadoPor: '', fecha: '', comentarios: '', fotos: [] },
        limpiezaEquipo: { tipoLavado: '', fechaRealizacion: '', internoOProveedor: undefined, realizadoPor: '', comentarios: '', fotos: [] },
        desarme: { accionARealizar: '', fecha: '', realizadoPor: '', fotos: [] },
        diagnosticoPiezas: { piezas: [], fecha: '', realizadoPor: '' },
        presupuesto: { items: [], valorTotal: 0, fechaCreacion: '', creadoPor: '', subtotal: 0, impuestos: 0, totalGeneral: 0 },
        reparacion: { piezasAdicionales: [], comentarios: '', realizadoPor: '' },
        pruebasDinamicas: { tipoPrueba: '', resultados: '', fotos: [], fecha: '', realizadoPor: '' },
        aprobacionCalidad: { aprobado: false, firma: '', fecha: '', aprobadoPor: '' },
        despacho: { guiaDespacho: '', fechaDespacho: '', despachadoPor: '', comentarios: '', adjuntos: [] },
        changeLog: [{
          id: generateUUID(),
          timestamp: new Date().toISOString(),
          user: "Sistema",
          changeType: "OT_CREATION",
          description: `OT de Emergencia ${emergencyId} creada debido a falta de datos.`,
          details: { otId: emergencyId, error: "Faltan isNew o initialOt" }
        }]
      };
      return emergencyOt;
    }
  });
  // State for active tab
  const [activeTab, setActiveTab] = useState('inspeccion');
  // No local serialNumber state here, workOrder.numeroSerie is the truth
  const navigate = useNavigate();

  // Function to add a new entry to the change log
  const addChangeLogEntry = (entryData: Omit<ChangeHistoryEntry, 'id' | 'timestamp' | 'user'>) => {
    const newEntry: ChangeHistoryEntry = {
      id: generateUUID(),
      timestamp: new Date().toISOString(),
      user: "CurrentUser", // Placeholder - replace with actual user logic
      ...entryData,
    };
    setWorkOrder(prev => ({
      ...prev,
      changeLog: [...(prev.changeLog || []), newEntry]
    }));
  };
  // Effect for serialNumber removed, it will be handled by onHeaderChange
  
  // Function to handle changes in the header form
  const handleHeaderChange = (field: string, value: any) => {
    const oldValue = workOrder[field];
    if (oldValue !== value) {
      const fieldNameMappings: Record<string, string> = {
        numeroSerie: "Número de Serie (Equipo)",
        tipoProducto: "Tipo de Producto",
        tipoGB: "Tipo GB",
        tipoGM: "Tipo GM",
        orientacion: "Orientación",
        reduccion: "Reducción",
        fechaRecepcion: "Fecha de Recepción",
        cliente: "Cliente",
        vendedor: "Vendedor",
        modelo: "Modelo del Equipo",
        recibidoPor: "Recibido Por",
        fechaVentaCliente: "Fecha Venta Cliente",
        estado: "Estado"
      };
      const displayFieldName = fieldNameMappings[field] || field;

      addChangeLogEntry({
        changeType: "HEADER_FIELD_UPDATE",
        description: `Campo '${displayFieldName}' cambiado de '${oldValue || "N/A"}' a '${value || "N/A"}'.`,
        details: { field: displayFieldName, oldValue, newValue: value }
      });
      setWorkOrder(prev => ({ ...prev, [field]: value }));
    } else {
      // If only a state update is needed without logging (e.g. derived state)
      setWorkOrder(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleNumeroSerieBlur = (numeroSerieIngresado: string) => {
    const trimmedNumeroSerie = numeroSerieIngresado.trim();
    if (!trimmedNumeroSerie) return;

    if (trimmedNumeroSerie === "1234") {
      // Ejemplo específico para el número de serie 1234
      const exampleData: Partial<OrdenTrabajo> = {
        tipoProducto: "GM",
        producto: "Cyclo",
        reduccion: "doble",
        orientacion: "vertical",
        cliente: clienteOptions[0], // Usar el primer cliente de las opciones
        vendedor: vendedorOptions[0], // Usar el primer vendedor de las opciones
        modelo: modeloEquipoOptions[0], // Usar el primer modelo de las opciones
        fechaVentaCliente: "2024-01-10",
      };
      setWorkOrder(prevWorkOrder => ({
        ...prevWorkOrder,
        ...exampleData,
        // Si 'producto' es el campo para 'Cyclo', 'Paramax', etc. y 'tipoGM'/'tipoGB' no son usados directamente en workOrder para esto:
        tipoGM: exampleData.tipoProducto === "GM" ? exampleData.producto : prevWorkOrder.tipoGM,
        tipoGB: exampleData.tipoProducto === "GB" ? exampleData.producto : prevWorkOrder.tipoGB,
      }));
      addChangeLogEntry({
        changeType: "HEADER_FIELD_UPDATE",
        description: `Campos autocompletados para N/S especial: ${trimmedNumeroSerie}.`,
        details: { numeroSerie: trimmedNumeroSerie, origen: "Autocompletado especial 1234" }
      });
    } else {
      // Lógica existente para otros números de serie
      const otEncontrada = mockOrdenesTrabajo.find(ot => String(ot.numeroSerie).trim() === trimmedNumeroSerie);
      if (otEncontrada) {
        setWorkOrder(prevWorkOrder => {
          const updates: Partial<OrdenTrabajo> = {};
          if (otEncontrada.tipoProducto !== undefined) updates.tipoProducto = otEncontrada.tipoProducto;
          // Asegurar que 'producto' se actualiza correctamente y, si es necesario, 'tipoGB'/'tipoGM'
          if (otEncontrada.producto !== undefined) {
            updates.producto = otEncontrada.producto;
            if (otEncontrada.tipoProducto === "GB") {
              updates.tipoGB = otEncontrada.producto;
              updates.tipoGM = ''; // Limpiar el otro tipo
            } else if (otEncontrada.tipoProducto === "GM") {
              updates.tipoGM = otEncontrada.producto;
              updates.tipoGB = ''; // Limpiar el otro tipo
            }
          }
          if (otEncontrada.productoOtro !== undefined) updates.productoOtro = otEncontrada.productoOtro;
          if (otEncontrada.orientacion !== undefined) updates.orientacion = otEncontrada.orientacion;
          if (otEncontrada.reduccion !== undefined) updates.reduccion = otEncontrada.reduccion;
          if (otEncontrada.cliente !== undefined) updates.cliente = otEncontrada.cliente;
          if (otEncontrada.vendedor !== undefined) updates.vendedor = otEncontrada.vendedor;
          if (otEncontrada.modelo !== undefined) updates.modelo = otEncontrada.modelo;
          if (otEncontrada.fechaVentaCliente !== undefined) updates.fechaVentaCliente = otEncontrada.fechaVentaCliente;

          return { ...prevWorkOrder, ...updates };
        });

        addChangeLogEntry({
          changeType: "HEADER_FIELD_UPDATE",
          description: `Campos autocompletados basados en N/S: ${trimmedNumeroSerie}.`,
          details: { numeroSerie: trimmedNumeroSerie, origen: "Autocompletado por N/S existente" }
        });
      }
    }
  };
  
  // Function to handle changes in the history (OLD - TO BE REMOVED/REPLACED)
  // const handleHistoryChange = (newHistory) => {
  //   setWorkOrder(prev => ({ ...prev, historial: newHistory }));
  // };
  // Remove handleHistoryChange prop from HistoryPanel later
  const handleHistoryChange = (newHistory) => {
    console.warn("handleHistoryChange is obsolete and should be removed.");
  };
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Volver a Home
        </button>
      </div>
      {/* Header with equipment info, client info, and status */}
      <Header 
        workOrder={workOrder} 
        onHeaderChange={handleHeaderChange}
        onNumeroSerieBlur={handleNumeroSerieBlur}
        isNewOt={isNew} // isNew (de props) se pasa como isNewOt al Header
      />
      
      {/* Tabs for different sections */}
      <Tabs 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        workOrder={workOrder}
        setWorkOrder={setWorkOrder} // This will be refactored to use addChangeLogEntry for specific actions
        addChangeLogEntry={addChangeLogEntry} // Pass the logger
      />
      
      {/* Display immutable change log */}
      <ChangeLogDisplay
        changeLog={workOrder.changeLog || []}
      />
    </div>
  );
};

// Header component
const Header = ({ workOrder, onHeaderChange, onNumeroSerieBlur, isNewOt }) => {
  const [isEditing, setIsEditing] = useState(isNewOt); // isNewOt viene de isNew en WorkOrderForm

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Información de la Orden de Trabajo</h2>
        <button
          onClick={toggleEditing}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isEditing ? 'Finalizar Edición OT' : 'Editar Información OT'}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Número de OT (ID)</label>
          <input
            type="text"
            value={workOrder.id || ''}
            readOnly
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Número de Serie (Equipo)</label>
          <input
            type="text"
            value={workOrder.numeroSerie || ''}
            onChange={(e) => onHeaderChange('numeroSerie', e.target.value)}
            onBlur={(e) => onNumeroSerieBlur(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault(); // Prevenir submit de formulario si existiera
                onNumeroSerieBlur((e.target as HTMLInputElement).value);
              }
            }}
            readOnly={!isEditing}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${!isEditing ? 'bg-gray-100' : ''}`}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Tipo de Producto</label>
          <select 
            value={workOrder.tipoProducto || ''}
            onChange={(e) => onHeaderChange('tipoProducto', e.target.value)}
            disabled={!isEditing}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${!isEditing ? 'bg-gray-100' : ''}`}
          >
            <option value="">Seleccione...</option>
            <option value="GB">GB</option>
            <option value="GM">GM</option>
          </select>
        </div>
        
        {workOrder.tipoProducto === 'GB' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo GB</label>
            <select 
              value={workOrder.tipoGB || ''} // Use workOrder.tipoGB
              onChange={(e) => onHeaderChange('tipoGB', e.target.value)}
              disabled={!isEditing}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${!isEditing ? 'bg-gray-100' : ''}`}
            >
              <option value="">Seleccione...</option>
              <option value="Paramax">Paramax</option>
              <option value="Hansen">Hansen</option>
              <option value="Flender">Flender</option>
              <option value="Sew">Sew</option>
              <option value="Falk">Falk</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
        )}
        
        {workOrder.tipoProducto === 'GM' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo GM</label>
            <select 
              value={workOrder.tipoGM || ''} // Use workOrder.tipoGM
              onChange={(e) => onHeaderChange('tipoGM', e.target.value)}
              disabled={!isEditing}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${!isEditing ? 'bg-gray-100' : ''}`}
            >
              <option value="">Seleccione...</option>
              <option value="Cyclo">Cyclo</option>
              <option value="BBB">BBB</option>
              <option value="HSM">HSM</option>
              <option value="Hyponic">Hyponic</option>
              <option value="Helical (HHB)">Helical (HHB)</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Orientación</label>
          <select 
            value={workOrder.orientacion || ''}
            onChange={(e) => onHeaderChange('orientacion', e.target.value)}
            disabled={!isEditing}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${!isEditing ? 'bg-gray-100' : ''}`}
          >
            <option value="">Seleccione...</option>
            <option value="vertical">Vertical</option>
            <option value="horizontal">Horizontal</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Reducción</label>
          <select 
            value={workOrder.reduccion || ''}
            onChange={(e) => onHeaderChange('reduccion', e.target.value)}
            disabled={!isEditing}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${!isEditing ? 'bg-gray-100' : ''}`}
          >
            <option value="">Seleccione...</option>
            <option value="simple">Reducción Simple</option>
            <option value="doble">Doble Reducción</option>
            <option value="triple">Triple Reducción</option>
            <option value="cuadruple">Cuadruple Reducción</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Cliente</label>
          <select 
            value={workOrder.cliente || ''}
            onChange={(e) => onHeaderChange('cliente', e.target.value)}
            disabled={!isEditing}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${!isEditing ? 'bg-gray-100' : ''}`}
          >
            <option value="">Seleccione...</option>
            {clienteOptions.map(cliente => (
              <option key={cliente} value={cliente}>{cliente}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Vendedor</label>
          <select 
            value={workOrder.vendedor || ''}
            onChange={(e) => onHeaderChange('vendedor', e.target.value)}
            disabled={!isEditing}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${!isEditing ? 'bg-gray-100' : ''}`}
          >
            <option value="">Seleccione...</option>
            {vendedorOptions.map(vendedor => (
              <option key={vendedor} value={vendedor}>{vendedor}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Modelo del Equipo</label>
          <select 
            value={workOrder.modelo || ''}
            onChange={(e) => onHeaderChange('modelo', e.target.value)}
            disabled={!isEditing}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${!isEditing ? 'bg-gray-100' : ''}`}
          >
            <option value="">Seleccione...</option>
            {modeloEquipoOptions.map(modelo => (
              <option key={modelo} value={modelo}>{modelo}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha de Venta al Cliente</label>
          <input
            type="date"
            value={workOrder.fechaVentaCliente || ''}
            onChange={(e) => onHeaderChange('fechaVentaCliente', e.target.value)}
            readOnly={!isEditing}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${!isEditing ? 'bg-gray-100' : ''}`}
          />
        </div>

        {/* Campos movidos al final */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha Posible de Recepción</label>
          <input
            type="date"
            value={workOrder.fechaRecepcion || ''}
            onChange={(e) => onHeaderChange('fechaRecepcion', e.target.value)}
            readOnly={!isEditing}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${!isEditing ? 'bg-gray-100' : ''}`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Recibido Por</label>
          <select 
            value={workOrder.recibidoPor || ''}
            onChange={(e) => onHeaderChange('recibidoPor', e.target.value)}
            disabled={!isEditing}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${!isEditing ? 'bg-gray-100' : ''}`}
          >
            <option value="">Seleccione...</option>
            {recibidoPorOptions.map(recibido => (
              <option key={recibido} value={recibido}>{recibido}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Estado</label>
          <select 
            value={workOrder.estado}
            onChange={(e) => onHeaderChange('estado', e.target.value)}
            disabled={!isEditing} // El estado inicial es "Creada" y no editable al principio
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${!isEditing ? 'bg-gray-100' : ''}`}
          >
            {/* No "Seleccione..." para estado, siempre debe tener un valor */}
            {otStatusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

// Tabs component
const Tabs = ({ activeTab, setActiveTab, workOrder, setWorkOrder, addChangeLogEntry }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <nav className="flex flex-wrap space-x-2 md:space-x-4 mb-6 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('inspeccion')} 
          className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${activeTab === 'inspeccion' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Inspección Visual
        </button>
        <button 
          onClick={() => setActiveTab('limpieza')} 
          className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${activeTab === 'limpieza' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
          disabled={!isTabEnabled('limpieza', workOrder.estado)}
        >
          Limpieza de Equipo
        </button>
        <button 
          onClick={() => setActiveTab('desarme')} 
          className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${activeTab === 'desarme' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
          disabled={!isTabEnabled('desarme', workOrder.estado)}
        >
          Desarme
        </button>
        <button 
          onClick={() => setActiveTab('piezas')} 
          className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${activeTab === 'piezas' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
          disabled={!isTabEnabled('piezas', workOrder.estado)}
        >
          Piezas
        </button>
        <button 
          onClick={() => setActiveTab('presupuesto')} 
          className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${activeTab === 'presupuesto' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
          disabled={!isTabEnabled('presupuesto', workOrder.estado)}
        >
          Presupuesto
        </button>
        <button 
          onClick={() => setActiveTab('reparacion')} 
          className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${activeTab === 'reparacion' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
          disabled={!isTabEnabled('reparacion', workOrder.estado)}
        >
          Reparación
        </button>
        <button 
          onClick={() => setActiveTab('pruebas')} 
          className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${activeTab === 'pruebas' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
          disabled={!isTabEnabled('pruebas', workOrder.estado)}
        >
          Pruebas Dinámicas
        </button>
        <button 
          onClick={() => setActiveTab('calidad')} 
          className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${activeTab === 'calidad' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
          disabled={!isTabEnabled('calidad', workOrder.estado)}
        >
          Aprobación de Calidad
        </button>
        <button 
          onClick={() => setActiveTab('cierre')} 
          className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${activeTab === 'cierre' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
          disabled={!isTabEnabled('cierre', workOrder.estado)}
        >
          Cierre
        </button>
      </nav>
      
      <div className="mt-4">
        {activeTab === 'inspeccion' && <InspectionTab workOrder={workOrder} setWorkOrder={setWorkOrder} addChangeLogEntry={addChangeLogEntry} />}
        {activeTab === 'limpieza' && <CleaningTab workOrder={workOrder} setWorkOrder={setWorkOrder} addChangeLogEntry={addChangeLogEntry} />}
        {activeTab === 'desarme' && <DisassemblyTab workOrder={workOrder} setWorkOrder={setWorkOrder} addChangeLogEntry={addChangeLogEntry} />}
        {activeTab === 'piezas' && <PartsTab workOrder={workOrder} setWorkOrder={setWorkOrder} addChangeLogEntry={addChangeLogEntry} />}
        {activeTab === 'presupuesto' && <BudgetTab workOrder={workOrder} setWorkOrder={setWorkOrder} addChangeLogEntry={addChangeLogEntry} />}
        {activeTab === 'reparacion' && <RepairTab workOrder={workOrder} setWorkOrder={setWorkOrder} addChangeLogEntry={addChangeLogEntry} />}
        {activeTab === 'pruebas' && <TestingTab workOrder={workOrder} setWorkOrder={setWorkOrder} addChangeLogEntry={addChangeLogEntry} />}
        {activeTab === 'calidad' && <QualityTab workOrder={workOrder} setWorkOrder={setWorkOrder} addChangeLogEntry={addChangeLogEntry} />}
        {activeTab === 'cierre' && <ClosureTab workOrder={workOrder} setWorkOrder={setWorkOrder} addChangeLogEntry={addChangeLogEntry} />}
      </div>
    </div>
  );
};

// Helper function to determine if a tab is enabled based on the current state
const isTabEnabled = (tabName: string, currentStatus: string) => {
  // This would need to be customized based on your specific business rules
  // For now, just enabling all tabs for simplicity
  return true;
};

// Inspection Tab
const InspectionTab: React.FC<TabComponentProps> = ({ workOrder, setWorkOrder, addChangeLogEntry }) => {
  const handleCommentsChange = (newComments: string) => {
    setWorkOrder(prev => ({
      ...prev,
      inspeccionVisual: {
        ...(prev.inspeccionVisual || { realizadoPor: "CurrentUser", fecha: new Date().toISOString() }), // Ensure inspeccionVisual object exists
        comentarios: newComments
      }
    }));
  };

  const handleCommentsBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    const newComments = event.target.value;
    const oldComments = workOrder.inspeccionVisual?.comentarios || "";
    if (newComments !== oldComments) {
      addChangeLogEntry({
        changeType: "INSPECTION_UPDATE",
        description: "Comentarios de inspección actualizados.",
        details: { field: "inspeccionVisual.comentarios", oldValue: oldComments, newValue: newComments }
      });
      // Ensure other required fields for inspeccionVisual are set if not present
      if (!workOrder.inspeccionVisual?.realizadoPor || !workOrder.inspeccionVisual?.fecha) {
        setWorkOrder(prev => ({
          ...prev,
          inspeccionVisual: {
            ...(prev.inspeccionVisual || {}),
            comentarios: newComments, // Already set by handleCommentsChange if it was called
            realizadoPor: prev.inspeccionVisual?.realizadoPor || "CurrentUser",
            fecha: prev.inspeccionVisual?.fecha || new Date().toISOString()
          }
        }));
      }
    }
  };

  const handleAddPhoto = (photoDataUrl: string, fileName: string) => {
    const newPhotoEntry = { // Conforms to FotoEntry structure (assuming url is the dataUrl)
      url: photoDataUrl,
      descripcion: fileName,
      fecha: new Date().toISOString(),
      subidoPor: "CurrentUser" // Placeholder
    };
    setWorkOrder(prev => ({
      ...prev,
      inspeccionVisual: {
        ...(prev.inspeccionVisual || { realizadoPor: "CurrentUser", fecha: new Date().toISOString() }),
        fotos: [...(prev.inspeccionVisual?.fotos || []), newPhotoEntry]
      }
    }));
    addChangeLogEntry({
      changeType: "INSPECTION_UPDATE",
      description: `Foto '${fileName}' agregada a inspección.`,
      details: { action: "ADD_PHOTO", tab: "inspeccionVisual", fileName }
    });
  };
  
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Inspección Visual</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Comentarios</label>
        <textarea 
          rows={4}
          value={workOrder.inspeccionVisual?.comentarios || ''}
          onChange={(e) => handleCommentsChange(e.target.value)}
          onBlur={handleCommentsBlur}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
        ></textarea>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Fotos</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(workOrder.inspeccionVisual?.fotos || []).map((fotoEntry, index) => (
            <img 
              key={index} 
              src={fotoEntry.url}
              alt={fotoEntry.descripcion || `Inspección ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg border border-gray-200"
            />
          ))}
        </div>
        <div className="mt-2">
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (loadEvent) => {
                    if (loadEvent.target && loadEvent.target.result) {
                      handleAddPhoto(loadEvent.target.result as string, file.name);
                    }
                  };
                  reader.readAsDataURL(file);
                }
              }
            }}
            className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>
      </div>
    </div>
  );
};

// Cleaning Tab
const CleaningTab: React.FC<TabComponentProps> = ({ workOrder, setWorkOrder, addChangeLogEntry }) => {
  const handleFieldChange = (field: keyof NonNullable<OrdenTrabajo['limpiezaEquipo']>, value: any) => {
    const oldValue = workOrder.limpiezaEquipo?.[field] || "";
    // Ensure limpiezaEquipo object and its mandatory fields exist before updating
    const currentLimpiezaEquipo = workOrder.limpiezaEquipo || { realizadoPor: "CurrentUser", fechaRealizacion: new Date().toISOString() };

    if (value !== oldValue) {
      setWorkOrder(prev => ({
        ...prev,
        limpiezaEquipo: {
          ...currentLimpiezaEquipo,
          [field]: value,
          realizadoPor: currentLimpiezaEquipo.realizadoPor || "CurrentUser", // Ensure mandatory field
        }
      }));
      const fieldNameMappings: Record<string, string> = {
        tipoLavado: "Tipo de Lavado",
        fechaRealizacion: "Fecha de Realización",
        internoOProveedor: "Realizado por (Interno/Proveedor)", // Corrected mapping
        comentarios: "Comentarios" // Changed from notas
      };
      const displayFieldName = fieldNameMappings[field] || field;
      addChangeLogEntry({
        changeType: "CLEANING_UPDATE",
        description: `Campo de limpieza '${displayFieldName}' cambiado a '${value || "N/A"}'.`,
        details: { tab: "limpiezaEquipo", field: displayFieldName, oldValue, newValue: value }
      });
    }
  };

  const handleCommentsChange = (newComments: string) => {
     const currentLimpiezaEquipo = workOrder.limpiezaEquipo || { realizadoPor: "CurrentUser", fechaRealizacion: new Date().toISOString() };
    setWorkOrder(prev => ({
      ...prev,
      limpiezaEquipo: {
        ...currentLimpiezaEquipo,
        comentarios: newComments,
        realizadoPor: currentLimpiezaEquipo.realizadoPor || "CurrentUser",
      }
    }));
  };

  const handleCommentsBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    const newComments = event.target.value;
    const oldComments = workOrder.limpiezaEquipo?.comentarios || "";
    if (newComments !== oldComments) {
      addChangeLogEntry({
        changeType: "CLEANING_UPDATE",
        description: "Comentarios de limpieza actualizados.",
        details: { tab: "limpiezaEquipo", field: "comentarios", oldValue: oldComments, newValue: newComments }
      });
       // Ensure mandatory fields if object was just created
      if (!workOrder.limpiezaEquipo?.realizadoPor) {
        setWorkOrder(prev => ({
          ...prev,
          limpiezaEquipo: {
            ...(prev.limpiezaEquipo || {}),
            comentarios: newComments,
            realizadoPor: "CurrentUser",
            fechaRealizacion: prev.limpiezaEquipo?.fechaRealizacion || new Date().toISOString(),
          }
        }));
      }
    }
  };

  const handleAddPhoto = (photoDataUrl: string, fileName: string) => {
    const newPhotoEntry = {
      url: photoDataUrl,
      descripcion: fileName,
      fecha: new Date().toISOString(),
      subidoPor: "CurrentUser"
    };
    setWorkOrder(prev => ({
      ...prev,
      limpiezaEquipo: {
        ...(prev.limpiezaEquipo || { realizadoPor: "CurrentUser", fechaRealizacion: new Date().toISOString() }),
        fotos: [...(prev.limpiezaEquipo?.fotos || []), newPhotoEntry],
        realizadoPor: prev.limpiezaEquipo?.realizadoPor || "CurrentUser",
      }
    }));
    addChangeLogEntry({
      changeType: "CLEANING_UPDATE",
      description: `Foto '${fileName}' agregada a limpieza.`,
      details: { action: "ADD_PHOTO", tab: "limpiezaEquipo", fileName }
    });
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Limpieza de Equipo</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Lavado</label>
          <select 
            value={workOrder.limpiezaEquipo?.tipoLavado || ''}
            onChange={(e) => handleFieldChange('tipoLavado', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Seleccione...</option>
            <option value="general">Limpieza General</option>
            <option value="profundo">Lavado Profundo</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Realización</label>
          <input 
            type="date" 
            value={workOrder.limpiezaEquipo?.fechaRealizacion || ''}
            onChange={(e) => handleFieldChange('fechaRealizacion', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Realizado por</label>
          <select 
            value={workOrder.limpiezaEquipo?.internoOProveedor || ''}
            onChange={(e) => handleFieldChange('internoOProveedor', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Seleccione...</option>
            <option value="Interno">Interno</option>
            <option value="Proveedor">Proveedor</option>
          </select>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Comentarios</label> {/* Changed from Notas */}
        <textarea 
          rows={4}
          value={workOrder.limpiezaEquipo?.comentarios || ''}
          onChange={(e) => handleCommentsChange(e.target.value)}
          onBlur={handleCommentsBlur}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
        ></textarea>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Fotos</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(workOrder.limpiezaEquipo?.fotos || []).map((fotoEntry, index) => (
            <img 
              key={index} 
              src={fotoEntry.url}
              alt={fotoEntry.descripcion || `Limpieza ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg border border-gray-200"
            />
          ))}
        </div>
        <div className="mt-2">
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (loadEvent) => {
                    if (loadEvent.target && loadEvent.target.result) {
                      handleAddPhoto(loadEvent.target.result as string, file.name);
                    }
                  };
                  reader.readAsDataURL(file);
                }
              }
            }}
            className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>
      </div>
    </div>
  );
};

// Disassembly Tab
const DisassemblyTab: React.FC<TabComponentProps> = ({ workOrder, setWorkOrder, addChangeLogEntry }) => {
  const currentDesarme = workOrder.desarme || { fecha: new Date().toISOString(), realizadoPor: "CurrentUser" };

  const handleAccionChange = (newAccion: string) => {
    setWorkOrder(prev => ({
      ...prev,
      desarme: {
        ...currentDesarme,
        accionARealizar: newAccion,
        realizadoPor: currentDesarme.realizadoPor || "CurrentUser",
        fecha: currentDesarme.fecha || new Date().toISOString(),
      }
    }));
  };

  const handleAccionBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    const newAccion = event.target.value;
    const oldAccion = workOrder.desarme?.accionARealizar || "";
    if (newAccion !== oldAccion) {
      addChangeLogEntry({
        changeType: "DISASSEMBLY_UPDATE",
        description: "Acción a realizar en desarme actualizada.",
        details: { tab: "desarme", field: "accionARealizar", oldValue: oldAccion, newValue: newAccion }
      });
       // Ensure mandatory fields if object was just created
      if (!workOrder.desarme?.realizadoPor || !workOrder.desarme?.fecha) {
         setWorkOrder(prev => ({
          ...prev,
          desarme: {
            ...(prev.desarme || {}),
            accionARealizar: newAccion,
            realizadoPor: prev.desarme?.realizadoPor || "CurrentUser",
            fecha: prev.desarme?.fecha || new Date().toISOString(),
          }
        }));
      }
    }
  };

  const handleAddPhoto = (photoDataUrl: string, fileName: string) => {
    const newPhotoEntry: FotoEntry = { // Explicitly use FotoEntry type
      url: photoDataUrl,
      descripcion: fileName,
      fecha: new Date().toISOString(),
      subidoPor: "CurrentUser" // Placeholder
    };
    setWorkOrder(prev => ({
      ...prev,
      desarme: {
        ...currentDesarme,
        fotos: [...(currentDesarme.fotos || []), newPhotoEntry],
        realizadoPor: currentDesarme.realizadoPor || "CurrentUser",
        fecha: currentDesarme.fecha || new Date().toISOString(),
      }
    }));
    addChangeLogEntry({
      changeType: "DISASSEMBLY_UPDATE",
      description: `Foto '${fileName}' agregada a desarme.`,
      details: { action: "ADD_PHOTO", tab: "desarme", fileName }
    });
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Desarme</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Acción a Realizar</label>
        <textarea 
          rows={4}
          value={workOrder.desarme?.accionARealizar || ''}
          onChange={(e) => handleAccionChange(e.target.value)}
          onBlur={handleAccionBlur}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
        ></textarea>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Fotos</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(workOrder.desarme?.fotos || []).map((fotoEntry, index) => (
            <img 
              key={index} 
              src={fotoEntry.url}
              alt={fotoEntry.descripcion || `Desarme ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg border border-gray-200"
            />
          ))}
        </div>
        <div className="mt-2">
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (loadEvent) => {
                    if (loadEvent.target && loadEvent.target.result) { // Null check
                      handleAddPhoto(loadEvent.target.result as string, file.name);
                    }
                  };
                  reader.readAsDataURL(file);
                }
              }
            }}
            className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>
      </div>
    </div>
  );
};

// Parts Tab
const PartsTab: React.FC<TabComponentProps> = ({ workOrder, setWorkOrder, addChangeLogEntry }) => {
  const currentDiagnosticoPiezas = workOrder.diagnosticoPiezas || {
    piezas: [],
    fecha: new Date().toISOString(),
    realizadoPor: "CurrentUser"
  };

  const addPart = () => {
    const newPart: PiezaDetalle = { // Conforms to PiezaDetalle
      nombre: `Nueva Pieza ${ (currentDiagnosticoPiezas.piezas || []).length + 1}`, // Default name
      decision: '', // Default empty
      // foto, mediciones, ensayosNoDestructivos, comentarios are optional
    };
    setWorkOrder(prev => ({
      ...prev,
      diagnosticoPiezas: {
        ...currentDiagnosticoPiezas,
        piezas: [...(currentDiagnosticoPiezas.piezas || []), newPart],
        fecha: currentDiagnosticoPiezas.fecha || new Date().toISOString(),
        realizadoPor: currentDiagnosticoPiezas.realizadoPor || "CurrentUser",
      }
    }));
    addChangeLogEntry({
      changeType: "PARTS_UPDATE",
      description: `Nueva pieza '${newPart.nombre}' agregada a diagnóstico.`,
      details: { action: "ADD_PART", tab: "diagnosticoPiezas", partName: newPart.nombre }
    });
  };
  
  const updatePart = (index: number, field: keyof PiezaDetalle, value: any) => {
    const oldParts = currentDiagnosticoPiezas.piezas || [];
    const updatedParts = oldParts.map((part, i) =>
      i === index ? { ...part, [field]: value } : part
    );
    const oldPartValue = oldParts[index]?.[field];

    setWorkOrder(prev => ({
      ...prev,
      diagnosticoPiezas: {
        ...currentDiagnosticoPiezas,
        piezas: updatedParts,
        fecha: currentDiagnosticoPiezas.fecha || new Date().toISOString(),
        realizadoPor: currentDiagnosticoPiezas.realizadoPor || "CurrentUser",
      }
    }));
    addChangeLogEntry({
      changeType: "PARTS_UPDATE",
      description: `Campo '${String(field)}' de pieza '${updatedParts[index]?.nombre || index + 1}' actualizado a '${value}'.`,
      details: {
        action: "UPDATE_PART_FIELD",
        tab: "diagnosticoPiezas",
        partIndex: index,
        partName: updatedParts[index]?.nombre,
        field,
        oldValue: oldPartValue,
        newValue: value
      }
    });
  };
  
  const removePart = (index: number) => {
    const oldParts = currentDiagnosticoPiezas.piezas || [];
    const removedPart = oldParts[index];
    const updatedParts = oldParts.filter((_, i) => i !== index);
    setWorkOrder(prev => ({
      ...prev,
      diagnosticoPiezas: {
        ...currentDiagnosticoPiezas,
        piezas: updatedParts,
        fecha: currentDiagnosticoPiezas.fecha || new Date().toISOString(),
        realizadoPor: currentDiagnosticoPiezas.realizadoPor || "CurrentUser",
      }
    }));
    addChangeLogEntry({
      changeType: "PARTS_UPDATE",
      description: `Pieza '${removedPart?.nombre || index + 1}' eliminada de diagnóstico.`,
      details: {
        action: "REMOVE_PART",
        tab: "diagnosticoPiezas",
        partIndex: index,
        removedPartName: removedPart?.nombre,
        removedPartDetails: removedPart
      }
    });
  };
  
  const uploadPartPhoto = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      if (loadEvent.target && loadEvent.target.result) {
        const photoDataUrl = loadEvent.target.result as string;
        const newPhotoEntry: FotoEntry = {
          url: photoDataUrl,
          descripcion: `Foto Pieza ${index + 1} - ${file.name}`,
          fecha: new Date().toISOString(),
          subidoPor: "CurrentUser"
        };
        // Update the specific part's 'foto' field
        const oldParts = currentDiagnosticoPiezas.piezas || [];
        const oldPartFoto = oldParts[index]?.foto;
        const updatedParts = oldParts.map((part, i) =>
          i === index ? { ...part, foto: newPhotoEntry } : part
        );

        setWorkOrder(prev => ({
          ...prev,
          diagnosticoPiezas: {
            ...currentDiagnosticoPiezas,
            piezas: updatedParts,
            fecha: currentDiagnosticoPiezas.fecha || new Date().toISOString(),
            realizadoPor: currentDiagnosticoPiezas.realizadoPor || "CurrentUser",
          }
        }));
        addChangeLogEntry({
          changeType: "PARTS_UPDATE",
          description: `Foto '${file.name}' agregada a pieza '${updatedParts[index]?.nombre || index + 1}'.`,
          details: {
            action: "UPLOAD_PART_PHOTO",
            tab: "diagnosticoPiezas",
            partIndex: index,
            partName: updatedParts[index]?.nombre,
            fileName: file.name,
            oldFoto: oldPartFoto
          }
        });
      }
    };
    reader.readAsDataURL(file);
  };
  
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Diagnóstico de Piezas</h3> {/* Title updated */}
      
      <div className="space-y-6">
        {(currentDiagnosticoPiezas.piezas || []).map((part, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-md font-medium">Pieza: {part.nombre || `Pieza ${index + 1}`}</h4>
              <button 
                type="button" 
                onClick={() => removePart(index)}
                className="text-red-600 hover:text-red-800"
              >
                Eliminar
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Pieza</label>
                <input
                  type="text"
                  value={part.nombre}
                  onChange={(e) => updatePart(index, 'nombre', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Foto</label>
                {part.foto ? (
                  <img 
                    src={part.foto.url}
                    alt={part.foto.descripcion || `Pieza ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border border-gray-200 mb-2"
                  />
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-500">Sin foto</p>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      uploadPartPhoto(index, e.target.files[0]);
                    }
                  }}
                  className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 mt-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mediciones Tomadas</label>
                <textarea 
                  rows={3}
                  value={part.mediciones || ''}
                  onChange={(e) => updatePart(index, 'mediciones', e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ensayos No Destructivos Realizados</label>
                <textarea 
                  rows={3}
                  value={part.ensayosNoDestructivos || ''}
                  onChange={(e) => updatePart(index, 'ensayosNoDestructivos', e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recomendación (Decisión)</label>
                <select 
                  value={part.decision || ''}
                  onChange={(e) => updatePart(index, 'decision', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Seleccione...</option>
                  <option value="Reemplazar">Reemplazar</option>
                  <option value="Reparar">Reparar</option>
                  <option value="Reutilizar">Reutilizar</option>
                </select>
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Comentarios Adicionales</label>
                <textarea
                  rows={3}
                  value={part.comentarios || ''}
                  onChange={(e) => updatePart(index, 'comentarios', e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                ></textarea>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button 
        type="button" 
        onClick={addPart}
        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Agregar Pieza
      </button>
    </div>
  );
};

// Budget Tab
const BudgetTab: React.FC<TabComponentProps> = ({ workOrder, setWorkOrder, addChangeLogEntry }) => {
  const currentPresupuesto = workOrder.presupuesto || {
    items: [],
    valorTotal: 0,
    fechaCreacion: new Date().toISOString(),
    creadoPor: "CurrentUser"
  };

  const addItem = () => {
    const newItem: PresupuestoItem = {
      descripcion: '',
      cantidad: 1,
      valorUnitario: 0,
      valorTotal: 0
    };
    setWorkOrder(prev => {
      const presupuesto = prev.presupuesto || { items: [], valorTotal: 0, fechaCreacion: new Date().toISOString(), creadoPor: "CurrentUser" };
      return {
        ...prev,
        presupuesto: {
          ...presupuesto,
          items: [...(presupuesto.items || []), newItem],
          // Ensure mandatory fields are present
          fechaCreacion: presupuesto.fechaCreacion || new Date().toISOString(),
          creadoPor: presupuesto.creadoPor || "CurrentUser",
          valorTotal: presupuesto.valorTotal || 0,
        }
      };
    });
    addChangeLogEntry({
      changeType: "BUDGET_ITEM_ADD",
      description: "Nuevo ítem agregado al presupuesto.",
      details: { tab: "presupuesto", item: newItem }
    });
  };
  
  const updateItem = (index: number, field: keyof PresupuestoItem, value: any) => {
    const oldItems = currentPresupuesto.items || [];
    let oldItemValue: any;

    const updatedItems = oldItems.map((item, i) => {
      if (i === index) {
        oldItemValue = item[field];
        const newItem = { ...item, [field]: value };
        if (field === 'cantidad' || field === 'valorUnitario') {
          newItem.valorTotal = (Number(newItem.cantidad) || 0) * (Number(newItem.valorUnitario) || 0);
        }
        return newItem;
      }
      return item;
    });
    
    setWorkOrder(prev => {
      const presupuesto = prev.presupuesto || { items: [], valorTotal: 0, fechaCreacion: new Date().toISOString(), creadoPor: "CurrentUser" };
      return {
        ...prev,
        presupuesto: {
          ...presupuesto,
          items: updatedItems,
          fechaCreacion: presupuesto.fechaCreacion || new Date().toISOString(),
          creadoPor: presupuesto.creadoPor || "CurrentUser",
          valorTotal: presupuesto.valorTotal || 0,
        }
      }
    });
    addChangeLogEntry({
      changeType: "BUDGET_ITEM_UPDATE",
      description: `Ítem '${updatedItems[index]?.descripcion || index + 1}' del presupuesto actualizado (campo: ${String(field)}).`,
      details: {
        tab: "presupuesto",
        itemIndex: index,
        field,
        oldValue: oldItemValue,
        newValue: value,
        itemDescription: updatedItems[index]?.descripcion
      }
    });
  };
  
  const removeItem = (index: number) => {
    const oldItems = currentPresupuesto.items || [];
    const removedItem = oldItems[index];
    const updatedItems = oldItems.filter((_, i) => i !== index);
    setWorkOrder(prev => {
      const presupuesto = prev.presupuesto || { items: [], valorTotal: 0, fechaCreacion: new Date().toISOString(), creadoPor: "CurrentUser" };
      return {
        ...prev,
        presupuesto: {
          ...presupuesto,
          items: updatedItems,
          fechaCreacion: presupuesto.fechaCreacion || new Date().toISOString(),
          creadoPor: presupuesto.creadoPor || "CurrentUser",
          valorTotal: presupuesto.valorTotal || 0,
        }
      }
    });
    addChangeLogEntry({
      changeType: "BUDGET_ITEM_REMOVE",
      description: `Ítem '${removedItem?.descripcion || index + 1}' eliminado del presupuesto.`,
      details: { tab: "presupuesto", itemIndex: index, removedItem }
    });
  };
  
  // Calculate totals
  const items = workOrder.presupuesto?.items || [];
  const subtotal = items.reduce((sum, item) => sum + (item.valorTotal || 0), 0);
  const impuestos = subtotal * 0.19; // Assuming 19% tax
  const totalGeneral = subtotal + impuestos;
  
  useEffect(() => {
    // Only update if the calculated totals differ from what's in state, to avoid infinite loops
    if (
      workOrder.presupuesto?.subtotal !== subtotal ||
      workOrder.presupuesto?.impuestos !== impuestos ||
      workOrder.presupuesto?.totalGeneral !== totalGeneral
    ) {
      setWorkOrder(prev => {
        const presupuesto = prev.presupuesto || { items: [], valorTotal: 0, fechaCreacion: new Date().toISOString(), creadoPor: "CurrentUser" };
        return {
        ...prev,
        presupuesto: {
          ...presupuesto,
          subtotal,
          impuestos,
          totalGeneral,
          // Ensure mandatory fields
          fechaCreacion: presupuesto.fechaCreacion || new Date().toISOString(),
          creadoPor: presupuesto.creadoPor || "CurrentUser",
          valorTotal: presupuesto.valorTotal || 0, // This valorTotal is on presupuesto itself, distinct from item.valorTotal
        }
      }});
    }
  }, [workOrder.presupuesto, subtotal, impuestos, totalGeneral, setWorkOrder]);

  const handleApprovalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isApproved = e.target.checked;
    const oldApprovalState = !!workOrder.presupuesto?.aprobado;

    setWorkOrder(prev => {
      const presupuesto = prev.presupuesto || { items: [], valorTotal: 0, fechaCreacion: new Date().toISOString(), creadoPor: "CurrentUser" };
      return {
      ...prev,
      presupuesto: {
        ...presupuesto,
        aprobado: isApproved,
        fechaAprobacion: isApproved ? new Date().toISOString().split('T')[0] : undefined,
        responsable: isApproved ? (presupuesto.responsable || "CurrentUser") : undefined, // Keep existing responsable or set new
        // Ensure mandatory fields
        fechaCreacion: presupuesto.fechaCreacion || new Date().toISOString(),
        creadoPor: presupuesto.creadoPor || "CurrentUser",
        valorTotal: presupuesto.valorTotal || 0,
      }
    }});

    if (isApproved !== oldApprovalState) {
      addChangeLogEntry({
        changeType: "BUDGET_APPROVAL",
        description: `Presupuesto ${isApproved ? 'aprobado' : 'desaprobado'}.`,
        details: { tab: "presupuesto", approved: isApproved, oldState: oldApprovalState }
      });
    }
  };
  
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Presupuesto</h3>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor Unitario</th> {/* Corrected Label */}
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor Total</th> {/* Corrected Label */}
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {(workOrder.presupuesto?.items || []).map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input 
                    type="text" 
                    value={item.descripcion}
                    onChange={(e) => updateItem(index, 'descripcion', e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input 
                    type="number" 
                    min="1"
                    value={item.cantidad}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value)) {
                        updateItem(index, 'cantidad', value);
                      }
                    }}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input 
                    type="number" 
                    min="0"
                    value={item.valorUnitario} // Corrected field
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (!isNaN(value)) {
                        updateItem(index, 'valorUnitario', value); // Corrected field
                      }
                    }}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ${(item.valorTotal || 0).toFixed(2)} {/* Corrected field */}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    type="button" 
                    onClick={() => removeItem(index)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4">
        <button 
          type="button" 
          onClick={addItem}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Agregar Item
        </button>
      </div>
      
      <div className="mt-6 border-t border-gray-200 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subtotal</label>
            <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-50 p-2">
              ${(workOrder.presupuesto?.subtotal ?? subtotal).toFixed(2)}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Impuestos (19%)</label>
            <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-50 p-2">
              ${(workOrder.presupuesto?.impuestos ?? impuestos).toFixed(2)}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total General</label>
            <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-50 p-2 font-bold">
              ${(workOrder.presupuesto?.totalGeneral ?? totalGeneral).toFixed(2)}
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Aprobación Interna</label>
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="presupuesto_aprobado_interno" // Unique ID
              checked={!!workOrder.presupuesto?.aprobado}
              onChange={handleApprovalChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="presupuesto_aprobado_interno" className="ml-2 block text-sm text-gray-700">
              Presupuesto aprobado internamente
            </label>
          </div>
          
          {workOrder.presupuesto?.aprobado && (
            <div className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Responsable Aprobación</label>
                  <input
                    type="text"
                    value={workOrder.presupuesto?.responsable || ''}
                    onChange={(e) => setWorkOrder(prev => {
                        const presupuesto = prev.presupuesto || { items: [], valorTotal: 0, fechaCreacion: new Date().toISOString(), creadoPor: "CurrentUser" };
                        return ({
                        ...prev,
                        presupuesto: { ...presupuesto, responsable: e.target.value, fechaCreacion: presupuesto.fechaCreacion, valorTotal: presupuesto.valorTotal, creadoPor: presupuesto.creadoPor }
                      })})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Nombre del responsable"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fecha de Aprobación</label>
                  <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-50 p-2">
                    {workOrder.presupuesto?.fechaAprobacion || new Date().toISOString().split('T')[0]}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Repair Tab
const RepairTab: React.FC<TabComponentProps> = ({ workOrder, setWorkOrder, addChangeLogEntry }) => {
  const currentReparacion = workOrder.reparacion || { realizadoPor: "CurrentUser" };

  const addAdditionalPart = () => {
    const newPart = { nombre: '', cantidad: 1, motivo: '' }; // Conforms to type
    setWorkOrder(prev => {
      const reparacion = prev.reparacion || { realizadoPor: "CurrentUser" };
      return {
        ...prev,
        reparacion: {
          ...reparacion,
          piezasAdicionales: [...(reparacion.piezasAdicionales || []), newPart],
          realizadoPor: reparacion.realizadoPor || "CurrentUser",
        }
      };
    });
    addChangeLogEntry({
      changeType: "ADDITIONAL_PART_ADD",
      description: "Pieza adicional agregada a reparación.",
      details: { tab: "reparacion", part: newPart }
    });
  };
  
  const updateAdditionalPart = (index: number, field: 'nombre' | 'cantidad' | 'motivo', value: any) => {
    const oldParts = currentReparacion.piezasAdicionales || [];
    let oldValueField: any;

    const updatedParts = oldParts.map((part, i) => {
      if (i === index) {
        oldValueField = part[field];
        return { ...part, [field]: value };
      }
      return part;
    });

    setWorkOrder(prev => {
      const reparacion = prev.reparacion || { realizadoPor: "CurrentUser" };
      return {
      ...prev,
      reparacion: {
        ...reparacion,
        piezasAdicionales: updatedParts,
        realizadoPor: reparacion.realizadoPor || "CurrentUser",
      }
    }});
    addChangeLogEntry({
      changeType: "ADDITIONAL_PART_UPDATE",
      description: `Pieza adicional '${updatedParts[index]?.nombre || index + 1}' actualizada (campo: ${field}).`,
      details: {
        tab: "reparacion",
        partIndex: index,
        field,
        oldValue: oldValueField,
        newValue: value,
        partDescription: updatedParts[index]?.nombre
      }
    });
  };
  
  const removeAdditionalPart = (index: number) => {
    const oldParts = currentReparacion.piezasAdicionales || [];
    const removedPart = oldParts[index];
    const updatedParts = oldParts.filter((_, i) => i !== index);
    setWorkOrder(prev => {
      const reparacion = prev.reparacion || { realizadoPor: "CurrentUser" };
      return {
      ...prev,
      reparacion: {
        ...reparacion,
        piezasAdicionales: updatedParts,
        realizadoPor: reparacion.realizadoPor || "CurrentUser",
      }
    }});
    addChangeLogEntry({
      changeType: "ADDITIONAL_PART_REMOVE",
      description: `Pieza adicional '${removedPart?.nombre || index + 1}' eliminada.`,
      details: { tab: "reparacion", partIndex: index, removedPart }
    });
  };

  const handleCommentsChange = (newComments: string) => {
    setWorkOrder(prev => {
      const reparacion = prev.reparacion || { realizadoPor: "CurrentUser" };
      return {
      ...prev,
      reparacion: {
        ...reparacion,
        comentarios: newComments,
        realizadoPor: reparacion.realizadoPor || "CurrentUser",
      }
    }});
  };

  const handleCommentsBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    const newComments = event.target.value;
    const oldComments = workOrder.reparacion?.comentarios || "";
    if (newComments !== oldComments) {
      addChangeLogEntry({
        changeType: "REPAIR_NOTES_UPDATE",
        description: "Notas de reparación actualizadas.",
        details: { tab: "reparacion", field: "comentarios", oldValue: oldComments, newValue: newComments }
      });
      if (!workOrder.reparacion?.realizadoPor) {
        setWorkOrder(prev => {
          const reparacion = prev.reparacion || { realizadoPor: "CurrentUser" };
          return {
            ...prev,
            reparacion: {
              ...reparacion,
              comentarios: newComments,
              realizadoPor: reparacion.realizadoPor || "CurrentUser",
            }
          }
        });
      }
    }
  };
  
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Reparación</h3>
      
      <div className="mb-6">
        <h4 className="text-md font-medium mb-2">Piezas Adicionales</h4>
        <p className="text-sm text-gray-500 mb-4">Estas piezas no se cobrarán al cliente (se registran por motivos de control interno).</p>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre Pieza</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motivo</th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(workOrder.reparacion?.piezasAdicionales || []).map((part, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input 
                      type="text" 
                      value={part.nombre}
                      onChange={(e) => updateAdditionalPart(index, 'nombre', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input 
                      type="number" 
                      min="1"
                      value={part.cantidad}
                      onChange={(e) => updateAdditionalPart(index, 'cantidad', parseInt(e.target.value))}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input 
                      type="text"
                      value={part.motivo}
                      onChange={(e) => updateAdditionalPart(index, 'motivo', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      type="button" 
                      onClick={() => removeAdditionalPart(index)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4">
          <button 
            type="button" 
            onClick={addAdditionalPart}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Agregar Pieza Adicional
          </button>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Comentarios de Reparación</label> {/* Label updated */}
        <textarea 
          rows={6}
          value={workOrder.reparacion?.comentarios || ''}
          onChange={(e) => handleCommentsChange(e.target.value)}
          onBlur={handleCommentsBlur}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
        ></textarea>
      </div>
    </div>
  );
};

// Testing Tab
const TestingTab: React.FC<TabComponentProps> = ({ workOrder, setWorkOrder, addChangeLogEntry }) => {
  const currentPruebas = workOrder.pruebasDinamicas || { fecha: new Date().toISOString(), realizadoPor: "CurrentUser" };

  const handleInputChange = (field: 'tipoPrueba' | 'resultados', value: string) => {
    setWorkOrder(prev => ({
      ...prev,
      pruebasDinamicas: {
        ...currentPruebas,
        [field]: value,
        realizadoPor: currentPruebas.realizadoPor || "CurrentUser",
        fecha: currentPruebas.fecha || new Date().toISOString(),
      }
    }));
  };

  const handleInputBlur = (field: 'tipoPrueba' | 'resultados', value: string) => {
    const oldValue = workOrder.pruebasDinamicas?.[field] || "";
    if (value !== oldValue) {
      addChangeLogEntry({
        changeType: "TESTING_UPDATE",
        description: `Campo de pruebas dinámicas '${field}' actualizado.`,
        details: { tab: "pruebasDinamicas", field, oldValue, newValue: value }
      });
      if (!workOrder.pruebasDinamicas?.realizadoPor || !workOrder.pruebasDinamicas?.fecha) {
        setWorkOrder(prev => ({
          ...prev,
          pruebasDinamicas: {
            ...(prev.pruebasDinamicas || {}),
            [field]:value, // ensure value is set
            realizadoPor: prev.pruebasDinamicas?.realizadoPor || "CurrentUser",
            fecha: prev.pruebasDinamicas?.fecha || new Date().toISOString(),
          }
        }));
      }
    }
  };

  const handleAddPhoto = (photoDataUrl: string, fileName: string) => {
    const newPhotoEntry: FotoEntry = {
      url: photoDataUrl,
      descripcion: fileName,
      fecha: new Date().toISOString(),
      subidoPor: "CurrentUser"
    };
    setWorkOrder(prev => ({
      ...prev,
      pruebasDinamicas: {
        ...currentPruebas,
        fotos: [...(currentPruebas.fotos || []), newPhotoEntry],
        realizadoPor: currentPruebas.realizadoPor || "CurrentUser",
        fecha: currentPruebas.fecha || new Date().toISOString(),
      }
    }));
    addChangeLogEntry({
      changeType: "TESTING_UPDATE",
      description: `Foto '${fileName}' agregada a pruebas dinámicas.`,
      details: { action: "ADD_PHOTO", tab: "pruebasDinamicas", fileName }
    });
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Pruebas Dinámicas</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Prueba</label>
        <input 
          type="text" 
          value={workOrder.pruebasDinamicas?.tipoPrueba || ''}
          onChange={(e) => handleInputChange('tipoPrueba', e.target.value)}
          onBlur={(e) => handleInputBlur('tipoPrueba', e.target.value)}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Resultados</label>
        <textarea 
          rows={6}
          value={workOrder.pruebasDinamicas?.resultados || ''}
          onChange={(e) => handleInputChange('resultados', e.target.value)}
          onBlur={(e) => handleInputBlur('resultados', e.target.value)}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
        ></textarea>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Fotos</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(workOrder.pruebasDinamicas?.fotos || []).map((fotoEntry, index) => (
            <img 
              key={index} 
              src={fotoEntry.url}
              alt={fotoEntry.descripcion || `Prueba ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg border border-gray-200"
            />
          ))}
        </div>
        <div className="mt-2">
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (loadEvent) => {
                    if (loadEvent.target && loadEvent.target.result) {
                      handleAddPhoto(loadEvent.target.result as string, file.name);
                    }
                  };
                  reader.readAsDataURL(file);
                }
              }
            }}
            className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>
      </div>
    </div>
  );
};

// Quality Tab
const QualityTab: React.FC<TabComponentProps> = ({ workOrder, setWorkOrder, addChangeLogEntry }) => {
  const currentAprobacionCalidad = workOrder.aprobacionCalidad || {
    aprobado: false,
    fecha: new Date().toISOString(),
    aprobadoPor: "CurrentUser"
  };
  
  // Local UI state for signature display, separate from workOrder data
  const [signatureDisplay, setSignatureDisplay] = useState<string | null>(workOrder.aprobacionCalidad?.firma || null);

  const handleValidationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isApproved = e.target.checked;
    const oldApprovalStatus = !!workOrder.aprobacionCalidad?.aprobado;

    setWorkOrder(prev => {
      const aprobacion = prev.aprobacionCalidad || { aprobado: false, fecha: new Date().toISOString(), aprobadoPor: "CurrentUser" };
      return {
        ...prev,
        aprobacionCalidad: {
          ...aprobacion,
          aprobado: isApproved,
          fecha: isApproved ? (aprobacion.fecha || new Date().toISOString()) : aprobacion.fecha, // Keep date or set new if approving
          aprobadoPor: isApproved ? (aprobacion.aprobadoPor || "CurrentUser") : aprobacion.aprobadoPor, // Keep user or set if approving
        }
      };
    });

    if (isApproved !== oldApprovalStatus) {
      addChangeLogEntry({
        changeType: "QUALITY_APPROVAL",
        description: `Aprobación de calidad ${isApproved ? 'marcada' : 'desmarcada'}.`,
        details: { tab: "aprobacionCalidad", approved: isApproved, oldStatus: oldApprovalStatus }
      });
    }
  };

  const handleSignatureCapture = () => {
    const signatureText = "Firma digital capturada"; // This would be actual signature data in a real app
    setSignatureDisplay(signatureText); // Update local UI state

    const oldFirma = workOrder.aprobacionCalidad?.firma;
    const responsable = workOrder.aprobacionCalidad?.aprobadoPor || "Técnico de Calidad por Firma"; // Or get current user

    setWorkOrder(prev => {
       const aprobacion = prev.aprobacionCalidad || { aprobado: false, fecha: new Date().toISOString(), aprobadoPor: "CurrentUser" };
      return {
        ...prev,
        aprobacionCalidad: {
          ...aprobacion,
          firma: signatureText,
          aprobadoPor: responsable, // Associate signature with current responsable
          fecha: aprobacion.fecha || new Date().toISOString(), // Ensure date is set
          aprobado: aprobacion.aprobado, // Preserve approval status
        }
      };
    });
     addChangeLogEntry({
        changeType: "QUALITY_APPROVAL",
        description: "Firma electrónica capturada para aprobación de calidad.",
        details: { tab: "aprobacionCalidad", action: "SIGNATURE_CAPTURED", responsable, oldFirma }
      });
  };
  
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Aprobación de Calidad</h3>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Validación</label>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="validadoCalidad" // Unique ID
              checked={!!workOrder.aprobacionCalidad?.aprobado}
              onChange={handleValidationChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="validadoCalidad" className="ml-2 block text-sm text-gray-700">
              Validar y dar inicio para envío al cliente
            </label>
          </div>
          
          {workOrder.aprobacionCalidad?.aprobado && (
            <div className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Responsable</label>
                  <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm bg-gray-50 p-2">
                    {workOrder.aprobacionCalidad.aprobadoPor}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fecha y Hora</label>
                  <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm bg-gray-50 p-2">
                    {new Date(workOrder.aprobacionCalidad.fecha).toLocaleString()}
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Firma Electrónica</label>
                {workOrder.aprobacionCalidad.firma || signatureDisplay ? (
                  <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                    <p className="text-sm text-gray-600">{workOrder.aprobacionCalidad.firma || signatureDisplay}</p>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <p className="text-sm text-gray-500 mb-4">Haga clic en el botón para capturar su firma electrónica</p>
                    <button 
                      type="button" 
                      onClick={handleSignatureCapture}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Capturar Firma
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Closure Tab
const ClosureTab: React.FC<TabComponentProps> = ({ workOrder, setWorkOrder, addChangeLogEntry }) => {
  const currentDespacho = workOrder.despacho || {};

  const handleInputChange = (field: 'guiaDespacho' | 'fechaDespacho' | 'despachadoPor' | 'comentarios', value: string) => {
    const oldValue = currentDespacho[field] || "";
    setWorkOrder(prev => ({
      ...prev,
      despacho: {
        ...currentDespacho,
        [field]: value
      }
    }));
    if (value !== oldValue) {
      addChangeLogEntry({
        changeType: "CLOSURE_UPDATE",
        description: `Campo de cierre/despacho '${field}' actualizado.`,
        details: { tab: "despacho", field, oldValue, newValue: value }
      });
    }
  };

  const handleAddAttachment = (files: FileList | null) => {
    if (!files) return;
    const newAttachments: FotoEntry[] = Array.from(files).map(file => ({
      url: URL.createObjectURL(file), // Using createObjectURL for preview
      descripcion: file.name,
      fecha: new Date().toISOString(),
      subidoPor: "CurrentUser" // Placeholder
    }));

    setWorkOrder(prev => ({
      ...prev,
      despacho: {
        ...currentDespacho,
        adjuntos: [...(currentDespacho.adjuntos || []), ...newAttachments]
      }
    }));

    newAttachments.forEach(att => {
      addChangeLogEntry({
        changeType: "CLOSURE_UPDATE",
        description: `Adjunto '${att.descripcion}' agregado a cierre/despacho.`,
        details: { tab: "despacho", action: "ADD_ATTACHMENT", fileName: att.descripcion }
      });
    });
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Cierre y Despacho</h3> {/* Title updated */}
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Información de Despacho</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Número de Guía</label>
            <input 
              type="text" 
              value={workOrder.despacho?.guiaDespacho || ''}
              onChange={(e) => handleInputChange('guiaDespacho', e.target.value)}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Envío</label>
            <input 
              type="date" 
              value={workOrder.despacho?.fechaDespacho || ''}
              onChange={(e) => handleInputChange('fechaDespacho', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Despachado Por</label>
            <input
              type="text"
              value={workOrder.despacho?.despachadoPor || ''}
              onChange={(e) => handleInputChange('despachadoPor', e.target.value)}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Comentarios de Despacho</label>
            <textarea
              rows={3}
              value={workOrder.despacho?.comentarios || ''}
              onChange={(e) => handleInputChange('comentarios', e.target.value)}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Adjuntos de Cierre</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(workOrder.despacho?.adjuntos || []).map((adjunto, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-2">
              {/* Basic preview for images, link for others */}
              {adjunto.url.startsWith('blob:') && (adjunto.descripcion?.match(/\.(jpeg|jpg|gif|png)$/) != null) ? (
                 <img
                  src={adjunto.url}
                  alt={adjunto.descripcion || `Adjunto ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border border-gray-200"
                />
              ) : (
                <div className="w-full h-32 flex items-center justify-center bg-gray-100 rounded-lg border border-gray-200">
                  <a href={adjunto.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 text-sm p-2">
                    Ver Archivo
                  </a>
                </div>
              )}
              <p className="mt-2 text-xs text-center truncate" title={adjunto.descripcion}>{adjunto.descripcion}</p>
            </div>
          ))}
        </div>
        <div className="mt-2">
          <input 
            type="file" 
            accept="*" 
            multiple
            onChange={(e) => handleAddAttachment(e.target.files)}
            className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>
      </div>
    </div>
  );
};

// ChangeLogDisplay Component (replaces old HistoryPanel)
const ChangeLogDisplay = ({ changeLog }: { changeLog: ChangeHistoryEntry[] }) => {
  if (!changeLog || changeLog.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6 mt-6">
        <h3 className="text-lg font-medium mb-4">Historial de Cambios</h3>
        <p className="text-sm text-gray-500">No hay historial de cambios disponible.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6 mt-6">
      <h3 className="text-lg font-medium mb-4">Historial de Cambios</h3>
      <div className="space-y-4">
        {changeLog.slice().reverse().map((entry) => { // Display latest first
          const changeTypeDisplayNames: Record<ChangeType, string> = {
            OT_CREATION: "Creación de OT",
            STATUS_UPDATE: "Actualización de Estado",
            HEADER_FIELD_UPDATE: "Actualización Campo de Cabecera",
            INSPECTION_UPDATE: "Actualización de Inspección",
            CLEANING_UPDATE: "Actualización de Limpieza",
            DISASSEMBLY_UPDATE: "Actualización de Desarme",
            PARTS_UPDATE: "Actualización de Piezas",
            BUDGET_ITEM_ADD: "Ítem de Presupuesto Agregado",
            BUDGET_ITEM_REMOVE: "Ítem de Presupuesto Eliminado",
            BUDGET_ITEM_UPDATE: "Ítem de Presupuesto Actualizado",
            BUDGET_APPROVAL: "Aprobación de Presupuesto",
            REPAIR_NOTES_UPDATE: "Actualización Notas de Reparación",
            ADDITIONAL_PART_ADD: "Pieza Adicional Agregada",
            ADDITIONAL_PART_REMOVE: "Pieza Adicional Eliminada",
            ADDITIONAL_PART_UPDATE: "Pieza Adicional Actualizada",
            TESTING_UPDATE: "Actualización de Pruebas",
            QUALITY_APPROVAL: "Aprobación de Calidad",
            CLOSURE_UPDATE: "Actualización de Cierre",
          };
          const displayChangeType = changeTypeDisplayNames[entry.changeType] || entry.changeType;

          return (
            <div key={entry.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-indigo-600">{displayChangeType}</span>
                <span className="text-xs text-gray-500">
                  {new Date(entry.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-700 mb-1">{entry.description}</p>
              <p className="text-sm text-gray-500">Usuario: {entry.user}</p>
            {entry.details && Object.keys(entry.details).length > 0 && (
              <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-3 rounded shadow-inner">
                <h5 className="text-xs font-semibold text-gray-700 mb-1">Detalles Adicionales:</h5>
                <ul className="list-disc list-inside pl-1 space-y-0.5">
                  {Object.entries(entry.details).map(([key, value]) => {
                    let displayValue = String(value);
                    if (typeof value === 'boolean') {
                      displayValue = value ? "Sí" : "No";
                    } else if (value === null || value === undefined || String(value).trim() === "") {
                      displayValue = "N/A";
                    }

                    // Simple key-to-label mapping (can be expanded)
                    const keyMappings: Record<string, string> = {
                      field: "Campo",
                      oldValue: "Valor Anterior",
                      newValue: "Valor Nuevo",
                      action: "Acción",
                      fileName: "Nombre de Archivo",
                      tab: "Pestaña",
                      numeroSerie: "Número de Serie",
                      partIndex: "Índice de Pieza",
                      removedPart: "Pieza Eliminada",
                      itemIndex: "Índice de Ítem",
                      notes: "Notas",
                      // Add more mappings as needed
                    };
                    const displayKey = keyMappings[key] || key.charAt(0).toUpperCase() + key.slice(1); // Capitalize if no mapping

                    return (
                      <li key={key} className="text-gray-500">
                        <span className="font-medium text-gray-600">{displayKey}:</span> {displayValue}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        )})}
      </div>
    </div>
  );
};

export default WorkOrderForm;