import { useState, useEffect } from 'react';
import { getWorkshops, getWorkshopParticipants, getWorkshopAttendance } from '../services/api';

// Importação dos novos componentes
import AttendanceHeader from '../components/Attendance/AttendanceHeader';
import WorkshopSelect from '../components/Attendance/WorkshopSelect';
import AttendanceTable from '../components/Attendance/AttendanceTable';

function Attendance() {
  const [workshops, setWorkshops] = useState([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: 'name',
    direction: 'asc'
  });

  useEffect(() => {
    loadWorkshops();
  }, []);

  useEffect(() => {
    if (selectedWorkshop) {
      loadWorkshopData(selectedWorkshop);
    }
  }, [selectedWorkshop]);

  const loadWorkshops = async () => {
    try {
      setLoading(true);
      const data = await getWorkshops();
      setWorkshops(data.filter(w => w.status === 'active'));
    } catch (error) {
      console.error('Erro ao carregar oficinas:', error);
      setError('Erro ao carregar oficinas');
    } finally {
      setLoading(false);
    }
  };

  const loadWorkshopData = async (workshopId) => {
    try {
      setLoading(true);
      const [participantsData, attendanceData] = await Promise.all([
        getWorkshopParticipants(workshopId),
        getWorkshopAttendance(workshopId)
      ]);
      setParticipants(participantsData);
      setAttendance(attendanceData);
    } catch (error) {
      console.error('Erro ao carregar dados da oficina:', error);
      setError('Erro ao carregar dados da oficina');
    } finally {
      setLoading(false);
    }
  };

  const handleWorkshopChange = (e) => {
    const workshopId = e.target.value;
    setSelectedWorkshop(workshopId);
    if (!workshopId) {
      setParticipants([]);
      setAttendance([]);
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedParticipants = () => {
    if (!selectedWorkshop) return [];

    return [...participants].sort((a, b) => {
      if (sortConfig.key === 'name') {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        return sortConfig.direction === 'asc' 
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      } else if (sortConfig.key === 'status') {
        const statusA = attendance
          .filter(att => att.participant_id === a.id)
          .sort((x, y) => new Date(y.date) - new Date(x.date))[0]?.status || 'absent';
        const statusB = attendance
          .filter(att => att.participant_id === b.id)
          .sort((x, y) => new Date(y.date) - new Date(x.date))[0]?.status || 'absent';
        
        if (statusA === statusB) {
          return a.name.localeCompare(b.name);
        }
        
        return sortConfig.direction === 'asc'
          ? statusA.localeCompare(statusB)
          : statusB.localeCompare(statusA);
      }
      return 0;
    });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '↕';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <AttendanceHeader />

      {/* Workshop Selection */}
      <WorkshopSelect
        workshops={workshops}
        selectedWorkshop={selectedWorkshop}
        handleWorkshopChange={handleWorkshopChange}
      />

      {/* Attendance List */}
      <AttendanceTable
        participants={participants}
        attendance={attendance}
        selectedWorkshop={selectedWorkshop}
        sortConfig={sortConfig}
        handleSort={handleSort}
        getSortedParticipants={getSortedParticipants}
        getSortIcon={getSortIcon}
      />
    </div>
  );
}

export default Attendance; 