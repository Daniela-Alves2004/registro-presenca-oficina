import { useState, useEffect } from 'react';
import { getWorkshops, createWorkshop, getParticipants, updateWorkshopStatus } from '../services/api';

// Importação dos novos componentes
import WorkshopsHeader from '../components/Workshops/WorkshopsHeader';
import WorkshopsTabs from '../components/Workshops/WorkshopsTabs';
import WorkshopsSearchFilter from '../components/Workshops/WorkshopsSearchFilter';
import WorkshopsTable from '../components/Workshops/WorkshopsTable';
import WorkshopModal from '../components/Workshops/WorkshopModal';

export default function Workshops() {
  const [workshops, setWorkshops] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [activeTab, setActiveTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [instructorFilter, setInstructorFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [newWorkshop, setNewWorkshop] = useState({
    name: '',
    instructor_id: '',
    weekdays: [],
    start_time: '',
    end_time: '',
    start_date: '',
    end_date: '',
    status: 'active'
  });

  const weekdays = [
    { value: 'monday', label: 'Segunda' },
    { value: 'tuesday', label: 'Terça' },
    { value: 'wednesday', label: 'Quarta' },
    { value: 'thursday', label: 'Quinta' },
    { value: 'friday', label: 'Sexta' },
    { value: 'saturday', label: 'Sábado' },
    { value: 'sunday', label: 'Domingo' }
  ];

  useEffect(() => {
    loadWorkshops();
    loadInstructors();
  }, []);

  const loadWorkshops = async () => {
    try {
      const data = await getWorkshops();
      setWorkshops(data);
    } catch (error) {
      console.error('Erro ao carregar oficinas:', error);
    }
  };

  const loadInstructors = async () => {
    try {
      const data = await getParticipants();
      const instructors = data.filter(p => p.type === 'instructor');
      setInstructors(instructors);
    } catch (error) {
      console.error('Erro ao carregar instrutores:', error);
    }
  };

  const handleDeactivate = async (id) => {
    if (window.confirm('Tem certeza que deseja desativar esta oficina? Ela será movida para a aba "Oficinas Finalizadas".')) {
      try {
        await updateWorkshopStatus(id, 'finished');
        await loadWorkshops();
      } catch (error) {
        console.error('Erro ao desativar oficina:', error);
        alert('Não foi possível desativar a oficina. Por favor, tente novamente.');
      }
    }
  };

  const validateForm = () => {
    const errors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!newWorkshop.name.trim()) {
      errors.name = 'Nome da oficina é obrigatório';
    }

    if (!newWorkshop.instructor_id) {
      errors.instructor_id = 'Selecione um instrutor';
    }

    if (newWorkshop.weekdays.length === 0) {
      errors.weekdays = 'Selecione pelo menos um dia da semana';
    }

    if (!newWorkshop.start_time) {
      errors.start_time = 'Horário de início é obrigatório';
    }

    if (!newWorkshop.end_time) {
      errors.end_time = 'Horário de término é obrigatório';
    } else if (newWorkshop.start_time && newWorkshop.end_time) {
      if (newWorkshop.start_time >= newWorkshop.end_time) {
        errors.end_time = 'Horário de término deve ser posterior ao horário de início';
      }
    }

    if (!newWorkshop.start_date) {
      errors.start_date = 'Data de início é obrigatória';
    } else {
      const startDate = new Date(newWorkshop.start_date);
      if (startDate < today) {
        errors.start_date = 'Data de início não pode ser no passado';
      }
    }

    if (!newWorkshop.end_date) {
      errors.end_date = 'Data de término é obrigatória';
    } else {
      const endDate = new Date(newWorkshop.end_date);
      const startDate = new Date(newWorkshop.start_date);
      if (endDate < startDate) {
        errors.end_date = 'Data de término deve ser posterior à data de início';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const weekdaysLabels = newWorkshop.weekdays.map(day => 
        weekdays.find(w => w.value === day)?.label
      ).join(' e ');
      
      const schedule = `${weekdaysLabels}, ${newWorkshop.start_time} - ${newWorkshop.end_time}`;

      const workshopData = {
        ...newWorkshop,
        schedule
      };

      await createWorkshop(workshopData);
      setIsModalOpen(false);
      setNewWorkshop({
        name: '',
        instructor_id: '',
        weekdays: [],
        start_time: '',
        end_time: '',
        start_date: '',
        end_date: '',
        status: 'active'
      });
      setFormErrors({});
      await loadWorkshops();
    } catch (error) {
      console.error('Erro ao criar oficina:', error);
    }
  };

  const handleWeekdayChange = (weekday) => {
    setNewWorkshop(prev => {
      const weekdays = prev.weekdays.includes(weekday)
        ? prev.weekdays.filter(d => d !== weekday)
        : [...prev.weekdays, weekday];
      return { ...prev, weekdays };
    });
  };

  const filteredWorkshops = workshops.filter(workshop => {
    const matchesSearch = workshop.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesInstructor = !instructorFilter || workshop.instructor_id === parseInt(instructorFilter);
    const matchesStatus = workshop.status === activeTab;
    return matchesSearch && matchesInstructor && matchesStatus;
  });

  const getInstructorName = (instructorId) => {
    const instructor = instructors.find(i => i.id === instructorId);
    return instructor ? instructor.name : 'Instrutor não encontrado';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <WorkshopsHeader onNewWorkshopClick={() => setIsModalOpen(true)} />
      
      <WorkshopsTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <WorkshopsSearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        instructorFilter={instructorFilter}
        setInstructorFilter={setInstructorFilter}
        instructors={instructors}
      />

      <WorkshopsTable
        workshops={filteredWorkshops}
        onDeactivate={handleDeactivate}
      />

      <WorkshopModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        newWorkshop={newWorkshop}
        setNewWorkshop={setNewWorkshop}
        instructors={instructors}
        formErrors={formErrors}
        weekdays={weekdays}
      />
    </div>
  );
} 