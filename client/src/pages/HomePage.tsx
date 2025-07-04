// src/pages/HomePage.tsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import {
  OrdenTrabajo, // Ensure OrdenTrabajo type is imported for state
  otStatusOptions,
  priorityOptions, // Import priority options
  motivoIngresoOptions,
  clienteOptions,
  vendedorOptions,
  modeloEquipoOptions,
  recibidoPorOptions,
  // mockOrdenesTrabajo, // Moved to examples.ts
  // mockOrdenesTrabajo, // Moved to examples.ts
  // OrdenTrabajo // Already imported above
} from '../data/dropdownData'; // Adjust the path as necessary
import { mockOrdenesTrabajo } from '../data/examples'; // Corrected import
import OTSummaryCard from '../components/OTSummaryCard'; // Import the summary card component

import ThemeToggler from '../components/ThemeToggler'; // Import ThemeToggler

// Define a type for the keys of OrdenTrabajo to be used for filtering and column selection
type OrdenTrabajoKeys = keyof OrdenTrabajo;

const HomePage: React.FC = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);
  const [summaryOt, setSummaryOt] = useState<OrdenTrabajo | null>(null); // State for summary card
  const [sortColumn, setSortColumn] = useState<OrdenTrabajoKeys | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // State for advanced filters
  const [filters, setFilters] = useState<Partial<Record<OrdenTrabajoKeys, string>>>({});

  // State for visible columns
  const defaultVisibleColumns: OrdenTrabajoKeys[] = ["id", "fechaCreacion", "cliente", "estado", "priority"]; // Added priority
  const allPossibleColumns: OrdenTrabajoKeys[] = [
    "id", "fechaCreacion", "fechaRecepcion", "motivoIngreso", "cliente",
    "vendedor", "numeroSerie", "modelo", "recibidoPor", "fechaVentaCliente", "estado", "priority" // Added priority
  ];
  const [visibleColumns, setVisibleColumns] = useState<OrdenTrabajoKeys[]>(defaultVisibleColumns);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleFilterChange = (field: OrdenTrabajoKeys, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleColumnToggle = (column: OrdenTrabajoKeys) => {
    setVisibleColumns(prev =>
      prev.includes(column) ? prev.filter(col => col !== column) : [...prev, column]
    );
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Creación": return "bg-blue-100 text-blue-800";
      case "Recepción de equipo": return "bg-yellow-100 text-yellow-800";
      case "Revisión inicial": return "bg-indigo-100 text-indigo-800";
      case "Presupuesto Enviado": return "bg-purple-100 text-purple-800";
      case "Aprobado": return "bg-green-200 text-green-900";
      case "En Reparación": return "bg-orange-100 text-orange-800";
      case "Reparado": return "bg-teal-100 text-teal-800";
      case "Enviado al Cliente": return "bg-cyan-100 text-cyan-800";
      case "Finalizada": return "bg-gray-300 text-gray-800";
      case "Rechazado": return "bg-red-200 text-red-900";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority?: string): string => {
    switch (priority) {
      case "Alta": return "bg-red-500 text-white";
      case "Media": return "bg-yellow-400 text-gray-800";
      case "Baja": return "bg-green-400 text-white";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredData = useMemo(() => {
    return mockOrdenesTrabajo.filter(ot => {
      // Search term filter (searches all fields, visible or hidden)
      const matchesSearchTerm = Object.entries(ot).some(([key, value]) => {
        // Asegurarse que solo se consideren strings, numbers o booleans para la búsqueda.
        const searchableKeys: (keyof OrdenTrabajo)[] = ["id", "fechaCreacion", "fechaRecepcion", "motivoIngreso", "cliente", "vendedor", "numeroSerie", "modelo", "recibidoPor", "fechaVentaCliente", "estado", "priority", "diagnosticoInicial", "notasReparacion"]; // Added priority
        if (searchableKeys.includes(key as keyof OrdenTrabajo)) {
          return String(value).toLowerCase().includes(searchTerm);
        }
        return false;
      });

      // Advanced filters
      const matchesFilters = Object.entries(filters).every(([key, filterValue]) => {
        if (!filterValue) return true; // Skip if filter is empty
        const otValue = ot[key as OrdenTrabajoKeys];
        return String(otValue).toLowerCase().includes(filterValue.toLowerCase());
      });

      let sortedData = [...(matchesSearchTerm && matchesFilters ? mockOrdenesTrabajo.filter(ot => {
        const searchMatch = Object.entries(ot).some(([key, value]) => {
          const searchableKeys: (keyof OrdenTrabajo)[] = ["id", "fechaCreacion", "fechaRecepcion", "motivoIngreso", "cliente", "vendedor", "numeroSerie", "modelo", "recibidoPor", "fechaVentaCliente", "estado", "priority", "diagnosticoInicial", "notasReparacion"];
          if (searchableKeys.includes(key as keyof OrdenTrabajo)) {
            return String(value).toLowerCase().includes(searchTerm);
          }
          return false;
        });
        const filterMatch = Object.entries(filters).every(([key, filterValue]) => {
          if (!filterValue) return true;
          const otValue = ot[key as OrdenTrabajoKeys];
          return String(otValue).toLowerCase().includes(filterValue.toLowerCase());
        });
        return searchMatch && filterMatch;
      }) : [])];


      if (sortColumn) {
        sortedData.sort((a, b) => {
          const valA = a[sortColumn];
          const valB = b[sortColumn];

          // Basic null/undefined handling: place them at the end for asc, start for desc
          if (valA == null && valB == null) return 0;
          if (valA == null) return sortDirection === 'asc' ? 1 : -1;
          if (valB == null) return sortDirection === 'asc' ? -1 : 1;

          if (typeof valA === 'number' && typeof valB === 'number') {
            return sortDirection === 'asc' ? valA - valB : valB - valA;
          }
          // Default to string comparison
          const strValA = String(valA).toLowerCase();
          const strValB = String(valB).toLowerCase();

          if (strValA < strValB) return sortDirection === 'asc' ? -1 : 1;
          if (strValA > strValB) return sortDirection === 'asc' ? 1 : -1;
          return 0;
        });
      }

      return sortedData;
    });
  }, [searchTerm, filters, sortColumn, sortDirection, mockOrdenesTrabajo]); // Added mockOrdenesTrabajo as it's used directly now

  const handleOtClick = (ot: OrdenTrabajo) => {
    navigate(`/ot/${ot.id}`); // Navigate to OT detail page
  };

  const handleSort = (column: OrdenTrabajoKeys) => {
    if (sortColumn === column) {
      setSortDirection(prevDir => prevDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const renderSortArrow = (column: OrdenTrabajoKeys) => {
    if (sortColumn !== column) return null;
    return sortDirection === 'asc' ? ' ▲' : ' ▼';
  };

  const renderFilterDropdown = (field: OrdenTrabajoKeys, options: string[], label: string) => (
    <div className="mr-2 mb-2">
      <label htmlFor={`filter-${field}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}:</label>
      <select
        id={`filter-${field}`}
        name={`filter-${field}`}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        value={filters[field] || ''}
        onChange={(e) => handleFilterChange(field, e.target.value)}
      >
        <option value="" className="dark:bg-gray-700">Todos</option>
        {options.map(opt => <option key={opt} value={opt} className="dark:bg-gray-700">{opt}</option>)}
      </select>
    </div>
  );


  return (
    <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <header className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Dashboard de Órdenes de Trabajo (OTs)</h1>
        <div className="flex items-center space-x-4">
          <ThemeToggler />
          <button
            onClick={() => navigate('/ot/new')} // Asumiendo que '/ot/new' será la ruta para crear una nueva OT
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-150"
          >
            Crear Nueva OT
          </button>
        </div>
      </header>

      {/* Barra de búsqueda */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar en todas las OTs (por campos principales)..."
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* Botón para Filtros Avanzados y Configuración de Columnas */}
      <div className="mb-4 flex flex-wrap justify-between items-center">
        <button
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150 text-sm"
        >
          {showAdvancedFilters ? 'Ocultar' : 'Mostrar'} Filtros Avanzados / Columnas
        </button>
      </div>

      {/* Filtros Avanzados y Configuración de Columnas (condicional) */}
      {showAdvancedFilters && (
        <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg mb-6 shadow">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3">Filtros Avanzados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
            {/* Assuming renderFilterDropdown will also get dark mode styles for select elements if needed, or we update it */}
            {renderFilterDropdown('id', [...new Set(mockOrdenesTrabajo.map(ot => ot.id))], 'OT-Number')}
            {renderFilterDropdown('fechaCreacion', [...new Set(mockOrdenesTrabajo.map(ot => ot.fechaCreacion))], 'Fecha Creación')}
            {renderFilterDropdown('fechaRecepcion', [...new Set(mockOrdenesTrabajo.map(ot => ot.fechaRecepcion).filter(Boolean) as string[])], 'Fecha Recepción')}
            {renderFilterDropdown('motivoIngreso', motivoIngresoOptions, 'Motivo Ingreso')}
            {renderFilterDropdown('cliente', clienteOptions, 'Cliente')}
            {renderFilterDropdown('vendedor', vendedorOptions, 'Vendedor')}
            {renderFilterDropdown('numeroSerie', [...new Set(mockOrdenesTrabajo.map(ot => ot.numeroSerie).filter(Boolean) as string[])], 'Nº Serie')}
            {renderFilterDropdown('modelo', modeloEquipoOptions, 'Modelo')}
            {renderFilterDropdown('recibidoPor', recibidoPorOptions, 'Recibido Por')}
            {renderFilterDropdown('estado', otStatusOptions, 'Estado')}
            {renderFilterDropdown('priority', priorityOptions, 'Prioridad')}
          </div>
          <hr className="my-4 dark:border-gray-600"/>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3">Configurar Columnas Visibles</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {allPossibleColumns.map(colKey => (
              <label key={colKey} className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-indigo-600 rounded border-gray-300 dark:border-gray-600 focus:ring-indigo-500 bg-gray-100 dark:bg-gray-700"
                  checked={visibleColumns.includes(colKey)}
                  onChange={() => handleColumnToggle(colKey)}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{colKey.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Tabla de Órdenes de Trabajo */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              {visibleColumns.map(colKey => (
                <th
                  key={colKey}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider capitalize cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                  onClick={() => handleSort(colKey)}
                >
                  {colKey.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  {renderSortArrow(colKey)}
                </th>
              ))}
               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Acciones
                </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredData.length > 0 ? filteredData.map((ot) => (
              <tr key={ot.id} onClick={() => handleOtClick(ot)} className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition duration-150">
                {visibleColumns.map(colKey => (
                  <td key={`${ot.id}-${colKey}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {colKey === 'estado' ? (
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(ot[colKey] as string)}`}>
                        {ot[colKey]}
                      </span>
                    ) : colKey === 'priority' ? (
                      // Priority colors might need adjustment for dark mode if they don't contrast well.
                      // For now, using the existing getPriorityColor which returns specific bg and text colors.
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(ot[colKey] as string)}`}>
                        {ot[colKey] || 'N/A'}
                      </span>
                    ) : (
                      String(ot[colKey as keyof OrdenTrabajo] || 'N/A')
                    )}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setSummaryOt(ot);
                    }}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-2 text-xs"
                  >
                    Ver
                  </button>
                  <button
                    onClick={(e) => {
                        e.stopPropagation();
                        alert("El usuario no tiene permitido eliminar.");
                    }}
                    className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 text-xs"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={visibleColumns.length + 1} className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                  No se encontraron órdenes de trabajo que coincidan con los criterios.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <footer className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>© {new Date().getFullYear()} Sistema de Gestión de OTs. Todos los derechos reservados.</p>
      </footer>

      {summaryOt && (
        <OTSummaryCard ot={summaryOt} onClose={() => setSummaryOt(null)} />
      )}
    </div>
  );
};

export default HomePage;
