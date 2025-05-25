import React from 'react';

const ParticipantsTable = ({
  participants,
  attendanceStats,
  typeFilter,
  onViewAttendance,
  onDelete,
  sortConfig,
  onSort,
}) => {
  // Funções de sort e getSortIcon movidas para o componente pai ou utils
  // const getSortIcon = (key) => { ... };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-700 table-fixed">
        <thead className="bg-gray-700">
          <tr>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600 w-1/4"
              onClick={() => onSort('name')}
            >
              <div className="flex items-center space-x-1">
                <span>Nome</span>
                <span className="text-gray-400">{/* {getSortIcon('name')} */}↕</span>
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-20">
              RA
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-1/4">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-32">
              Telefone
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600 w-24"
              onClick={() => onSort('type')}
            >
              <div className="flex items-center space-x-1">
                <span>Tipo</span>
                <span className="text-gray-400">{/* {getSortIcon('type')} */}↕</span>
              </div>
            </th>
            {typeFilter !== 'instructor' && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-36">
                Presença Geral
              </th>
            )}
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider w-40">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {participants.length > 0 ? (
            participants.map((participant) => (
              <tr key={participant.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                  {participant.name || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                  {participant.ra || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                  {participant.email || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                  {participant.phone || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
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
                {typeFilter !== 'instructor' && participant.type === 'student' && (
                  <td className="px-6 py-4 whitespace-nowrap w-36">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${
                            attendanceStats[participant.id]?.attendance_percentage >= 75
                              ? 'bg-green-500'
                              : attendanceStats[participant.id]?.attendance_percentage >= 50
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                          style={{
                            width: `${attendanceStats[participant.id]?.attendance_percentage || 0}%`
                          }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm text-gray-300">
                        {attendanceStats[participant.id]?.attendance_percentage || 0}%
                      </span>
                    </div>
                  </td>
                )}
                {typeFilter !== 'instructor' && participant.type === 'instructor' && (
                  <td className="px-6 py-4 whitespace-nowrap w-36">
                    {/* Empty cell for alignment */}
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium w-40">
                  <div className="flex justify-end space-x-4">
                    {participant.type === 'student' && (
                      <button
                        onClick={() => onViewAttendance(participant)}
                        className="text-blue-500 hover:text-blue-400 transition-colors hover:shadow-blue-500/50 hover:shadow-md duration-300 ease-in-out"
                      >
                        Ver Presenças
                      </button>
                    )}
                    <button
                      onClick={() => onDelete(participant.id)}
                      className="text-red-500 hover:text-red-400 transition-colors hover:shadow-red-500/50 hover:shadow-md duration-300 ease-in-out"
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={typeFilter !== 'instructor' ? 7 : 6} className="px-6 py-4 text-center text-sm text-gray-400">
                Nenhum participante encontrado
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ParticipantsTable; 