import React from 'react';

const AttendanceTable = ({
  participants,
  attendance,
  selectedWorkshop,
  sortConfig,
  handleSort,
  getSortedParticipants,
  getSortIcon
}) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-700">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th
                className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center space-x-1">
                  <span>Nome do Participante</span>
                  <span className="text-gray-400">{getSortIcon('name')}</span>
                </div>
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Tipo
              </th>
              <th
                className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  <span className="text-gray-400">{getSortIcon('status')}</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {selectedWorkshop ? (
              getSortedParticipants().length > 0 ? (
                getSortedParticipants().map((participant) => {
                  const latestAttendance = attendance
                    .filter(a => a.participant_id === participant.id)
                    .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

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
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        {participant.type === 'student' ? (
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              latestAttendance?.status === 'present'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {latestAttendance?.status === 'present' ? 'Presente' : 'Ausente'}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-400 text-center" colSpan="3">
                    Nenhum participante cadastrado nesta oficina
                  </td>
                </tr>
              )
            ) : (
              <tr>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-400 text-center" colSpan="3">
                  Selecione uma oficina para ver a lista de participantes
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceTable; 