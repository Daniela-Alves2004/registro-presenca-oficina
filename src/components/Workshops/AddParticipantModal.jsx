import React from 'react';
import Modal from '../Modal';

const AddParticipantModal = ({
  isOpen,
  onClose,
  allStudents,
  participants,
  selectedStudent,
  setSelectedStudent,
  onAddParticipant
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Adicionar Participante"
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="student-select" className="block text-sm font-medium text-gray-300 mb-2">
            Selecione um Aluno
          </label>
          <select
            id="student-select"
            name="student-select"
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione um aluno</option>
            {allStudents
              .filter(student => !participants.some(p => p.id === student.id))
              .map(student => (
                <option key={student.id} value={student.id}>
                  {student.name} {student.ra ? `(${student.ra})` : ''}
                </option>
              ))}
          </select>
        </div>

        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors w-full sm:w-auto hover:shadow-gray-500/50 hover:shadow-md duration-300 ease-in-out"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onAddParticipant}
            className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition-colors w-full sm:w-auto hover:shadow-blue-500/50 hover:shadow-md duration-300 ease-in-out"
          >
            Adicionar
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddParticipantModal; 