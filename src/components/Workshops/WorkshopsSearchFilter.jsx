import React from 'react';

const WorkshopsSearchFilter = ({
  searchTerm,
  setSearchTerm,
  instructorFilter,
  setInstructorFilter,
  instructors
}) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="workshop-search" className="block text-sm font-medium text-gray-300 mb-2">
            Buscar Oficina
          </label>
          <input
            id="workshop-search"
            name="workshop-search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Digite o nome da oficina..."
          />
        </div>
        <div>
          <label htmlFor="instructor-filter" className="block text-sm font-medium text-gray-300 mb-2">
            Filtrar por Instrutor
          </label>
          <select
            id="instructor-filter"
            name="instructor-filter"
            value={instructorFilter}
            onChange={(e) => setInstructorFilter(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos os instrutores</option>
            {instructors.map((instructor) => (
              <option key={instructor.id} value={instructor.id}>
                {instructor.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default WorkshopsSearchFilter; 