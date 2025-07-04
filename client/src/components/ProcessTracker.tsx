// client/src/components/ProcessTracker.tsx
import React from 'react';
import { otStatusOptions } from '../data/dropdownData'; // All possible statuses

interface ProcessTrackerProps {
  currentStatus: string;
  workOrder?: any; // Optional: Pass the full workOrder if more details are needed for responsibility
}

const ProcessTracker: React.FC<ProcessTrackerProps> = ({ currentStatus, workOrder }) => {
  const currentIndex = otStatusOptions.indexOf(currentStatus);

  // Function to determine the responsible person - placeholder for now
  const getResponsibleForStatus = (status: string): string | null => {
    if (status === currentStatus) {
      // Example logic: Try to find who performed the current status update
      // This is highly dependent on your data structure (e.g., workOrder.changeLog or specific fields)
      if (workOrder && workOrder.changeLog && workOrder.changeLog.length > 0) {
        // Find the most recent log entry that matches setting this status, or just the latest user for this OT.
        // This is a simplified example.
        const lastUser = workOrder.changeLog[workOrder.changeLog.length -1]?.user;
        if(lastUser && lastUser !== "Sistema") return lastUser;
      }
      // Fallback or if specific user per stage is in the main workOrder object fields
      if (workOrder && workOrder[status.toLowerCase() + 'RealizadoPor']) { // e.g. inspeccionVisualRealizadoPor
          return workOrder[status.toLowerCase() + 'RealizadoPor'];
      }
      return workOrder?.currentUser || "Usuario Actual"; // General placeholder
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-4">
      <h3 className="text-md font-semibold text-gray-700 dark:text-gray-100 mb-3">Estado del Proceso</h3>
      <div className="flex items-center overflow-x-auto py-2">
        {otStatusOptions.map((status, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;
          const responsible = getResponsibleForStatus(status);

          return (
            <React.Fragment key={status}>
              <div className="flex flex-col items-center min-w-[100px] md:min-w-[120px] px-1">
                <div
                  className={`
                    w-7 h-7 rounded-full flex items-center justify-center text-white mb-1 text-xs
                    ${isActive ? 'bg-indigo-600 dark:bg-indigo-500 ring-2 md:ring-4 ring-indigo-300 dark:ring-indigo-700' : ''}
                    ${isCompleted ? 'bg-green-500 dark:bg-green-600' : ''}
                    ${!isActive && !isCompleted ? 'bg-gray-300 dark:bg-gray-600' : ''}
                  `}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    // Ensure text inside non-active, non-completed dots is visible in dark mode
                    <span className={`text-xxs font-semibold ${(!isActive && !isCompleted) ? 'text-gray-700 dark:text-gray-200' : 'text-white'}`}>{index + 1}</span>
                  )}
                </div>
                <div className={`text-xxs md:text-xs text-center ${isActive ? 'font-bold text-indigo-700 dark:text-indigo-300' : 'text-gray-600 dark:text-gray-400'}`}>
                  {status}
                </div>
                {isActive && responsible && (
                  <div className="text-xxs text-center text-indigo-500 dark:text-indigo-400 mt-0.5">
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
