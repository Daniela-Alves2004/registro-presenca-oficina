import React from 'react';
import AddParticipantModal from './AddParticipantModal';

const WorkshopParticipantsTab = ({
  participants,
  onRemoveParticipant,
  onShowAddParticipant,
  showAddParticipant,
  onCloseAddParticipantModal,
  allStudents,
  selectedStudent,
  setSelectedStudent,
  onAddParticipant
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold text-white">Participantes</h2>
        <button
          onClick={onShowAddParticipant}
          className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors w-full sm:w-auto hover:shadow-blue-500/50 hover:shadow-md duration-300 ease-in-out"
        >
          Adicionar Participante
        </button>
      </div>

      {/* Participants List */}
      <div className="bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  RA
                </th>
                <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {participants.length > 0 ? (
                participants.map((participant) => (
                  <tr key={participant.id}>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                      {participant.name}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                      {participant.email}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                      {participant.ra || '-'}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => onRemoveParticipant(participant.id)}
                        className="text-red-500 hover:text-red-400 transition-colors hover:shadow-red-500/50 hover:shadow-md duration-300 ease-in-out"
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-4 sm:px-6 py-4 text-center text-sm text-gray-400">
                    Nenhum participante cadastrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Participant Modal */}
      <AddParticipantModal
        isOpen={showAddParticipant}
        onClose={onCloseAddParticipantModal}
        allStudents={allStudents}
        participants={participants}
        selectedStudent={selectedStudent}
        setSelectedStudent={setSelectedStudent}
        onAddParticipant={onAddParticipant}
      />
    </div>
  );
};

export default WorkshopParticipantsTab; 