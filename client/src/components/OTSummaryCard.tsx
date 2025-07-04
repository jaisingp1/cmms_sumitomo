// client/src/components/OTSummaryCard.tsx
import React from 'react';
import { OrdenTrabajo } from '../data/dropdownData';
import ProcessTracker from './ProcessTracker';
import ChangeLogDisplay from './ChangeLogDisplay';

interface OTSummaryCardProps {
  ot: OrdenTrabajo;
  onClose: () => void;
}

const OTSummaryCard: React.FC<OTSummaryCardProps> = ({ ot, onClose }) => {
  if (!ot) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 dark:bg-opacity-75 overflow-y-auto h-full w-full z-50 flex justify-center items-center p-4">
      <div className="relative bg-white dark:bg-gray-800 w-full max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto rounded-lg shadow-xl p-6">
        {/* Card Header */}
        <div className="flex justify-between items-center border-b dark:border-gray-700 pb-3 mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Resumen OT: {ot.id}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition duration-150"
            aria-label="Cerrar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Card Content */}
        <div className="space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto pr-2 text-gray-700 dark:text-gray-300"> {/* Scrollable content area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
            <div><strong className="dark:text-gray-200">Cliente:</strong> {ot.cliente || 'N/A'}</div>
            <div><strong className="dark:text-gray-200">Nº Serie:</strong> {ot.numeroSerie || 'N/A'}</div>
            <div><strong className="dark:text-gray-200">Modelo:</strong> {ot.modelo || 'N/A'}</div>
            <div><strong className="dark:text-gray-200">Estado Actual:</strong> <span className="font-semibold dark:text-gray-100">{ot.estado || 'N/A'}</span></div>
          </div>

          {/* Process Tracker */}
          {/* ProcessTracker itself is now dark-mode aware */}
          <ProcessTracker currentStatus={ot.estado} workOrder={ot} />

          {/* Change Log Display - with max height for scrolling within card */}
          {/* ChangeLogDisplay itself is now dark-mode aware */}
          <ChangeLogDisplay changeLog={ot.changeLog || []} maxHeight="300px" />
        </div>

        {/* Card Footer (optional, if needed for actions within the card) */}
        <div className="border-t dark:border-gray-700 pt-4 mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition duration-150"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTSummaryCard;
