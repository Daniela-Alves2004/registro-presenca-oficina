import { runQuery, runSingleQuery, runWriteQuery } from '../db.js';

export const getAllWorkshops = () => {
  return runQuery(`
    SELECT w.*, p.name as instructor_name 
    FROM workshops w
    JOIN participants p ON w.instructor_id = p.id
  `);
};

export const getWorkshopById = (id) => {
  return runSingleQuery(`
    SELECT w.*, p.name as instructor_name 
    FROM workshops w
    JOIN participants p ON w.instructor_id = p.id
    WHERE w.id = ?
  `, [id]);
};

export const createWorkshopQuery = (name, instructor_id, schedule, status, start_date, end_date) => {
  return runWriteQuery(
    'INSERT INTO workshops (name, instructor_id, schedule, status, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)',
    [name, instructor_id, schedule, status, start_date, end_date]
  );
};

export const updateWorkshopQuery = (id, name, instructor_id, schedule, status, start_date, end_date) => {
  return runWriteQuery(
    'UPDATE workshops SET name=?, instructor_id=?, schedule=?, status=?, start_date=?, end_date=? WHERE id=?',
    [name, instructor_id, schedule, status, start_date, end_date, id]
  );
};

export const updateWorkshopStatusQuery = (id, status) => {
  return runWriteQuery(
    'UPDATE workshops SET status = ? WHERE id = ?',
    [status, id]
  );
};

export const getWorkshopParticipantsQuery = (id) => {
  return runQuery(`
    SELECT p.* 
    FROM participants p
    JOIN workshop_participants wp ON p.id = wp.participant_id
    WHERE wp.workshop_id = ? AND p.type = 'student'
  `, [id]);
};

export const getWorkshopAttendanceQuery = (id) => {
  return runQuery(`
    SELECT a.*, p.name as participant_name, p.email, p.phone 
    FROM attendance a
    JOIN participants p ON a.participant_id = p.id
    WHERE a.workshop_id = ?
    ORDER BY a.date DESC
  `, [id]);
};

export const addWorkshopParticipantQuery = (workshopId, participantId) => {
  return runWriteQuery(
    'INSERT INTO workshop_participants (workshop_id, participant_id) VALUES (?, ?)',
    [workshopId, participantId]
  );
};

export const removeWorkshopParticipantQuery = (workshopId, participantId) => {
  return runWriteQuery(
    'DELETE FROM workshop_participants WHERE workshop_id = ? AND participant_id = ?',
    [workshopId, participantId]
  );
}; 