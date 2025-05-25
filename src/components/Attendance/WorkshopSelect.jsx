import React from 'react';

const WorkshopSelect = ({
  workshops,
  selectedWorkshop,
  handleWorkshopChange
}) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow p-4 border border-gray-700">
      <div className="flex flex-col sm:flex-row gap-4">
        <label htmlFor="workshop-select" className="block text-sm font-medium text-gray-300 sr-only">Selecione uma oficina</label>
        <select
          id="workshop-select"
          name="workshop-select"
          value={selectedWorkshop || ''}
          onChange={handleWorkshopChange}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
        >
          <option value="">Selecione uma oficina</option>
          {workshops.map(workshop => (
            <option key={workshop.id} value={workshop.id}>
              {workshop.name} - {workshop.schedule}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default WorkshopSelect; 