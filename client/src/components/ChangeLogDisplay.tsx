// client/src/components/ChangeLogDisplay.tsx
import React from 'react';
import { ChangeHistoryEntry, ChangeType } from '../data/dropdownData'; // Assuming types are exported from here

interface ChangeLogDisplayProps {
  changeLog: ChangeHistoryEntry[];
  maxHeight?: string; // Optional prop to control max height for scrolling in card
}

const ChangeLogDisplay: React.FC<ChangeLogDisplayProps> = ({ changeLog, maxHeight }) => {
  if (!changeLog || changeLog.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-4 mt-4"> {/* Adjusted padding/margin */}
        <h3 className="text-md font-semibold text-gray-700 mb-2">Historial de Cambios</h3> {/* Adjusted font size */}
        <p className="text-sm text-gray-500">No hay historial de cambios disponible.</p>
      </div>
    );
  }

  return (
    <div className={`bg-white shadow rounded-lg p-4 mt-4 ${maxHeight ? 'overflow-y-auto' : ''}`} style={{ maxHeight: maxHeight }}>
      <h3 className="text-md font-semibold text-gray-700 mb-3">Historial de Cambios</h3> {/* Adjusted font size */}
      <div className="space-y-3"> {/* Adjusted spacing */}
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
            // Add any new ChangeTypes here if they were part of other features
          };
          const displayChangeType = changeTypeDisplayNames[entry.changeType] || entry.changeType;

          return (
            <div key={entry.id} className="border border-gray-200 rounded-md p-3"> {/* Adjusted padding */}
              <div className="flex justify-between items-center mb-1"> {/* Adjusted margin */}
                <span className="text-xs font-semibold text-indigo-600">{displayChangeType}</span> {/* Adjusted font size */}
                <span className="text-xxs text-gray-500"> {/* Adjusted font size */}
                  {new Date(entry.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-gray-700 mb-0.5">{entry.description}</p> {/* Adjusted font size and margin */}
              <p className="text-xxs text-gray-500">Usuario: {entry.user}</p> {/* Adjusted font size */}
            {entry.details && Object.keys(entry.details).length > 0 && (
              <div className="mt-1.5 text-xxs text-gray-600 bg-gray-50 p-2 rounded shadow-inner"> {/* Adjusted spacing and padding */}
                <h5 className="text-xxs font-semibold text-gray-700 mb-0.5">Detalles Adicionales:</h5> {/* Adjusted font size */}
                <ul className="list-disc list-inside pl-1 space-y-0"> {/* Adjusted spacing */}
                  {Object.entries(entry.details).map(([key, value]) => {
                    let displayValue = String(value);
                    if (typeof value === 'boolean') {
                      displayValue = value ? "Sí" : "No";
                    } else if (value === null || value === undefined || String(value).trim() === "") {
                      displayValue = "N/A";
                    }

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
                      priority: "Prioridad", // Added for priority change logging
                    };
                    const displayKey = keyMappings[key] || key.charAt(0).toUpperCase() + key.slice(1);

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

export default ChangeLogDisplay;
