import React from 'react';
import Modal from '../Modal'; // Importa o componente Modal base

const AttendanceHistoryModal = ({
  isOpen,
  onClose,
  selectedParticipant,
  attendanceStats,
  attendanceHistory,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Histórico de Presenças - ${selectedParticipant?.name}`}
    >
      <div className="space-y-4">
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-medium text-white mb-2">Resumo</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-300">Total de Aulas</p>
              <p className="text-white text-xl">{attendanceStats[selectedParticipant?.id]?.total_classes || 0}</p>
            </div>
            <div>
              <p className="text-gray-300">Presenças</p>
              <p className="text-white text-xl">{attendanceStats[selectedParticipant?.id]?.presences || 0}</p>
            </div>
            <div>
              <p className="text-gray-300">Faltas</p>
              <p className="text-white text-xl">{attendanceStats[selectedParticipant?.id]?.absences || 0}</p>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-medium text-white mb-2">Histórico Detalhado</h3>
          <div className="bg-gray-700 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-600">
              <thead className="bg-gray-600">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">Oficina</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">Data</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">Observação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-600">
                {attendanceHistory.length > 0 ? (
                  attendanceHistory.map((record) => (
                    <tr key={record.id}>
                      <td className="px-4 py-2 text-sm text-gray-200">{record.workshop_name}</td>
                      <td className="px-4 py-2 text-sm text-gray-200">
                        {new Date(record.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            record.status === 'present'
                              ? 'bg-green-100 text-green-800'
                              : record.status === 'late' // Manter 'late' aqui para exibir histórico antigo, mas remover a opção de seleção em outros lugares
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {record.status === 'present'
                            ? 'Presente'
                            : record.status === 'late'
                            ? 'Atrasado'
                            : 'Ausente'}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-200">{record.notes || '-'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-4 py-2 text-center text-sm text-gray-400">
                      Nenhum registro de presença encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AttendanceHistoryModal; 