import { createParticipantQuery } from '../../database/queries/participants.queries.js';
import { createWorkshopQuery, addWorkshopParticipantQuery } from '../../database/queries/workshops.queries.js';
import { createAttendanceRecordsQuery } from '../../database/queries/attendance.queries.js';

// Mock the database module
jest.mock('../../database/db.js', () => ({
  runQuery: jest.fn(),
  runSingleQuery: jest.fn(),
  runWriteQuery: jest.fn()
}));

import { runQuery, runSingleQuery, runWriteQuery } from '../../database/db.js';

describe('Integration: Participant-Workshop-Attendance Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a participant, a workshop, add the participant, and record attendance', async () => {
    // 1. Create participant
    const participantData = {
      name: 'Integration Test',
      email: 'integration@example.com',
      phone: '41999999999',
      type: 'student',
      ra: '1234567',
      cpf: '12345678901'
    };
    const participantResult = { id: 10, changes: 1 };
    runWriteQuery.mockResolvedValueOnce(participantResult); // createParticipantQuery

    const createdParticipant = await createParticipantQuery(
      participantData.name,
      participantData.email,
      participantData.phone,
      participantData.type,
      participantData.ra,
      participantData.cpf
    );
    expect(createdParticipant).toEqual(participantResult);

    // 2. Create workshop
    const workshopData = {
      name: 'Integration Workshop',
      instructor_id: 1,
      schedule: 'Monday 10:00-12:00',
      status: 'active',
      start_date: '2025-01-01',
      end_date: '2025-02-01'
    };
    const workshopResult = { id: 20, changes: 1 };
    runWriteQuery.mockResolvedValueOnce(workshopResult); // createWorkshopQuery

    const createdWorkshop = await createWorkshopQuery(
      workshopData.name,
      workshopData.instructor_id,
      workshopData.schedule,
      workshopData.status,
      workshopData.start_date,
      workshopData.end_date
    );
    expect(createdWorkshop).toEqual(workshopResult);

    // 3. Add participant to workshop
    const addResult = { id: 1, changes: 1 };
    runWriteQuery.mockResolvedValueOnce(addResult); // addWorkshopParticipantQuery

    const added = await addWorkshopParticipantQuery(workshopResult.id, participantResult.id);
    expect(added).toEqual(addResult);

    // 4. Record attendance
    runWriteQuery.mockResolvedValueOnce(); // BEGIN TRANSACTION
    runWriteQuery.mockResolvedValueOnce(); // DELETE existing records
    runWriteQuery.mockResolvedValueOnce({ id: 100, changes: 1 }); // INSERT attendance
    runWriteQuery.mockResolvedValueOnce(); // COMMIT

    const attendanceRecords = [
      {
        workshop_id: workshopResult.id,
        student_id: participantResult.id,
        date: '2025-01-10',
        status: 'present',
        notes: null
      }
    ];
    const attendanceResult = await createAttendanceRecordsQuery(attendanceRecords);
    expect(attendanceResult).toEqual([{ id: 100, changes: 1 }]);
  });
}); 