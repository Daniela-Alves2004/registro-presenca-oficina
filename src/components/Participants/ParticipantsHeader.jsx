import React from 'react';

const ParticipantsHeader = ({ onNewParticipantClick }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-white">Participantes</h1>
      <button
        onClick={onNewParticipantClick}
        className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition-colors hover:shadow-blue-500/50 hover:shadow-md duration-300 ease-in-out"
      >
        Novo Participante
      </button>
    </div>
  );
};

export default ParticipantsHeader; 