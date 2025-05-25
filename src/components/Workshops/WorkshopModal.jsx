import React from 'react';
import Modal from '../Modal';

const WorkshopModal = ({
  isOpen,
  onClose,
  onSubmit,
  newWorkshop,
  setNewWorkshop,
  instructors,
  formErrors,
  weekdays
}) => {
  const handleWeekdayChange = (weekday) => {
    setNewWorkshop(prev => {
      const weekdays = prev.weekdays.includes(weekday)
        ? prev.weekdays.filter(d => d !== weekday)
        : [...prev.weekdays, weekday];
      return { ...prev, weekdays };
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nova Oficina">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="workshop-name" className="block text-sm font-medium text-gray-300 mb-2">
            Nome da Oficina
          </label>
          <input
            id="workshop-name"
            name="name"
            type="text"
            value={newWorkshop.name}
            onChange={(e) => setNewWorkshop({ ...newWorkshop, name: e.target.value })}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {formErrors.name && (
            <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="workshop-instructor" className="block text-sm font-medium text-gray-300 mb-2">
            Instrutor
          </label>
          <select
            id="workshop-instructor"
            name="instructor_id"
            value={newWorkshop.instructor_id}
            onChange={(e) => setNewWorkshop({ ...newWorkshop, instructor_id: e.target.value })}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Selecione um instrutor</option>
            {instructors.map((instructor) => (
              <option key={instructor.id} value={instructor.id}>
                {instructor.name}
              </option>
            ))}
          </select>
          {formErrors.instructor_id && (
            <p className="mt-1 text-sm text-red-500">{formErrors.instructor_id}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Dias da Semana
          </label>
          <div className="grid grid-cols-2 gap-2">
            {weekdays.map((day) => (
              <label key={day.value} className="flex items-center space-x-2">
                <input
                  id={`weekday-${day.value}`}
                  name={`weekday-${day.value}`}
                  type="checkbox"
                  checked={newWorkshop.weekdays.includes(day.value)}
                  onChange={() => handleWeekdayChange(day.value)}
                  className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-600 bg-gray-700 focus:ring-blue-500"
                />
                <span className="text-gray-300">{day.label}</span>
              </label>
            ))}
          </div>
          {formErrors.weekdays && (
            <p className="mt-1 text-sm text-red-500">{formErrors.weekdays}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="workshop-start-time" className="block text-sm font-medium text-gray-300 mb-2">
              Horário de Início
            </label>
            <input
              id="workshop-start-time"
              name="start_time"
              type="time"
              value={newWorkshop.start_time}
              onChange={(e) => setNewWorkshop({ ...newWorkshop, start_time: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {formErrors.start_time && (
              <p className="mt-1 text-sm text-red-500">{formErrors.start_time}</p>
            )}
          </div>

          <div>
            <label htmlFor="workshop-end-time" className="block text-sm font-medium text-gray-300 mb-2">
              Horário de Término
            </label>
            <input
              id="workshop-end-time"
              name="end_time"
              type="time"
              value={newWorkshop.end_time}
              onChange={(e) => setNewWorkshop({ ...newWorkshop, end_time: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {formErrors.end_time && (
              <p className="mt-1 text-sm text-red-500">{formErrors.end_time}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="workshop-start-date" className="block text-sm font-medium text-gray-300 mb-2">
              Data de Início
            </label>
            <input
              id="workshop-start-date"
              name="start_date"
              type="date"
              value={newWorkshop.start_date}
              onChange={(e) => setNewWorkshop({ ...newWorkshop, start_date: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {formErrors.start_date && (
              <p className="mt-1 text-sm text-red-500">{formErrors.start_date}</p>
            )}
          </div>

          <div>
            <label htmlFor="workshop-end-date" className="block text-sm font-medium text-gray-300 mb-2">
              Data de Término
            </label>
            <input
              id="workshop-end-date"
              name="end_date"
              type="date"
              value={newWorkshop.end_date}
              onChange={(e) => setNewWorkshop({ ...newWorkshop, end_date: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {formErrors.end_date && (
              <p className="mt-1 text-sm text-red-500">{formErrors.end_date}</p>
            )}
          </div>
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

export default WorkshopModal; 