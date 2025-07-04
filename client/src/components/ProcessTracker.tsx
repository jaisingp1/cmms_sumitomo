// client/src/components/ProcessTracker.tsx
import React from 'react';
import { otStatusOptions } from '../data/dropdownData'; // All possible statuses

interface ProcessTrackerProps {
  currentStatus: string;
  // Potentially add 'responsibleUser' if we enhance this later
}

const ProcessTracker: React.FC<ProcessTrackerProps> = ({ currentStatus }) => {
  const currentIndex = otStatusOptions.indexOf(currentStatus);

  // Function to determine the responsible person - placeholder for now
  // This would need more sophisticated logic or data from the workOrder object
  const getResponsibleForStatus = (status: string): string | null => {
    // Example: If currentStatus is 'Equipo Desarmado', and we have a field like workOrder.desarme.realizadoPor
    // This is a simplified placeholder. In a real scenario, you'd pass the workOrder
    // and extract the relevant 'realizadoPor' or 'user' field based on the status.
    if (status === currentStatus) {
      return "Usuario Actual"; // Placeholder - replace with actual logic
    }
    return null;
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Estado del Proceso</h3>
      <div className="flex items-center overflow-x-auto py-2">
        {otStatusOptions.map((status, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;
          const responsible = getResponsibleForStatus(status);

          return (
            <React.Fragment key={status}>
              <div className="flex flex-col items-center min-w-[120px] md:min-w-[150px] px-2">
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-white mb-1
                    ${isActive ? 'bg-indigo-600 ring-4 ring-indigo-300' : ''}
                    ${isCompleted ? 'bg-green-500' : ''}
                    ${!isActive && !isCompleted ? 'bg-gray-300' : ''}
                  `}
                >
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className="text-xs font-semibold">{index + 1}</span>
                  )}
                </div>
                <div className={`text-xs text-center ${isActive ? 'font-bold text-indigo-700' : 'text-gray-600'}`}>
                  {status}
                </div>
                {isActive && responsible && (
                  <div className="text-xxs text-center text-indigo-500 mt-0.5">
                    ({responsible})
                  </div>
                )}
              </div>
              {index < otStatusOptions.length - 1 && (
                <div
                  className={`
                    flex-auto border-t-2 h-0.5
                    ${isCompleted || isActive ? 'border-indigo-500' : 'border-gray-300'}
                  `}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ProcessTracker;
