import {
  getAllWorkshops,
  getWorkshopById,
  createWorkshopQuery,
  updateWorkshopQuery,
  updateWorkshopStatusQuery,
  getWorkshopParticipantsQuery,
  getWorkshopAttendanceQuery,
  addWorkshopParticipantQuery,
  removeWorkshopParticipantQuery
} from '../../../database/queries/workshops.queries.js';

// Mock the database module
jest.mock('../../../database/db.js', () => ({
  runQuery: jest.fn(),
  runSingleQuery: jest.fn(),
  runWriteQuery: jest.fn()
}));

import { runQuery, runSingleQuery, runWriteQuery } from '../../../database/db.js';

describe('Workshop Queries Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllWorkshops', () => {
    it('should return all workshops with instructor names', async () => {
      const mockWorkshops = [
        { id: 1, name: 'Workshop 1', instructor_name: 'John Doe' },
        { id: 2, name: 'Workshop 2', instructor_name: 'Jane Smith' }
      ];
      runQuery.mockResolvedValue(mockWorkshops);

      const result = await getAllWorkshops();

      expect(result).toEqual(mockWorkshops);
      expect(runQuery).toHaveBeenCalledWith(expect.stringContaining('SELECT w.*, p.name as instructor_name'));
    });

    it('should handle database errors', async () => {
      const mockError = new Error('Database error');
      runQuery.mockRejectedValue(mockError);

      await expect(getAllWorkshops()).rejects.toThrow('Database error');
    });
  });

  describe('getWorkshopById', () => {
    it('should return a specific workshop by ID', async () => {
      const mockWorkshop = { id: 1, name: 'Test Workshop', instructor_name: 'John Doe' };
      runSingleQuery.mockResolvedValue(mockWorkshop);

      const result = await getWorkshopById(1);

      expect(result).toEqual(mockWorkshop);
      expect(runSingleQuery).toHaveBeenCalledWith(
        expect.stringContaining('WHERE w.id = ?'),
        [1]
      );
    });

    it('should return null when workshop not found', async () => {
      runSingleQuery.mockResolvedValue(null);

      const result = await getWorkshopById(999);

      expect(result).toBeNull();
    });
  });

  describe('createWorkshopQuery', () => {
    it('should create a new workshop successfully', async () => {
      const mockResult = { id: 5, changes: 1 };
      runWriteQuery.mockResolvedValue(mockResult);

      const workshopData = {
        name: 'New Workshop',
        instructor_id: 1,
        schedule: 'Monday 10:00-12:00',
        status: 'active',
        start_date: '2025-01-01',
        end_date: '2025-02-01'
      };

      const result = await createWorkshopQuery(
        workshopData.name,
        workshopData.instructor_id,
        workshopData.schedule,
        workshopData.status,
        workshopData.start_date,
        workshopData.end_date
      );

      expect(result).toEqual(mockResult);
      expect(runWriteQuery).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO workshops'),
        [workshopData.name, workshopData.instructor_id, workshopData.schedule, workshopData.status, workshopData.start_date, workshopData.end_date]
      );
    });
  });

  describe('updateWorkshopQuery', () => {
    it('should update an existing workshop', async () => {
      const mockResult = { id: 1, changes: 1 };
      runWriteQuery.mockResolvedValue(mockResult);

      const workshopData = {
        name: 'Updated Workshop',
        instructor_id: 2,
        schedule: 'Tuesday 14:00-16:00',
        status: 'active',
        start_date: '2025-01-01',
        end_date: '2025-03-01'
      };

      const result = await updateWorkshopQuery(1, ...Object.values(workshopData));

      expect(result).toEqual(mockResult);
      expect(runWriteQuery).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE workshops SET'),
        [...Object.values(workshopData), 1]
      );
    });
  });

  describe('updateWorkshopStatusQuery', () => {
    it('should update workshop status', async () => {
      const mockResult = { id: 1, changes: 1 };
      runWriteQuery.mockResolvedValue(mockResult);

      const result = await updateWorkshopStatusQuery(1, 'finished');

      expect(result).toEqual(mockResult);
      expect(runWriteQuery).toHaveBeenCalledWith(
        'UPDATE workshops SET status = ? WHERE id = ?',
        ['finished', 1]
      );
    });
  });

  describe('getWorkshopParticipantsQuery', () => {
    it('should return workshop participants', async () => {
      const mockParticipants = [
        { id: 1, name: 'Student 1', type: 'student' },
        { id: 2, name: 'Student 2', type: 'student' }
      ];
      runQuery.mockResolvedValue(mockParticipants);

      const result = await getWorkshopParticipantsQuery(1);

      expect(result).toEqual(mockParticipants);
      expect(runQuery).toHaveBeenCalledWith(
        expect.stringContaining('JOIN workshop_participants'),
        [1]
      );
    });
  });

  describe('getWorkshopAttendanceQuery', () => {
    it('should return workshop attendance records', async () => {
      const mockAttendance = [
        { id: 1, participant_name: 'Student 1', date: '2025-01-01', status: 'present' },
        { id: 2, participant_name: 'Student 2', date: '2025-01-01', status: 'absent' }
      ];
      runQuery.mockResolvedValue(mockAttendance);

      const result = await getWorkshopAttendanceQuery(1);

      expect(result).toEqual(mockAttendance);
      expect(runQuery).toHaveBeenCalledWith(
        expect.stringContaining('JOIN participants p ON a.participant_id = p.id'),
        [1]
      );
    });
  });

  describe('addWorkshopParticipantQuery', () => {
    it('should add a participant to a workshop', async () => {
      const mockResult = { id: 1, changes: 1 };
      runWriteQuery.mockResolvedValue(mockResult);

      const result = await addWorkshopParticipantQuery(1, 5);

      expect(result).toEqual(mockResult);
      expect(runWriteQuery).toHaveBeenCalledWith(
        'INSERT INTO workshop_participants (workshop_id, participant_id) VALUES (?, ?)',
        [1, 5]
      );
    });
  });

  describe('removeWorkshopParticipantQuery', () => {
    it('should remove a participant from a workshop', async () => {
      const mockResult = { id: 1, changes: 1 };
      runWriteQuery.mockResolvedValue(mockResult);

      const result = await removeWorkshopParticipantQuery(1, 5);

      expect(result).toEqual(mockResult);
      expect(runWriteQuery).toHaveBeenCalledWith(
        'DELETE FROM workshop_participants WHERE workshop_id = ? AND participant_id = ?',
        [1, 5]
      );
    });
  });
}); 