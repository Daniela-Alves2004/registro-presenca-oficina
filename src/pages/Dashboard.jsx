import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getParticipants, getWorkshops } from '../services/api';

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    activeWorkshops: 0,
    finishedWorkshops: 0,
    totalWorkshops: 0,
    activeStudents: 0,
    activeInstructors: 0,
    totalParticipants: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [participants, workshops] = await Promise.all([
        getParticipants(),
        getWorkshops()
      ]);

      const activeStudents = participants.filter(p => p.type === 'student' && p.status === 'active');
      const activeInstructors = participants.filter(p => p.type === 'instructor' && p.status === 'active');
      const activeWorkshops = workshops.filter(w => w.status === 'active');
      const finishedWorkshops = workshops.filter(w => w.status === 'finished');

      setStats({
        activeWorkshops: activeWorkshops.length,
        finishedWorkshops: finishedWorkshops.length,
        totalWorkshops: workshops.length,
        activeStudents: activeStudents.length,
        activeInstructors: activeInstructors.length,
        totalParticipants: participants.length
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg shadow p-4 sm:p-6 border border-gray-700">
          <h3 className="text-lg font-medium text-gray-200">Oficinas</h3>
          <div className="mt-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Ativas</span>
              <span className="text-2xl font-bold text-blue-500">{stats.activeWorkshops}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Encerradas</span>
              <span className="text-2xl font-bold text-gray-500">{stats.finishedWorkshops}</span>
            </div>
            <div className="border-t border-gray-700 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total</span>
                <span className="text-2xl font-bold text-white">{stats.totalWorkshops}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow p-4 sm:p-6 border border-gray-700">
          <h3 className="text-lg font-medium text-gray-200">Participantes</h3>
          <div className="mt-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Alunos</span>
              <span className="text-2xl font-bold text-green-500">{stats.activeStudents}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Instrutores</span>
              <span className="text-2xl font-bold text-blue-500">{stats.activeInstructors}</span>
            </div>
            <div className="border-t border-gray-700 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total</span>
                <span className="text-2xl font-bold text-white">{stats.totalParticipants}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <button
          onClick={() => navigate('/workshops/')}
          className="bg-blue-700 text-white p-4 sm:p-6 rounded-lg shadow hover:bg-blue-600 transition-colors flex flex-col items-center justify-center text-center"
        >
          <span className="font-medium">Nova Oficina</span>
        </button>

        <button
          onClick={() => navigate('/participants/')}
          className="bg-green-700 text-white p-4 sm:p-6 rounded-lg shadow hover:bg-green-600 transition-colors flex flex-col items-center justify-center text-center"
        >
          <span className="font-medium">Novo Participante</span>
        </button>

        <button
          onClick={() => navigate('/attendance')}
          className="bg-purple-700 text-white p-4 sm:p-6 rounded-lg shadow hover:bg-purple-600 transition-colors flex flex-col items-center justify-center text-center"
        >
          <span className="font-medium">Ver Presenças</span>
        </button>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800 rounded-lg shadow border border-gray-700">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">Atividades Recentes</h2>
          <div className="text-gray-400 text-center py-8">
            Nenhuma atividade recente
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 