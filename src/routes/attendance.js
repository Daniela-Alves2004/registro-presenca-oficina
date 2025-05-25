import express from 'express';
import { runQuery, runSingleQuery, runWriteQuery } from '../database/db.js';
import {
  getAllAttendanceQuery,
  getAttendanceRecordByIdQuery,
  createAttendanceRecordsQuery,
  updateAttendanceQuery,
  deleteAttendanceQuery
} from '../database/queries/attendance.queries.js';

const router = express.Router();

// Listar todas as presenças
router.get('/', async (req, res) => {
  try {
    const attendance = await getAllAttendanceQuery();
    res.json(attendance);
  } catch (err) {
    console.error('Erro ao buscar todos os registros de presença:', err);
    res.status(500).json({ error: err.message });
  }
});

// Buscar presença por ID
router.get('/:id', async (req, res) => {
  try {
    const record = await getAttendanceRecordByIdQuery(req.params.id);
    if (!record) return res.status(404).json({ error: 'Registro de presença não encontrado' });
    res.json(record);
  } catch (err) {
    console.error('Erro ao buscar registro de presença por ID:', err);
    res.status(500).json({ error: err.message });
  }
});

// Criar nova presença
router.post('/', async (req, res) => {
  try {
    const attendanceRecords = req.body;
    if (!Array.isArray(attendanceRecords) || attendanceRecords.length === 0) {
        return res.status(400).json({ error: 'Request body must be a non-empty array of attendance records.' });
    }

    const results = await createAttendanceRecordsQuery(attendanceRecords);
    res.status(201).json(results);

  } catch (err) {
    console.error('Erro ao criar registros de presença:', err);
    res.status(500).json({ error: err.message });
  }
});

// Atualizar presença
router.put('/:id', async (req, res) => {
  const { workshop_id, student_id, date, status, notes } = req.body;
  try {
    await updateAttendanceQuery(req.params.id, workshop_id, student_id, date, status, notes);
    const record = await getAttendanceRecordByIdQuery(req.params.id);
    res.json(record);
  } catch (err) {
    console.error('Erro ao atualizar registro de presença:', err);
    res.status(500).json({ error: err.message });
  }
});

// Deletar presença
router.delete('/:id', async (req, res) => {
  try {
    const result = await deleteAttendanceQuery(req.params.id);
     if (result.changes === 0) {
      return res.status(404).json({ error: 'Registro de presença não encontrado' });
    }
    res.status(204).end();
  } catch (err) {
    console.error('Erro ao deletar registro de presença:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router; 