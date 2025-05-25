import { useState, useEffect } from 'react';
import { getParticipants, deleteParticipant, createParticipant, getParticipantAttendanceStats, getParticipantAttendanceHistory } from '../services/api';
import Modal from '../components/Modal';

// Importação dos novos componentes
import ParticipantsHeader from '../components/Participants/ParticipantsHeader';
import ParticipantsSearchFilter from '../components/Participants/ParticipantsSearchFilter';
import ParticipantsTable from '../components/Participants/ParticipantsTable';
import ParticipantModal from '../components/Participants/ParticipantModal';
import AttendanceHistoryModal from '../components/Participants/AttendanceHistoryModal';

export default function Participants() {
  const [participants, setParticipants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: 'name',
    direction: 'asc'
  });
  const [newParticipant, setNewParticipant] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'student',
    ra: '',
    cpf: ''
  });
  const [attendanceStats, setAttendanceStats] = useState({});
  const [attendanceHistory, setAttendanceHistory] = useState([]);

  useEffect(() => {
    loadParticipants();
  }, []);

  const loadParticipants = async () => {
    try {
      const data = await getParticipants();
      if (Array.isArray(data)) {
        setParticipants([...data]);
        // Load attendance stats for students
        const studentStats = {};
        for (const participant of data) {
          if (participant.type === 'student') {
            try {
              const stats = await getParticipantAttendanceStats(participant.id);
              studentStats[participant.id] = stats;
            } catch (error) {
              console.error(`Erro ao carregar estatísticas para ${participant.name}:`, error);
              studentStats[participant.id] = { attendance_percentage: 0 };
            }
          }
        }
        setAttendanceStats(studentStats);
      } else {
        console.error('Dados recebidos não são um array:', data);
        setParticipants([]);
      }
    } catch (error) {
      console.error('Erro ao carregar participantes:', error);
      setParticipants([]);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este participante? Esta ação irá apenas desativar o participante, mantendo seus registros históricos.')) {
      try {
        await deleteParticipant(id);
        await loadParticipants();
      } catch (error) {
        console.error('Erro ao excluir participante:', error);
        if (error.message.includes('instrutor de uma ou mais oficinas')) {
          alert('Não é possível excluir este participante pois ele é instrutor de uma ou mais oficinas. Por favor, remova ou reatribua as oficinas primeiro.');
        } else {
          alert('Não foi possível excluir o participante. Por favor, tente novamente.');
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const phoneDigits = newParticipant.phone.replace(/\D/g, '');
    if (phoneDigits.length !== 11) {
      alert('Por favor, insira um número de telefone válido com 11 dígitos (incluindo DDD).');
      return;
    }

    try {
      const participantData = {
        ...newParticipant,
        type: newParticipant.type,
        ra: newParticipant.ra || null
      };
      await createParticipant(participantData);
      setIsModalOpen(false);
      setNewParticipant({
        name: '',
        email: '',
        phone: '',
        type: 'student',
        ra: '',
        cpf: ''
      });
      await loadParticipants();
    } catch (error) {
      console.error('Erro ao criar participante:', error);
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedParticipants = (participants) => {
    return [...participants].sort((a, b) => {
      if (sortConfig.key === 'name') {
        const nameA = (a.name || '').toLowerCase();
        const nameB = (b.name || '').toLowerCase();
        return sortConfig.direction === 'asc' 
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      } else if (sortConfig.key === 'type') {
        const typeA = (a.type || '').toLowerCase();
        const typeB = (b.type || '').toLowerCase();
        return sortConfig.direction === 'asc'
          ? typeA.localeCompare(typeB)
          : typeB.localeCompare(typeA);
      }
      return 0;
    });
  };

  const filteredParticipants = participants.filter(participant => {
    if (!participant) return false;
    const matchesSearch = 
      (participant.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (participant.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || participant.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const sortedParticipants = getSortedParticipants(filteredParticipants);

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '↕';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const handleViewAttendance = async (participant) => {
    setSelectedParticipant(participant);
    try {
      const history = await getParticipantAttendanceHistory(participant.id);
      setAttendanceHistory(history);
      setIsAttendanceModalOpen(true);
    } catch (error) {
      console.error('Erro ao carregar histórico de presenças:', error);
      alert('Erro ao carregar histórico de presenças');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      
      {/* Header */}
      <ParticipantsHeader
        onNewParticipantClick={() => setIsModalOpen(true)}
      />

      {/* Search and Filter */}
      <ParticipantsSearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
      />

      {/* Participants Table */}
      <ParticipantsTable
        participants={sortedParticipants}
        attendanceStats={attendanceStats}
        typeFilter={typeFilter}
        onViewAttendance={handleViewAttendance}
        onDelete={handleDelete}
        sortConfig={sortConfig}
        onSort={handleSort}
      />

      {/* Modal de Novo Participante */}
      <ParticipantModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        newParticipant={newParticipant}
        setNewParticipant={setNewParticipant}
      />

      {/* Modal de Histórico de Presenças */}
      <AttendanceHistoryModal
        isOpen={isAttendanceModalOpen}
        onClose={() => setIsAttendanceModalOpen(false)}
        selectedParticipant={selectedParticipant}
        attendanceStats={attendanceStats}
        attendanceHistory={attendanceHistory}
      />
    </div>
  );
} 