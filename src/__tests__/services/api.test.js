import {
  getWorkshops,
  getWorkshop,
  createWorkshop,
  updateWorkshop,
  updateWorkshopStatus,
  getWorkshopParticipants,
  getWorkshopAttendance,
  getParticipants,
  getParticipant,
  createParticipant,
  updateParticipant,
  deleteParticipant,
  getAttendance,
  getAttendanceRecord,
  createAttendance,
  updateAttendance,
  deleteAttendance,
  getParticipantAttendanceStats,
  getParticipantAttendanceHistory,
  addWorkshopParticipant,
  removeWorkshopParticipant
} from '../../services/api.js';

// Mock fetch globally
global.fetch = jest.fn();

describe('API Service Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockResponse = (data, status = 200) => {
    return Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(data),
      statusText: status === 200 ? 'OK' : 'Error'
    });
  };

  const mockErrorResponse = (error, status = 400) => {
    return Promise.resolve({
      ok: false,
      status,
      json: () => Promise.resolve({ error }),
      statusText: 'Error'
    });
  };

  describe('Workshop API Tests', () => {
    it('should fetch all workshops successfully', async () => {
      const mockWorkshops = [
        { id: 1, name: 'Workshop 1' },
        { id: 2, name: 'Workshop 2' }
      ];
      fetch.mockResolvedValue(mockResponse(mockWorkshops));

      const result = await getWorkshops();

      expect(result).toEqual(mockWorkshops);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/workshops', {
        headers: { 'Content-Type': 'application/json' }
      });
    });

    it('should fetch a specific workshop by ID', async () => {
      const mockWorkshop = { id: 1, name: 'Test Workshop' };
      fetch.mockResolvedValue(mockResponse(mockWorkshop));

      const result = await getWorkshop(1);

      expect(result).toEqual(mockWorkshop);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/workshops/1', {
        headers: { 'Content-Type': 'application/json' }
      });
    });

    it('should create a new workshop', async () => {
      const workshopData = { name: 'New Workshop', instructor_id: 1 };
      const createdWorkshop = { id: 3, ...workshopData };
      fetch.mockResolvedValue(mockResponse(createdWorkshop));

      const result = await createWorkshop(workshopData);

      expect(result).toEqual(createdWorkshop);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/workshops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workshopData)
      });
    });

    it('should update an existing workshop', async () => {
      const workshopData = { name: 'Updated Workshop' };
      const updatedWorkshop = { id: 1, ...workshopData };
      fetch.mockResolvedValue(mockResponse(updatedWorkshop));

      const result = await updateWorkshop(1, workshopData);

      expect(result).toEqual(updatedWorkshop);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/workshops/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workshopData)
      });
    });

    it('should update workshop status', async () => {
      const statusData = { status: 'finished' };
      fetch.mockResolvedValue(mockResponse(statusData));

      const result = await updateWorkshopStatus(1, 'finished');

      expect(result).toEqual(statusData);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/workshops/1/status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(statusData)
      });
    });

    it('should fetch workshop participants', async () => {
      const mockParticipants = [
        { id: 1, name: 'Student 1' },
        { id: 2, name: 'Student 2' }
      ];
      fetch.mockResolvedValue(mockResponse(mockParticipants));

      const result = await getWorkshopParticipants(1);

      expect(result).toEqual(mockParticipants);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/workshops/1/participants', {
        headers: { 'Content-Type': 'application/json' }
      });
    });

    it('should fetch workshop attendance', async () => {
      const mockAttendance = [
        { id: 1, participant_name: 'Student 1', status: 'present' }
      ];
      fetch.mockResolvedValue(mockResponse(mockAttendance));

      const result = await getWorkshopAttendance(1);

      expect(result).toEqual(mockAttendance);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/workshops/1/attendance', {
        headers: { 'Content-Type': 'application/json' }
      });
    });
  });

  describe('Participants API Tests', () => {
    it('should fetch all participants', async () => {
      const mockParticipants = [
        { id: 1, name: 'John Doe', type: 'student' },
        { id: 2, name: 'Jane Smith', type: 'instructor' }
      ];
      fetch.mockResolvedValue(mockResponse(mockParticipants));

      const result = await getParticipants();

      expect(result).toEqual(mockParticipants);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/participants', {
        headers: { 'Content-Type': 'application/json' }
      });
    });

    it('should fetch a specific participant by ID', async () => {
      const mockParticipant = { id: 1, name: 'John Doe' };
      fetch.mockResolvedValue(mockResponse(mockParticipant));

      const result = await getParticipant(1);

      expect(result).toEqual(mockParticipant);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/participants/1', {
        headers: { 'Content-Type': 'application/json' }
      });
    });

    it('should create a new participant', async () => {
      const participantData = { name: 'New Student', email: 'new@example.com' };
      const createdParticipant = { id: 3, ...participantData };
      fetch.mockResolvedValue(mockResponse(createdParticipant));

      const result = await createParticipant(participantData);

      expect(result).toEqual(createdParticipant);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/participants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(participantData)
      });
    });

    it('should update an existing participant', async () => {
      const participantData = { name: 'Updated Name' };
      const updatedParticipant = { id: 1, ...participantData };
      fetch.mockResolvedValue(mockResponse(updatedParticipant));

      const result = await updateParticipant(1, participantData);

      expect(result).toEqual(updatedParticipant);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/participants/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(participantData)
      });
    });

    it('should delete a participant', async () => {
      fetch.mockResolvedValue(mockResponse(null, 204));

      const result = await deleteParticipant(1);

      expect(result).toBeNull();
      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/participants/1', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
    });
  });

  describe('Attendance API Tests', () => {
    it('should fetch all attendance records', async () => {
      const mockAttendance = [
        { id: 1, workshop_id: 1, participant_id: 1, status: 'present' }
      ];
      fetch.mockResolvedValue(mockResponse(mockAttendance));

      const result = await getAttendance();

      expect(result).toEqual(mockAttendance);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/attendance', {
        headers: { 'Content-Type': 'application/json' }
      });
    });

    it('should create attendance records', async () => {
      const attendanceData = {
        workshop_id: 1,
        date: '2025-01-01',
        records: [
          { student_id: 1, status: 'present' },
          { student_id: 2, status: 'absent' }
        ]
      };
      const createdAttendance = { id: 1, ...attendanceData };
      fetch.mockResolvedValue(mockResponse(createdAttendance));

      const result = await createAttendance(attendanceData);

      expect(result).toEqual(createdAttendance);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attendanceData)
      });
    });
  });

  describe('Error Handling Tests', () => {
    it('should handle API errors with JSON response', async () => {
      fetch.mockResolvedValue(mockErrorResponse('Workshop not found', 404));

      await expect(getWorkshop(999)).rejects.toThrow('Workshop not found');
    });

    it('should handle API errors with non-JSON response', async () => {
      fetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error('Invalid JSON')),
        statusText: 'Internal Server Error'
      });

      await expect(getWorkshops()).rejects.toThrow('Internal Server Error');
    });

    it('should handle network errors', async () => {
      fetch.mockRejectedValue(new Error('Network error'));

      await expect(getWorkshops()).rejects.toThrow('Network error');
    });
  });

  describe('Participant Statistics API Tests', () => {
    it('should fetch participant attendance statistics', async () => {
      const mockStats = {
        total_classes: 10,
        presences: 8,
        absences: 2
      };
      fetch.mockResolvedValue(mockResponse(mockStats));

      const result = await getParticipantAttendanceStats(1);

      expect(result).toEqual(mockStats);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/participants/1/attendance-stats', {
        headers: { 'Content-Type': 'application/json' }
      });
    });

    it('should fetch participant attendance history', async () => {
      const mockHistory = [
        { id: 1, workshop_name: 'Workshop 1', date: '2025-01-01', status: 'present' }
      ];
      fetch.mockResolvedValue(mockResponse(mockHistory));

      const result = await getParticipantAttendanceHistory(1);

      expect(result).toEqual(mockHistory);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/participants/1/attendance-history', {
        headers: { 'Content-Type': 'application/json' }
      });
    });
  });

  describe('Workshop Participant Management Tests', () => {
    it('should add a participant to a workshop', async () => {
      const participantData = { participant_id: 5 };
      fetch.mockResolvedValue(mockResponse(participantData));

      const result = await addWorkshopParticipant(1, 5);

      expect(result).toEqual(participantData);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/workshops/1/participants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(participantData)
      });
    });

    it('should remove a participant from a workshop', async () => {
      fetch.mockResolvedValue(mockResponse(null, 204));

      const result = await removeWorkshopParticipant(1, 5);

      expect(result).toBeNull();
      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/workshops/1/participants/5', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
    });
  });
}); 