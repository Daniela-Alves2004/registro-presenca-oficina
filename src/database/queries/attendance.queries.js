import { runQuery, runSingleQuery, runWriteQuery } from '../db.js';

export const getAllAttendanceQuery = () => {
  return runQuery('SELECT * FROM attendance');
};

export const getAttendanceRecordByIdQuery = (id) => {
  return runSingleQuery('SELECT * FROM attendance WHERE id = ?', [id]);
};

export const createAttendanceRecordsQuery = async (attendanceRecords) => {
  // This function handles the transaction and multiple inserts
  await runWriteQuery('BEGIN TRANSACTION');
  try {
    // Delete any existing attendance records for this workshop and date
    // Assuming all records in the batch are for the same workshop and date
    if (attendanceRecords.length > 0) {
      await runWriteQuery(
        'DELETE FROM attendance WHERE workshop_id = ? AND date = ?',
        [attendanceRecords[0].workshop_id, attendanceRecords[0].date]
      );
    }

    const results = [];
    for (const record of attendanceRecords) {
      const { workshop_id, student_id, date, status, notes } = record;
      // Ensure participant_id is used instead of student_id if the schema uses participant_id
      const result = await runWriteQuery(
        'INSERT INTO attendance (workshop_id, participant_id, date, status, notes) VALUES (?, ?, ?, ?, ?)',
        [workshop_id, student_id, date, status, notes]
      );
      // You might not need to fetch the new record by ID here in the query layer,
      // the route handler can fetch them after the transaction commits if needed.
      // For now, returning basic insert result.
      results.push(result);
    }

    await runWriteQuery('COMMIT');
    return results;
  } catch (err) {
    await runWriteQuery('ROLLBACK');
    throw err;
  }
};

export const updateAttendanceQuery = (id, workshop_id, participant_id, date, status, notes) => {
  return runWriteQuery(
    'UPDATE attendance SET workshop_id=?, participant_id=?, date=?, status=?, notes=? WHERE id=?',
    [workshop_id, participant_id, date, status, notes, id]
  );
};

export const deleteAttendanceQuery = (id) => {
  return runWriteQuery('DELETE FROM attendance WHERE id = ?', [id]);
}; 