import {
  getAllParticipantsQuery,
  getParticipantByIdQuery,
  createParticipantQuery,
  updateParticipantQuery,
  deactivateParticipantQuery,
  getParticipantByCpfQuery,
  getParticipantByEmailQuery,
  getInstructorWorkshopsQuery,
  getParticipantAttendanceStatsQuery,
  getParticipantAttendanceHistoryQuery
} from '../../../database/queries/participants.queries.js';

// Mock the database module
jest.mock('../../../database/db.js', () => ({
  runQuery: jest.fn(),
  runSingleQuery: jest.fn(),
  runWriteQuery: jest.fn()
}));

import { runQuery, runSingleQuery, runWriteQuery } from '../../../database/db.js';

describe('Participants Queries Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllParticipantsQuery', () => {
    it('should return all active participants', async () => {
      const mockParticipants = [
        { id: 1, name: 'John Doe', type: 'student', status: 'active' },
        { id: 2, name: 'Jane Smith', type: 'instructor', status: 'active' }
      ];
      runQuery.mockResolvedValue(mockParticipants);

      const result = await getAllParticipantsQuery();

      expect(result).toEqual(mockParticipants);
      expect(runQuery).toHaveBeenCalledWith('SELECT * FROM participants WHERE status = ?', ['active']);
    });
  });

  describe('getParticipantByIdQuery', () => {
    it('should return a specific participant by ID', async () => {
      const mockParticipant = { id: 1, name: 'John Doe', email: 'john@example.com' };
      runSingleQuery.mockResolvedValue(mockParticipant);

      const result = await getParticipantByIdQuery(1);

      expect(result).toEqual(mockParticipant);
      expect(runSingleQuery).toHaveBeenCalledWith('SELECT * FROM participants WHERE id = ?', [1]);
    });

    it('should return null when participant not found', async () => {
      runSingleQuery.mockResolvedValue(null);

      const result = await getParticipantByIdQuery(999);

      expect(result).toBeNull();
    });
  });

  describe('createParticipantQuery', () => {
    it('should create a new student participant', async () => {
      const mockResult = { id: 5, changes: 1 };
      runWriteQuery.mockResolvedValue(mockResult);

      const participantData = {
        name: 'New Student',
        email: 'newstudent@example.com',
        phone: '41999999999',
        type: 'student',
        ra: '1234567',
        cpf: '12345678901'
      };

      const result = await createParticipantQuery(
        participantData.name,
        participantData.email,
        participantData.phone,
        participantData.type,
        participantData.ra,
        participantData.cpf
      );

      expect(result).toEqual(mockResult);
      expect(runWriteQuery).toHaveBeenCalledWith(
        'INSERT INTO participants (name, email, phone, type, ra, cpf) VALUES (?, ?, ?, ?, ?, ?)',
        [participantData.name, participantData.email, participantData.phone, participantData.type, participantData.ra, participantData.cpf]
      );
    });

    it('should create a new instructor participant with null RA', async () => {
      const mockResult = { id: 6, changes: 1 };
      runWriteQuery.mockResolvedValue(mockResult);

      const participantData = {
        name: 'New Instructor',
        email: 'newinstructor@example.com',
        phone: '41999999998',
        type: 'instructor',
        ra: null,
        cpf: '98765432109'
      };

      const result = await createParticipantQuery(
        participantData.name,
        participantData.email,
        participantData.phone,
        participantData.type,
        participantData.ra,
        participantData.cpf
      );

      expect(result).toEqual(mockResult);
      expect(runWriteQuery).toHaveBeenCalledWith(
        'INSERT INTO participants (name, email, phone, type, ra, cpf) VALUES (?, ?, ?, ?, ?, ?)',
        [participantData.name, participantData.email, participantData.phone, participantData.type, null, participantData.cpf]
      );
    });
  });

  describe('updateParticipantQuery', () => {
    it('should update an existing participant', async () => {
      const mockResult = { id: 1, changes: 1 };
      runWriteQuery.mockResolvedValue(mockResult);

      const participantData = {
        name: 'Updated Name',
        email: 'updated@example.com',
        phone: '41999999997',
        type: 'student'
      };

      const result = await updateParticipantQuery(1, ...Object.values(participantData));

      expect(result).toEqual(mockResult);
      expect(runWriteQuery).toHaveBeenCalledWith(
        'UPDATE participants SET name=?, email=?, phone=?, type=? WHERE id=?',
        [...Object.values(participantData), 1]
      );
    });
  });

  describe('deactivateParticipantQuery', () => {
    it('should deactivate a participant', async () => {
      const mockResult = { id: 1, changes: 1 };
      runWriteQuery.mockResolvedValue(mockResult);

      const result = await deactivateParticipantQuery(1);

      expect(result).toEqual(mockResult);
      expect(runWriteQuery).toHaveBeenCalledWith(
        'UPDATE participants SET status = ? WHERE id = ?',
        ['inactive', 1]
      );
    });
  });

  describe('getParticipantByCpfQuery', () => {
    it('should return participant ID by CPF', async () => {
      const mockParticipant = { id: 1 };
      runSingleQuery.mockResolvedValue(mockParticipant);

      const result = await getParticipantByCpfQuery('12345678901');

      expect(result).toEqual(mockParticipant);
      expect(runSingleQuery).toHaveBeenCalledWith(
        'SELECT id FROM participants WHERE cpf = ?',
        ['12345678901']
      );
    });

    it('should return null when CPF not found', async () => {
      runSingleQuery.mockResolvedValue(null);

      const result = await getParticipantByCpfQuery('99999999999');

      expect(result).toBeNull();
    });
  });

  describe('getParticipantByEmailQuery', () => {
    it('should return participant ID by email', async () => {
      const mockParticipant = { id: 1 };
      runSingleQuery.mockResolvedValue(mockParticipant);

      const result = await getParticipantByEmailQuery('test@example.com');

      expect(result).toEqual(mockParticipant);
      expect(runSingleQuery).toHaveBeenCalledWith(
        'SELECT id FROM participants WHERE email = ?',
        ['test@example.com']
      );
    });
  });

  describe('getInstructorWorkshopsQuery', () => {
    it('should return workshops for a specific instructor', async () => {
      const mockWorkshops = [
        { id: 1, name: 'Workshop 1' },
        { id: 2, name: 'Workshop 2' }
      ];
      runQuery.mockResolvedValue(mockWorkshops);

      const result = await getInstructorWorkshopsQuery(1);

      expect(result).toEqual(mockWorkshops);
      expect(runQuery).toHaveBeenCalledWith(
        'SELECT id, name FROM workshops WHERE instructor_id = ?',
        [1]
      );
    });
  });

  describe('getParticipantAttendanceStatsQuery', () => {
    it('should return attendance statistics for a participant', async () => {
      const mockStats = {
        total_classes: 10,
        presences: 8,
        absences: 2
      };
      runSingleQuery.mockResolvedValue(mockStats);

      const result = await getParticipantAttendanceStatsQuery(1);

      expect(result).toEqual(mockStats);
      expect(runSingleQuery).toHaveBeenCalledWith(
        expect.stringContaining('COUNT(*) as total_classes'),
        [1]
      );
    });
  });

  describe('getParticipantAttendanceHistoryQuery', () => {
    it('should return attendance history for a participant', async () => {
      const mockHistory = [
        { id: 1, workshop_name: 'Workshop 1', date: '2025-01-01', status: 'present' },
        { id: 2, workshop_name: 'Workshop 1', date: '2025-01-02', status: 'absent' }
      ];
      runQuery.mockResolvedValue(mockHistory);

      const result = await getParticipantAttendanceHistoryQuery(1);

      expect(result).toEqual(mockHistory);
      expect(runQuery).toHaveBeenCalledWith(
        expect.stringContaining('JOIN workshops w ON a.workshop_id = w.id'),
        [1]
      );
    });
  });
});

describe('Participant format validation (integration with route)', () => {
  // We'll use supertest to simulate HTTP requests if available, otherwise just describe the test logic
  // This is a placeholder for where you would use supertest or similar
  it('should reject invalid email format on creation', async () => {
    // Simulate req.body with invalid email
    const req = { body: { name: 'Test', email: 'invalid-email', phone: '41999999999', type: 'student', ra: '123', cpf: '12345678901' } };
    // You would call the route handler and expect a 400 error
    // Example: await request(app).post('/api/participants').send(req.body).expect(400)
  });
  it('should reject invalid phone format on creation', async () => {
    const req = { body: { name: 'Test', email: 'test@example.com', phone: '99999', type: 'student', ra: '123', cpf: '12345678901' } };
  });
  it('should reject invalid CPF format on creation', async () => {
    const req = { body: { name: 'Test', email: 'test@example.com', phone: '41999999999', type: 'student', ra: '123', cpf: 'abc' } };
  });
  it('should reject invalid email format on update', async () => {
    const req = { body: { email: 'bademail', phone: '41999999999', name: 'Test', type: 'student' } };
  });
  it('should reject invalid phone format on update', async () => {
    const req = { body: { email: 'test@example.com', phone: 'badphone', name: 'Test', type: 'student' } };
  });
}); 