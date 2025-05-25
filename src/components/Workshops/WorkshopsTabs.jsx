import React from 'react';

const WorkshopsTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="mb-6 border-b border-gray-700">
      <div className="flex space-x-4">
        <button
          className={`py-2 px-4 ${
            activeTab === 'active'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('active')}
        >
          Oficinas Ativas
        </button>
        <button
          className={`py-2 px-4 ${
            activeTab === 'finished'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('finished')}
        >
          Oficinas Finalizadas
        </button>
      </div>
    </div>
  );
};

export default WorkshopsTabs; 