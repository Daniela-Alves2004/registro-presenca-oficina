import React from 'react';

const WorkshopDetailsHeader = ({
  workshop,
  instructorName,
  onStatusChange
}) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow p-4 sm:p-6 border border-gray-700">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">{workshop.name}</h1>
          <p className="text-gray-400 mt-2">Instrutor: {instructorName}</p>
          <p className="text-gray-400">Horário: {workshop.schedule}</p>
          <p className="text-gray-400">
            Período: {new Date(workshop.start_date).toLocaleDateString()} - {new Date(workshop.end_date).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          <button
            onClick={() => onStatusChange(workshop.status === 'active' ? 'finished' : 'active')}
            className={`${
              workshop.status === 'active'
                ? 'bg-red-700 hover:bg-red-600'
                : 'bg-green-700 hover:bg-green-600'
            } text-white px-4 py-2 rounded-md transition-colors w-full sm:w-auto hover:shadow-lg hover:shadow-opacity-50 duration-300 ease-in-out ${
              workshop.status === 'active' ? 'hover:shadow-red-500/50' : 'hover:shadow-green-500/50'
            }`}
          >
            {workshop.status === 'active' ? 'Encerrar Oficina' : 'Reativar Oficina'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkshopDetailsHeader; 