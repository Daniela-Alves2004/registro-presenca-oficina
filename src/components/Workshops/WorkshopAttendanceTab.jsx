import React from 'react';

const WorkshopAttendanceTab = ({
  participants,
  selectedDate,
  setSelectedDate,
  onAttendanceSubmit,
  isAttendanceLocked,
  currentAttendance,
  onAttendanceChange,
  onNotesChange
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold text-white">Registro de Presenças</h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div>
            <label htmlFor="attendance-date" className="block text-sm font-medium text-gray-300 mb-2">
              Data
            </label>
            <input
              id="attendance-date"
              name="attendance-date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full sm:w-auto px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            />
          </div>
          <button
            onClick={onAttendanceSubmit}
            disabled={isAttendanceLocked}
            className={`${
              isAttendanceLocked
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-blue-700 hover:bg-blue-600'
            } text-white px-4 py-2 rounded-md transition-colors w-full sm:w-auto hover:shadow-blue-500/50 hover:shadow-md duration-300 ease-in-out`}
          >
            {isAttendanceLocked ? 'Presenças Registradas' : 'Registrar Presenças'}
          </button>
        </div>
      </div>

      {/* Attendance List */}
      <div className="bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Observações
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {participants.length > 0 ? (
                participants.map((participant) => {
                  const attendanceRecord = currentAttendance.find(a => a.participant_id === participant.id);
                  const currentStatus = participant.attendanceStatus || attendanceRecord?.status || 'select';
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
                          <select
                            id={`attendance-status-${participant.id}`}
                            name={`attendance-status-${participant.id}`}
                            value={currentStatus}
                            onChange={(e) => onAttendanceChange(participant.id, e.target.value)}
                            disabled={isAttendanceLocked}
                            className={`px-2 py-1 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              isAttendanceLocked ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            aria-label={`Status de presença para ${participant.name}`}
                          >
                            <option value="select">Selecione a presença</option>
                            <option value="present">Presente</option>
                            <option value="absent">Ausente</option>
                          </select>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        {participant.type === 'student' ? (
                          <input
                            id={`attendance-notes-${participant.id}`}
                            name={`attendance-notes-${participant.id}`}
                            type="text"
                            value={attendanceRecord?.notes || ''}
                            onChange={(e) => onNotesChange(participant.id, e.target.value)}
                            disabled={isAttendanceLocked}
                            placeholder="Observações"
                            className={`w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              isAttendanceLocked ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            aria-label={`Observações de presença para ${participant.name}`}
                          />
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-400 text-center" colSpan="4">
                    Nenhum participante cadastrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WorkshopAttendanceTab; 