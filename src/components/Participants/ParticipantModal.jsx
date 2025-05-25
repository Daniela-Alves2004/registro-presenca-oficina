import React from 'react';
import Modal from '../Modal'; // Importa o componente Modal base

const ParticipantModal = ({
  isOpen,
  onClose,
  onSubmit,
  newParticipant,
  setNewParticipant,
}) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewParticipant({ ...newParticipant, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validação de telefone com 11 dígitos
    const phoneDigits = newParticipant.phone.replace(/\D/g, '');
    if (phoneDigits.length !== 11) {
      alert('Por favor, insira um número de telefone válido com 11 dígitos (incluindo DDD).');
      return;
    }
    onSubmit(e); // Chama a função de submissão passada via prop
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Novo Participante">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="participant-name" className="block text-sm font-medium text-gray-300 mb-2">
            Nome
          </label>
          <input
            id="participant-name"
            name="name"
            type="text"
            value={newParticipant.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="participant-cpf" className="block text-sm font-medium text-gray-300 mb-2">
            CPF
          </label>
          <input
            id="participant-cpf"
            name="cpf"
            type="text"
            value={newParticipant.cpf || ''}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
              setNewParticipant({ ...newParticipant, cpf: value });
            }}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Digite o CPF"
            maxLength={11} // Max 11 digits for CPF
            required
          />
        </div>
        <div>
          <label htmlFor="participant-ra" className="block text-sm font-medium text-gray-300 mb-2">
            RA (opcional)
          </label>
          <input
            id="participant-ra"
            name="ra"
            type="text"
            value={newParticipant.ra}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 7);
              setNewParticipant({ ...newParticipant, ra: value });
            }}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Digite o RA (7 dígitos)"
            maxLength={7}
          />
        </div>
        <div>
          <label htmlFor="participant-email" className="block text-sm font-medium text-gray-300 mb-2">
            Email
          </label>
          <input
            id="participant-email"
            name="email"
            type="email"
            value={newParticipant.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="participant-phone" className="block text-sm font-medium text-gray-300 mb-2">
            Telefone
          </label>
          <input
            id="participant-phone"
            name="phone"
            type="tel"
            value={newParticipant.phone}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Digite o telefone"
            required
          />
        </div>
        <div>
          <label htmlFor="participant-type" className="block text-sm font-medium text-gray-300 mb-2">
            Tipo
          </label>
          <select
            id="participant-type"
            name="type"
            value={newParticipant.type}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="student">Aluno</option>
            <option value="instructor">Instrutor</option>
          </select>
        </div>
        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors hover:shadow-gray-500/50 hover:shadow-md duration-300 ease-in-out"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition-colors hover:shadow-blue-500/50 hover:shadow-md duration-300 ease-in-out"
          >
            Salvar
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ParticipantModal; 