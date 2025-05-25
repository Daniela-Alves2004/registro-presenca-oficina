import React from 'react';

const WorkshopDetailsTabs = ({
  activeTab,
  setActiveTab
}) => {
  return (
    <div className="border-b border-gray-700">
      <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab('participants')}
          className={`${
            activeTab === 'participants'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-gray-400 hover:text-gray-300'
          } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
        >
          Participantes
        </button>
        <button
          onClick={() => setActiveTab('attendance')}
          className={`${
            activeTab === 'attendance'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-gray-400 hover:text-gray-300'
          } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
        >
          Presenças
        </button>
        <button
          onClick={() => setActiveTab('report')}
          className={`${
            activeTab === 'report'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-gray-400 hover:text-gray-300'
          } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
        >
          Relatório
        </button>
      </nav>
    </div>
  );
};

export default WorkshopDetailsTabs; 