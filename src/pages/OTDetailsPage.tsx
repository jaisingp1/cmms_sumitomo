import React, { useState, useEffect } from 'react';
import { 
  otStatusOptions, 
  clienteOptions, 
  vendedorOptions, 
  modeloEquipoOptions, 
  recibidoPorOptions,
  mockOrdenesTrabajo
} from './data/dropdownData';

const WorkOrderForm = () => {
  // State for the current work order
  const [workOrder, setWorkOrder] = useState(mockOrdenesTrabajo[0]);
  // State for active tab
  const [activeTab, setActiveTab] = useState('inspeccion');
  // State for serial number input
  const [serialNumber, setSerialNumber] = useState(workOrder.numeroSerie || '');
  
  // Effect to update work order when serial number changes
  useEffect(() => {
    if (serialNumber) {
      setWorkOrder(prev => ({
        ...prev,
        numeroSerie: serialNumber,
      }));
    }
  }, [serialNumber]);
  
  // Function to handle changes in the header form
  const handleHeaderChange = (field, value) => {
    setWorkOrder(prev => ({ ...prev, [field]: value }));
  };
  
  // Function to handle changes in the history
  const handleHistoryChange = (newHistory) => {
    setWorkOrder(prev => ({ ...prev, historial: newHistory }));
  };
  
  return (
    <div className="container mx-auto p-6">
      {/* Header with equipment info, client info, and status */}
      <Header 
        workOrder={workOrder} 
        serialNumber={serialNumber}
        setSerialNumber={setSerialNumber}
        onHeaderChange={handleHeaderChange}
      />
      
      {/* Tabs for different sections */}
      <Tabs 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        workOrder={workOrder}
        setWorkOrder={setWorkOrder}
      />
      
      {/* History panel */}
      <HistoryPanel 
        history={workOrder.historial || []} 
        onHistoryChange={handleHistoryChange}
      />
    </div>
  );
};

// Header component
const Header = ({ workOrder, serialNumber, setSerialNumber, onHeaderChange }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Información de la Orden de Trabajo</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Número de Serie</label>
          <input 
            type="text" 
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Tipo de Producto</label>
          <select 
            value={workOrder.tipoProducto || ''}
            onChange={(e) => onHeaderChange('tipoProducto', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
              value={workOrder.tipoGB || ''}
              onChange={(e) => onHeaderChange('tipoGB', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
              value={workOrder.tipoGM || ''}
              onChange={(e) => onHeaderChange('tipoGM', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Seleccione...</option>
            <option value="simple">Reducción Simple</option>
            <option value="doble">Doble Reducción</option>
            <option value="triple">Triple Reducción</option>
            <option value="cuadruple">Cuadruple Reducción</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha Posible de Recepción</label>
          <input 
            type="date" 
            value={workOrder.fechaRecepcion || ''}
            onChange={(e) => onHeaderChange('fechaRecepcion', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Cliente</label>
          <select 
            value={workOrder.cliente || ''}
            onChange={(e) => onHeaderChange('cliente', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            {modeloEquipoOptions.map(modelo => (
              <option key={modelo} value={modelo}>{modelo}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Recibido Por</label>
          <select 
            value={workOrder.recibidoPor || ''}
            onChange={(e) => onHeaderChange('recibidoPor', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            {recibidoPorOptions.map(recibido => (
              <option key={recibido} value={recibido}>{recibido}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha de Venta al Cliente</label>
          <input 
            type="date" 
            value={workOrder.fechaVentaCliente || ''}
            onChange={(e) => onHeaderChange('fechaVentaCliente', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Estado</label>
          <select 
            value={workOrder.estado}
            onChange={(e) => onHeaderChange('estado', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
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
const Tabs = ({ activeTab, setActiveTab, workOrder, setWorkOrder }) => {
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
        {activeTab === 'inspeccion' && <InspectionTab workOrder={workOrder} setWorkOrder={setWorkOrder} />}
        {activeTab === 'limpieza' && <CleaningTab workOrder={workOrder} setWorkOrder={setWorkOrder} />}
        {activeTab === 'desarme' && <DisassemblyTab workOrder={workOrder} setWorkOrder={setWorkOrder} />}
        {activeTab === 'piezas' && <PartsTab workOrder={workOrder} setWorkOrder={setWorkOrder} />}
        {activeTab === 'presupuesto' && <BudgetTab workOrder={workOrder} setWorkOrder={setWorkOrder} />}
        {activeTab === 'reparacion' && <RepairTab workOrder={workOrder} setWorkOrder={setWorkOrder} />}
        {activeTab === 'pruebas' && <TestingTab workOrder={workOrder} setWorkOrder={setWorkOrder} />}
        {activeTab === 'calidad' && <QualityTab workOrder={workOrder} setWorkOrder={setWorkOrder} />}
        {activeTab === 'cierre' && <ClosureTab workOrder={workOrder} setWorkOrder={setWorkOrder} />}
      </div>
    </div>
  );
};

// Helper function to determine if a tab is enabled based on the current state
const isTabEnabled = (tabName, currentStatus) => {
  // This would need to be customized based on your specific business rules
  // For now, just enabling all tabs for simplicity
  return true;
};

// Inspection Tab
const InspectionTab = ({ workOrder, setWorkOrder }) => {
  const handleAddPhoto = (photo) => {
    setWorkOrder(prev => ({
      ...prev,
      fotos: [...(prev.fotos || []), photo]
    }));
  };
  
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Inspección Visual</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Comentarios</label>
        <textarea 
          rows="4"
          value={workOrder.diagnosticoInicial || ''}
          onChange={(e) => setWorkOrder(prev => ({ ...prev, diagnosticoInicial: e.target.value }))}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
        ></textarea>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Fotos</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(workOrder.fotos || []).map((foto, index) => (
            <img 
              key={index} 
              src={foto} 
              alt={`Inspección ${index + 1}`} 
              className="w-full h-32 object-cover rounded-lg border border-gray-200"
            />
          ))}
        </div>
        <div className="mt-2">
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                  handleAddPhoto(e.target.result);
                };
                reader.readAsDataURL(file);
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
const CleaningTab = ({ workOrder, setWorkOrder }) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Limpieza de Equipo</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Lavado</label>
          <select 
            value={workOrder.limpieza?.tipoLavado || ''}
            onChange={(e) => setWorkOrder(prev => ({
              ...prev,
              limpieza: {
                ...prev.limpieza,
                tipoLavado: e.target.value
              }
            }))}
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
            value={workOrder.limpieza?.fechaRealizacion || ''}
            onChange={(e) => setWorkOrder(prev => ({
              ...prev,
              limpieza: {
                ...prev.limpieza,
                fechaRealizacion: e.target.value
              }
            }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Realizado por</label>
          <select 
            value={workOrder.limpieza?.realizadoPor || ''}
            onChange={(e) => setWorkOrder(prev => ({
              ...prev,
              limpieza: {
                ...prev.limpieza,
                realizadoPor: e.target.value
              }
            }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Seleccione...</option>
            <option value="interno">Interno</option>
            <option value="proveedor">Proveedor</option>
          </select>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Notas</label>
        <textarea 
          rows="4"
          value={workOrder.limpieza?.notas || ''}
          onChange={(e) => setWorkOrder(prev => ({
            ...prev,
            limpieza: {
              ...prev.limpieza,
              notas: e.target.value
            }
          }))}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
        ></textarea>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Fotos</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(workOrder.limpieza?.fotos || []).map((foto, index) => (
            <img 
              key={index} 
              src={foto} 
              alt={`Limpieza ${index + 1}`} 
              className="w-full h-32 object-cover rounded-lg border border-gray-200"
            />
          ))}
        </div>
        <div className="mt-2">
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                  setWorkOrder(prev => ({
                    ...prev,
                    limpieza: {
                      ...prev.limpieza,
                      fotos: [...(prev.limpieza?.fotos || []), e.target.result]
                    }
                  }));
                };
                reader.readAsDataURL(file);
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
const DisassemblyTab = ({ workOrder, setWorkOrder }) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Desarme</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Acción a Realizar</label>
        <textarea 
          rows="4"
          value={workOrder.desarme?.accion || ''}
          onChange={(e) => setWorkOrder(prev => ({
            ...prev,
            desarme: {
              ...prev.desarme,
              accion: e.target.value
            }
          }))}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
        ></textarea>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Fotos</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(workOrder.desarme?.fotos || []).map((foto, index) => (
            <img 
              key={index} 
              src={foto} 
              alt={`Desarme ${index + 1}`} 
              className="w-full h-32 object-cover rounded-lg border border-gray-200"
            />
          ))}
        </div>
        <div className="mt-2">
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                  setWorkOrder(prev => ({
                    ...prev,
                    desarme: {
                      ...prev.desarme,
                      fotos: [...(prev.desarme?.fotos || []), e.target.result]
                    }
                  }));
                };
                reader.readAsDataURL(file);
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
const PartsTab = ({ workOrder, setWorkOrder }) => {
  const addPart = () => {
    setWorkOrder(prev => ({
      ...prev,
      piezas: [
        ...(prev.piezas || []),
        { foto: '', mediciones: '', ensayos: '', recomendacion: '' }
      ]
    }));
  };
  
  const updatePart = (index, field, value) => {
    const updatedParts = [...workOrder.piezas];
    updatedParts[index][field] = value;
    setWorkOrder(prev => ({ ...prev, piezas: updatedParts }));
  };
  
  const removePart = (index) => {
    const updatedParts = workOrder.piezas.filter((_, i) => i !== index);
    setWorkOrder(prev => ({ ...prev, piezas: updatedParts }));
  };
  
  const uploadPartPhoto = (index, file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      updatePart(index, 'foto', e.target.result);
    };
    reader.readAsDataURL(file);
  };
  
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Piezas</h3>
      
      <div className="space-y-6">
        {(workOrder.piezas || []).map((part, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-md font-medium">Pieza {index + 1}</h4>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Foto</label>
                {part.foto ? (
                  <img 
                    src={part.foto} 
                    alt={`Pieza ${index + 1}`} 
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
                  onChange={(e) => uploadPartPhoto(index, e.target.files[0])}
                  className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 mt-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mediciones Tomadas</label>
                <textarea 
                  rows="3"
                  value={part.mediciones}
                  onChange={(e) => updatePart(index, 'mediciones', e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ensayos No Destructivos Realizados</label>
                <textarea 
                  rows="3"
                  value={part.ensayos}
                  onChange={(e) => updatePart(index, 'ensayos', e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recomendación</label>
                <select 
                  value={part.recomendacion}
                  onChange={(e) => updatePart(index, 'recomendacion', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Seleccione...</option>
                  <option value="reemplazar">Reemplazar</option>
                  <option value="reparar">Reparar</option>
                  <option value="reutilizar">Reutilizar</option>
                </select>
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
const BudgetTab = ({ workOrder, setWorkOrder }) => {
  const addItem = () => {
    setWorkOrder(prev => ({
      ...prev,
      presupuesto: {
        ...prev.presupuesto,
        items: [
          ...(prev.presupuesto?.items || []),
          { descripcion: '', cantidad: 1, precioUnitario: 0, total: 0 }
        ]
      }
    }));
  };
  
  const updateItem = (index, field, value) => {
    const updatedItems = [...workOrder.presupuesto.items];
    updatedItems[index][field] = value;
    
    // Update total if quantity or price changes
    if (field === 'cantidad' || field === 'precioUnitario') {
      updatedItems[index].total = updatedItems[index].cantidad * updatedItems[index].precioUnitario;
    }
    
    setWorkOrder(prev => ({
      ...prev,
      presupuesto: {
        ...prev.presupuesto,
        items: updatedItems
      }
    }));
  };
  
  const removeItem = (index) => {
    const updatedItems = workOrder.presupuesto.items.filter((_, i) => i !== index);
    setWorkOrder(prev => ({
      ...prev,
      presupuesto: {
        ...prev.presupuesto,
        items: updatedItems
      }
    }));
  };
  
  // Calculate totals
  const subtotal = workOrder.presupuesto?.items?.reduce((sum, item) => sum + item.total, 0) || 0;
  const impuestos = subtotal * 0.19; // Assuming 19% tax
  const totalGeneral = subtotal + impuestos;
  
  // Update totals in state
  useEffect(() => {
    setWorkOrder(prev => ({
      ...prev,
      presupuesto: {
        ...prev.presupuesto,
        subtotal,
        impuestos,
        totalGeneral
      }
    }));
  }, [subtotal, impuestos, totalGeneral]);
  
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Presupuesto</h3>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio Unitario</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
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
                    onChange={(e) => updateItem(index, 'cantidad', parseInt(e.target.value))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input 
                    type="number" 
                    min="0"
                    value={item.precioUnitario}
                    onChange={(e) => updateItem(index, 'precioUnitario', parseFloat(e.target.value))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ${(item.total || 0).toFixed(2)}
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
              ${(workOrder.presupuesto?.subtotal || 0).toFixed(2)}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Impuestos (19%)</label>
            <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-50 p-2">
              ${(workOrder.presupuesto?.impuestos || 0).toFixed(2)}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total General</label>
            <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-50 p-2 font-bold">
              ${(workOrder.presupuesto?.totalGeneral || 0).toFixed(2)}
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Aprobación</label>
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="aprobado"
              checked={!!workOrder.presupuesto?.aprobado}
              onChange={(e) => setWorkOrder(prev => ({
                ...prev,
                presupuesto: {
                  ...prev.presupuesto,
                  aprobado: e.target.checked,
                  fechaAprobacion: e.target.checked ? new Date().toISOString().split('T')[0] : undefined
                }
              }))}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="aprobado" className="ml-2 block text-sm text-gray-700">
              Presupuesto aprobado
            </label>
          </div>
          
          {workOrder.presupuesto?.aprobado && (
            <div className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Responsable</label>
                  <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-50 p-2">
                    {workOrder.presupuesto.responsable || "Técnico de Calidad"}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fecha de Aprobación</label>
                  <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-50 p-2">
                    {workOrder.presupuesto.fechaAprobacion || new Date().toISOString().split('T')[0]}
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
const RepairTab = ({ workOrder, setWorkOrder }) => {
  const addAdditionalPart = () => {
    setWorkOrder(prev => ({
      ...prev,
      repuestosAdicionales: [
        ...(prev.repuestosAdicionales || []),
        { repuesto: '', cantidad: 1, costo: 0 }
      ]
    }));
  };
  
  const updateAdditionalPart = (index, field, value) => {
    const updatedParts = [...workOrder.repuestosAdicionales];
    updatedParts[index][field] = value;
    setWorkOrder(prev => ({ ...prev, repuestosAdicionales: updatedParts }));
  };
  
  const removeAdditionalPart = (index) => {
    const updatedParts = workOrder.repuestosAdicionales.filter((_, i) => i !== index);
    setWorkOrder(prev => ({ ...prev, repuestosAdicionales: updatedParts }));
  };
  
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Reparación</h3>
      
      <div className="mb-6">
        <h4 className="text-md font-medium mb-2">Piezas Adicionales</h4>
        <p className="text-sm text-gray-500 mb-4">Estas piezas no se cobrarán al cliente.</p>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Repuesto</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Costo</th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(workOrder.repuestosAdicionales || []).map((part, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input 
                      type="text" 
                      value={part.repuesto}
                      onChange={(e) => updateAdditionalPart(index, 'repuesto', e.target.value)}
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
                      type="number" 
                      min="0"
                      value={part.costo}
                      onChange={(e) => updateAdditionalPart(index, 'costo', parseFloat(e.target.value))}
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
        <label className="block text-sm font-medium text-gray-700 mb-2">Notas de Reparación</label>
        <textarea 
          rows="6"
          value={workOrder.notasReparacion || ''}
          onChange={(e) => setWorkOrder(prev => ({ ...prev, notasReparacion: e.target.value }))}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
        ></textarea>
      </div>
    </div>
  );
};

// Testing Tab
const TestingTab = ({ workOrder, setWorkOrder }) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Pruebas Dinámicas</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Prueba</label>
        <input 
          type="text" 
          value={workOrder.pruebas?.tipoPrueba || ''}
          onChange={(e) => setWorkOrder(prev => ({
            ...prev,
            pruebas: {
              ...prev.pruebas,
              tipoPrueba: e.target.value
            }
          }))}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Resultados</label>
        <textarea 
          rows="6"
          value={workOrder.pruebas?.resultados || ''}
          onChange={(e) => setWorkOrder(prev => ({
            ...prev,
            pruebas: {
              ...prev.pruebas,
              resultados: e.target.value
            }
          }))}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
        ></textarea>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Fotos</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(workOrder.pruebas?.fotos || []).map((foto, index) => (
            <img 
              key={index} 
              src={foto} 
              alt={`Prueba ${index + 1}`} 
              className="w-full h-32 object-cover rounded-lg border border-gray-200"
            />
          ))}
        </div>
        <div className="mt-2">
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                  setWorkOrder(prev => ({
                    ...prev,
                    pruebas: {
                      ...prev.pruebas,
                      fotos: [...(prev.pruebas?.fotos || []), e.target.result]
                    }
                  }));
                };
                reader.readAsDataURL(file);
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
const QualityTab = ({ workOrder, setWorkOrder }) => {
  const [signature, setSignature] = useState(null);
  
  const handleSignatureChange = (e) => {
    setSignature("Firma digital capturada");
    setWorkOrder(prev => ({
      ...prev,
      calidad: {
        ...prev.calidad,
        firma: "Firma digital capturada",
        responsable: "Técnico de Calidad",
        fechaValidacion: new Date().toISOString()
      }
    }));
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
              id="validado"
              checked={!!workOrder.calidad?.validado}
              onChange={(e) => setWorkOrder(prev => ({
                ...prev,
                calidad: {
                  ...prev.calidad,
                  validado: e.target.checked,
                  responsable: e.target.checked ? "Técnico de Calidad" : undefined,
                  fechaValidacion: e.target.checked ? new Date().toISOString() : undefined
                }
              }))}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="validado" className="ml-2 block text-sm text-gray-700">
              Validar y dar inicio para envío al cliente
            </label>
          </div>
          
          {workOrder.calidad?.validado && (
            <div className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Responsable</label>
                  <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-50 p-2">
                    {workOrder.calidad.responsable}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fecha y Hora</label>
                  <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-50 p-2">
                    {new Date(workOrder.calidad.fechaValidacion).toLocaleString()}
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Firma Electrónica</label>
                {signature ? (
                  <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                    <p className="text-sm text-gray-600">{signature}</p>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <p className="text-sm text-gray-500 mb-4">Haga clic en el botón para capturar su firma electrónica</p>
                    <button 
                      type="button" 
                      onClick={handleSignatureChange}
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
const ClosureTab = ({ workOrder, setWorkOrder }) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Cierre</h3>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Guía de Despacho</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Número de Guía</label>
            <input 
              type="text" 
              value={workOrder.cierre?.guia || ''}
              onChange={(e) => setWorkOrder(prev => ({
                ...prev,
                cierre: {
                  ...prev.cierre,
                  guia: e.target.value
                }
              }))}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Envío</label>
            <input 
              type="date" 
              value={workOrder.cierre?.fechaEnvio || ''}
              onChange={(e) => setWorkOrder(prev => ({
                ...prev,
                cierre: {
                  ...prev.cierre,
                  fechaEnvio: e.target.value
                }
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Adjuntos</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(workOrder.cierre?.adjuntos || []).map((adjunto, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-2">
              <img 
                src={adjunto.preview} 
                alt={`Adjunto ${index + 1}`} 
                className="w-full h-32 object-cover rounded-lg border border-gray-200"
              />
              <p className="mt-2 text-xs text-center truncate">{adjunto.nombre}</p>
            </div>
          ))}
        </div>
        <div className="mt-2">
          <input 
            type="file" 
            accept="*" 
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files);
              const newAttachments = files.map(file => ({
                nombre: file.name,
                preview: URL.createObjectURL(file)
              }));
              
              setWorkOrder(prev => ({
                ...prev,
                cierre: {
                  ...prev.cierre,
                  adjuntos: [...(prev.cierre?.adjuntos || []), ...newAttachments]
                }
              }));
            }}
            className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>
      </div>
    </div>
  );
};

// History Panel
const HistoryPanel = ({ history, onHistoryChange }) => {
  const addHistoryItem = () => {
    const newHistoryItem = {
      fecha: new Date().toISOString().split('T')[0],
      evento: '',
      responsable: '',
      notas: ''
    };
    
    onHistoryChange([...history, newHistoryItem]);
  };
  
  const updateHistoryItem = (index, field, value) => {
    const updatedHistory = [...history];
    updatedHistory[index][field] = value;
    onHistoryChange(updatedHistory);
  };
  
  const removeHistoryItem = (index) => {
    const updatedHistory = history.filter((_, i) => i !== index);
    onHistoryChange(updatedHistory);
  };
  
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium mb-4">Historial</h3>
      
      <div className="space-y-4">
        {history.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-md font-medium">Evento {index + 1}</h4>
              <button 
                type="button" 
                onClick={() => removeHistoryItem(index)}
                className="text-red-600 hover:text-red-800"
              >
                Eliminar
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                <input 
                  type="date" 
                  value={item.fecha}
                  onChange={(e) => updateHistoryItem(index, 'fecha', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Evento</label>
                <input 
                  type="text" 
                  value={item.evento}
                  onChange={(e) => updateHistoryItem(index, 'evento', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
                <input 
                  type="text" 
                  value={item.responsable}
                  onChange={(e) => updateHistoryItem(index, 'responsable', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
              <textarea 
                rows="2"
                value={item.notas || ''}
                onChange={(e) => updateHistoryItem(index, 'notas', e.target.value)}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              ></textarea>
            </div>
          </div>
        ))}
      </div>
      
      <button 
        type="button" 
        onClick={addHistoryItem}
        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Agregar Evento
      </button>
    </div>
  );
};

export default WorkOrderForm;