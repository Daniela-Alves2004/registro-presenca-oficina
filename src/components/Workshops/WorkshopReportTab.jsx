import React from 'react';

const WorkshopReportTab = ({
  participants,
  attendance,
  calculateReportStats
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold text-white">Relatório da Oficina</h2>
        <button className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors w-full sm:w-auto hover:shadow-blue-500/50 hover:shadow-md duration-300 ease-in-out">
          Exportar Relatório
        </button>
      </div>

      {/* Detailed Report */}
      <div className="bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Participante
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Presenças
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Faltas
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {participants.map((participant) => {
                const { presences, absences } = calculateReportStats(participant.id);
                return (
                  <tr key={participant.id}>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                      {participant.name}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          participant.type === 'instructor'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {participant.type === 'instructor' ? 'Instrutor' : 'Aluno'}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                      {presences}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                      {absences}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WorkshopReportTab; 