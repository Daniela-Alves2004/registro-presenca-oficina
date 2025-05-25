import React from 'react';

const WorkshopsHeader = ({ onNewWorkshopClick }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-white">Oficinas</h1>
      <button
        onClick={onNewWorkshopClick}
        className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition-colors hover:shadow-blue-500/50 hover:shadow-md duration-300 ease-in-out"
      >
        Nova Oficina
      </button>
    </div>
  );
};

export default WorkshopsHeader; 