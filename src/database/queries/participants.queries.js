import { runQuery, runSingleQuery, runWriteQuery } from '../db.js';

export const getAllParticipantsQuery = () => {
  return runQuery('SELECT * FROM participants WHERE status = ?', ['active']);
};

export const getParticipantByIdQuery = (id) => {
  return runSingleQuery('SELECT * FROM participants WHERE id = ?', [id]);
};

export const createParticipantQuery = (name, email, phone, type, ra, cpf) => {
  return runWriteQuery(
    'INSERT INTO participants (name, email, phone, type, ra, cpf) VALUES (?, ?, ?, ?, ?, ?)',
    [name, email, phone, type, ra || null, cpf]
  );
};

export const updateParticipantQuery = (id, name, email, phone, type) => {
  return runWriteQuery(
    'UPDATE participants SET name=?, email=?, phone=?, type=? WHERE id=?',
    [name, email, phone, type, id]
  );
};

export const deactivateParticipantQuery = (id) => {
  return runWriteQuery(
    'UPDATE participants SET status = ? WHERE id = ?',
    ['inactive', id]
  );
};

export const getParticipantByCpfQuery = (cpf) => {
  return runSingleQuery(
    'SELECT id FROM participants WHERE cpf = ?',
    [cpf]
  );
};

export const getParticipantByEmailQuery = (email) => {
  return runSingleQuery(
    'SELECT id FROM participants WHERE email = ?',
    [email]
  );
};

export const getInstructorWorkshopsQuery = (instructorId) => {
  return runQuery(
    'SELECT id, name FROM workshops WHERE instructor_id = ?',
    [instructorId]
  );
};

export const getParticipantAttendanceStatsQuery = (participantId) => {
  return runSingleQuery(`
    SELECT 
      COUNT(*) as total_classes,
      SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as presences,
      SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) as absences
    FROM attendance 
    WHERE participant_id = ?
  `, [participantId]);
};

export const getParticipantAttendanceHistoryQuery = (participantId) => {
  return runQuery(`
    SELECT 
      a.id,
      w.name as workshop_name,
      a.date,
      a.status,
      a.notes
    FROM attendance a
    JOIN workshops w ON a.workshop_id = w.id
    WHERE a.participant_id = ?
    ORDER BY a.date DESC
  `, [participantId]);
}; 