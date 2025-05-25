import React from 'react';
import { Link } from 'react-router-dom';

const WorkshopsTable = ({ workshops, onDeactivate }) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Nome
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Instrutor
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Horário
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {workshops.length > 0 ? (
            workshops.map((workshop) => (
              <tr key={workshop.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                  {workshop.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                  {workshop.instructor_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                  {workshop.schedule}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      workshop.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {workshop.status === 'active' ? 'Ativa' : 'Finalizada'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    to={`/workshops/${workshop.id}`}
                    className="text-blue-500 hover:text-blue-400 mr-4 transition-colors hover:shadow-blue-500/50 hover:shadow-md duration-300 ease-in-out"
                  >
                    Detalhes
                  </Link>
                  <button
                    onClick={() => onDeactivate(workshop.id)}
                    className="text-red-500 hover:text-red-400 transition-colors hover:shadow-red-500/50 hover:shadow-md duration-300 ease-in-out"
                  >
                    Desativar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-400">
                Nenhuma oficina encontrada
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default WorkshopsTable; 