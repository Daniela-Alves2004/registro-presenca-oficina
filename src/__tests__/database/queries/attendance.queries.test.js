import {
  getAllAttendanceQuery,
  getAttendanceRecordByIdQuery,
  createAttendanceRecordsQuery,
  updateAttendanceQuery,
  deleteAttendanceQuery
} from '../../../database/queries/attendance.queries.js';

// Mock the database module
jest.mock('../../../database/db.js', () => ({
  runQuery: jest.fn(),
  runSingleQuery: jest.fn(),
  runWriteQuery: jest.fn()
}));

import { runQuery, runSingleQuery, runWriteQuery } from '../../../database/db.js';

describe('Attendance Queries Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllAttendanceQuery', () => {
    it('should return all attendance records', async () => {
      const mockAttendance = [
        { id: 1, workshop_id: 1, participant_id: 1, date: '2025-01-01', status: 'present' },
        { id: 2, workshop_id: 1, participant_id: 2, date: '2025-01-01', status: 'absent' }
      ];
      runQuery.mockResolvedValue(mockAttendance);

      const result = await getAllAttendanceQuery();

      expect(result).toEqual(mockAttendance);
      expect(runQuery).toHaveBeenCalledWith('SELECT * FROM attendance');
    });
  });

  describe('getAttendanceRecordByIdQuery', () => {
    it('should return a specific attendance record by ID', async () => {
      const mockRecord = { id: 1, workshop_id: 1, participant_id: 1, date: '2025-01-01', status: 'present' };
      runSingleQuery.mockResolvedValue(mockRecord);

      const result = await getAttendanceRecordByIdQuery(1);

      expect(result).toEqual(mockRecord);
      expect(runSingleQuery).toHaveBeenCalledWith('SELECT * FROM attendance WHERE id = ?', [1]);
    });

    it('should return null when attendance record not found', async () => {
      runSingleQuery.mockResolvedValue(null);

      const result = await getAttendanceRecordByIdQuery(999);

      expect(result).toBeNull();
    });
  });

  describe('createAttendanceRecordsQuery', () => {
    it('should create multiple attendance records in a transaction', async () => {
      const mockResults = [
        { id: 1, changes: 1 },
        { id: 2, changes: 1 }
      ];

      runWriteQuery
        .mockResolvedValueOnce() // BEGIN TRANSACTION
        .mockResolvedValueOnce() // DELETE existing records
        .mockResolvedValueOnce(mockResults[0]) // First INSERT
        .mockResolvedValueOnce(mockResults[1]) // Second INSERT
        .mockResolvedValueOnce(); // COMMIT

      const attendanceRecords = [
        {
          workshop_id: 1,
          student_id: 1,
          date: '2025-01-01',
          status: 'present',
          notes: null
        },
        {
          workshop_id: 1,
          student_id: 2,
          date: '2025-01-01',
          status: 'absent',
          notes: 'Sick'
        }
      ];

      const result = await createAttendanceRecordsQuery(attendanceRecords);

      expect(result).toEqual(mockResults);
      expect(runWriteQuery).toHaveBeenCalledWith('BEGIN TRANSACTION');
      expect(runWriteQuery).toHaveBeenCalledWith(
        'DELETE FROM attendance WHERE workshop_id = ? AND date = ?',
        [1, '2025-01-01']
      );
      expect(runWriteQuery).toHaveBeenCalledWith(
        'INSERT INTO attendance (workshop_id, participant_id, date, status, notes) VALUES (?, ?, ?, ?, ?)',
        [1, 1, '2025-01-01', 'present', null]
      );
      expect(runWriteQuery).toHaveBeenCalledWith(
        'INSERT INTO attendance (workshop_id, participant_id, date, status, notes) VALUES (?, ?, ?, ?, ?)',
        [1, 2, '2025-01-01', 'absent', 'Sick']
      );
      expect(runWriteQuery).toHaveBeenCalledWith('COMMIT');
    });

    it('should rollback transaction on error', async () => {
      const mockError = new Error('Database error');
      runWriteQuery
        .mockResolvedValueOnce() // BEGIN TRANSACTION
        .mockRejectedValueOnce(mockError); // DELETE fails

      const attendanceRecords = [
        {
          workshop_id: 1,
          student_id: 1,
          date: '2025-01-01',
          status: 'present',
          notes: null
        }
      ];

      await expect(createAttendanceRecordsQuery(attendanceRecords)).rejects.toThrow('Database error');
      expect(runWriteQuery).toHaveBeenCalledWith('BEGIN TRANSACTION');
      expect(runWriteQuery).toHaveBeenCalledWith('ROLLBACK');
    });

    it('should handle empty attendance records array', async () => {
      runWriteQuery.mockResolvedValue();

      const result = await createAttendanceRecordsQuery([]);

      expect(result).toEqual([]);
      expect(runWriteQuery).toHaveBeenCalledWith('BEGIN TRANSACTION');
      expect(runWriteQuery).toHaveBeenCalledWith('COMMIT');
    });
  });

  describe('updateAttendanceQuery', () => {
    it('should update an existing attendance record', async () => {
      const mockResult = { id: 1, changes: 1 };
      runWriteQuery.mockResolvedValue(mockResult);

      const attendanceData = {
        workshop_id: 1,
        participant_id: 1,
        date: '2025-01-01',
        status: 'absent',
        notes: 'Updated note'
      };

      const result = await updateAttendanceQuery(1, ...Object.values(attendanceData));

      expect(result).toEqual(mockResult);
      expect(runWriteQuery).toHaveBeenCalledWith(
        'UPDATE attendance SET workshop_id=?, participant_id=?, date=?, status=?, notes=? WHERE id=?',
        [...Object.values(attendanceData), 1]
      );
    });
  });

  describe('deleteAttendanceQuery', () => {
    it('should delete an attendance record', async () => {
      const mockResult = { id: 1, changes: 1 };
      runWriteQuery.mockResolvedValue(mockResult);

      const result = await deleteAttendanceQuery(1);

      expect(result).toEqual(mockResult);
      expect(runWriteQuery).toHaveBeenCalledWith('DELETE FROM attendance WHERE id = ?', [1]);
    });
  });
}); 