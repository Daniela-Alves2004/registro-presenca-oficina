import React from 'react';

const ParticipantsSearchFilter = ({
  searchTerm,
  setSearchTerm,
  typeFilter,
  setTypeFilter,
}) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="participant-search" className="block text-sm font-medium text-gray-300 mb-2">
            Buscar Participante
          </label>
          <input
            id="participant-search"
            name="participant-search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Digite o nome ou email do participante..."
          />
        </div>
        <div>
          <label htmlFor="participant-type-filter" className="block text-sm font-medium text-gray-300 mb-2">
            Filtrar por Tipo
          </label>
          <select
            id="participant-type-filter"
            name="participant-type-filter"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos os tipos</option>
            <option value="student">Alunos</option>
            <option value="instructor">Instrutores</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ParticipantsSearchFilter; 