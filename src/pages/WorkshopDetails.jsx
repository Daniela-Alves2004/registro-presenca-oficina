import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getWorkshop, getWorkshopParticipants, getWorkshopAttendance, createAttendance, updateWorkshopStatus, deleteParticipant, getParticipants, addWorkshopParticipant, removeWorkshopParticipant } from '../services/api';

// Importar novos componentes
import WorkshopDetailsHeader from '../components/Workshops/WorkshopDetailsHeader';
import WorkshopDetailsTabs from '../components/Workshops/WorkshopDetailsTabs';
import WorkshopParticipantsTab from '../components/Workshops/WorkshopParticipantsTab';
import WorkshopAttendanceTab from '../components/Workshops/WorkshopAttendanceTab';
import WorkshopReportTab from '../components/Workshops/WorkshopReportTab';

function WorkshopDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workshop, setWorkshop] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [allParticipants, setAllParticipants] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [activeTab, setActiveTab] = useState('participants');
  const [showAddParticipant, setShowAddParticipant] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAttendanceLocked, setIsAttendanceLocked] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');

  useEffect(() => {
    loadWorkshopData();
    loadAllStudents();
    loadAllParticipants();
  }, [id]);

  useEffect(() => {
    if (selectedDate) {
      const hasAttendanceForDate = attendance.some(a => a.date === selectedDate);
      setIsAttendanceLocked(hasAttendanceForDate);
    } else {
      setIsAttendanceLocked(false);
    }
  }, [selectedDate, attendance]);

  const loadWorkshopData = async () => {
    try {
      setLoading(true);
      const [workshopData, participantsData, attendanceData] = await Promise.all([
        getWorkshop(id),
        getWorkshopParticipants(id),
        getWorkshopAttendance(id)
      ]);

      setWorkshop(workshopData);
      setParticipants(participantsData || []);
      setAttendance(attendanceData || []);
    } catch (error) {
      console.error('Erro ao carregar dados da oficina:', error);
      setError('Erro ao carregar dados da oficina');
    } finally {
      setLoading(false);
    }
  };

  const loadAllParticipants = async () => {
    try {
      const data = await getParticipants();
      setAllParticipants(data || []);
    } catch (error) {
      console.error('Erro ao carregar todos os participantes:', error);
    }
  };

  const loadAllStudents = async () => {
    try {
      const data = await getParticipants();
      setAllStudents(data.filter(p => p.type === 'student' && p.status === 'active'));
    } catch (error) {
      console.error('Erro ao carregar alunos:', error);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (window.confirm(`Tem certeza que deseja ${newStatus === 'finished' ? 'encerrar' : 'reativar'} esta oficina?`)) {
      try {
        await updateWorkshopStatus(id, newStatus);
        await loadWorkshopData();
      } catch (error) {
        console.error('Erro ao atualizar status da oficina:', error);
      }
    }
  };

  const handleAttendanceSubmit = async (e) => {
    e.preventDefault();
    try {
      const attendanceData = participants
        .filter(participant => participant.type === 'student')
        .map(participant => ({
          workshop_id: id,
          student_id: participant.id,
          date: selectedDate,
          status: participant.attendanceStatus || 'select',
          notes: participant.attendanceNotes || ''
        }));

      const hasUnmarkedParticipants = attendanceData.some(a => a.status === 'select');
      if (hasUnmarkedParticipants) {
        alert('Por favor, marque a presença de todos os alunos antes de registrar.');
        return;
      }

      await createAttendance(attendanceData);
      await loadWorkshopData();
      setIsAttendanceLocked(true);
    } catch (error) {
      console.error('Erro ao registrar presenças:', error);
      alert('Erro ao registrar presenças. Por favor, tente novamente.');
    }
  };

  const handleAttendanceChange = (participantId, status) => {
    if (isAttendanceLocked) return;
    setParticipants(prev => prev.map(p =>
      p.id === participantId ? { ...p, attendanceStatus: status } : p
    ));
  };

  const handleNotesChange = (participantId, notes) => {
    setParticipants(prev => prev.map(p =>
      p.id === participantId ? { ...p, attendanceNotes: notes } : p
    ));
  };

  const handleAddParticipant = async () => {
    if (!selectedStudent) {
      alert('Por favor, selecione um aluno');
      return;
    }

    try {
      await addWorkshopParticipant(id, selectedStudent);
      await loadWorkshopData();
      setShowAddParticipant(false);
      setSelectedStudent('');
    } catch (error) {
      console.error('Erro ao adicionar participante:', error);
      alert(error.message || 'Erro ao adicionar participante');
    }
  };

  const handleRemoveParticipant = async (participantId) => {
    if (window.confirm('Tem certeza que deseja remover este participante da oficina?')) {
      try {
        await removeWorkshopParticipant(id, participantId);
        await loadWorkshopData();
      } catch (error) {
        console.error('Erro ao remover participante:', error);
        alert(error.message || 'Erro ao remover participante');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!workshop) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-white">Oficina não encontrada</div>
      </div>
    );
  }

  const getInstructorName = () => {
    const instructor = allParticipants.find(p => p.id === workshop?.instructor_id);
    return instructor ? instructor.name : 'Instrutor não encontrado';
  };

  const getAttendanceCount = (participantId) => {
    return attendance.filter(a => 
      a.participant_id === participantId && a.status === 'present'
    ).length;
  };

  const getAttendanceForDate = (date) => {
    return attendance.filter(a => a.date === date);
  };

  const currentAttendance = getAttendanceForDate(selectedDate);

  const getCurrentStatus = (participantId) => {
    const participant = participants.find(p => p.id === participantId);
    if (participant?.attendanceStatus) {
      return participant.attendanceStatus;
    }
    const attendanceRecord = currentAttendance.find(a => a.participant_id === participantId);
    return attendanceRecord?.status || 'select';
  };

  // Função para calcular total de aulas, presenças e faltas para o relatório
  const calculateReportStats = (participantId) => {
    const participantAttendance = attendance.filter(a => a.participant_id === participantId);
    const totalClasses = new Set(attendance.map(a => a.date)).size;
    const presences = participantAttendance.filter(a => a.status === 'present').length;
    const absences = participantAttendance.filter(a => a.status === 'absent').length;
    return { totalClasses, presences, absences };
  };

  return (
    <div className="space-y-6">
      {/* Workshop Header */}
      <WorkshopDetailsHeader
        workshop={workshop}
        instructorName={getInstructorName()}
        onStatusChange={handleStatusChange}
      />

      {/* Tabs */}
      <WorkshopDetailsTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Content */}
      {activeTab === 'participants' && (
        <WorkshopParticipantsTab
          participants={participants}
          onRemoveParticipant={handleRemoveParticipant}
          onShowAddParticipant={() => setShowAddParticipant(true)}
          showAddParticipant={showAddParticipant}
          onCloseAddParticipantModal={() => {
            setShowAddParticipant(false);
            setSelectedStudent('');
          }}
          allStudents={allStudents}
          selectedStudent={selectedStudent}
          setSelectedStudent={setSelectedStudent}
          onAddParticipant={handleAddParticipant}
        />
      )}

      {activeTab === 'attendance' && (
        <WorkshopAttendanceTab
          participants={participants}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          onAttendanceSubmit={handleAttendanceSubmit}
          isAttendanceLocked={isAttendanceLocked}
          currentAttendance={currentAttendance}
          onAttendanceChange={handleAttendanceChange}
          onNotesChange={handleNotesChange}
        />
      )}

      {activeTab === 'report' && (
        <WorkshopReportTab
          participants={participants}
          attendance={attendance} // Passando todos os registros de presença
          calculateReportStats={calculateReportStats} // Passando a função de cálculo
        />
      )}
    </div>
  );
}

export default WorkshopDetails; 