import express from 'express';
import { runQuery, runSingleQuery, runWriteQuery } from '../database/db.js';
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
} from '../database/queries/workshops.queries.js';

const router = express.Router();

// Listar todas as oficinas
router.get('/', async (req, res) => {
  try {
    const workshops = await getAllWorkshops();
    res.json(workshops);
  } catch (err) {
    console.error('Erro ao buscar oficinas:', err);
    res.status(500).json({ error: err.message });
  }
});

// Buscar oficina por ID
router.get('/:id', async (req, res) => {
  try {
    const workshop = await getWorkshopById(req.params.id);
    if (!workshop) return res.status(404).json({ error: 'Oficina não encontrada' });
    res.json(workshop);
  } catch (err) {
    console.error('Erro ao buscar oficina por ID:', err);
    res.status(500).json({ error: err.message });
  }
});

// Criar nova oficina
router.post('/', async (req, res) => {
  const { name, instructor_id, schedule, status, start_date, end_date } = req.body;
  try {
    const result = await createWorkshopQuery(name, instructor_id, schedule, status || 'active', start_date, end_date);
    const workshop = await getWorkshopById(result.id);
    res.status(201).json(workshop);
  } catch (err) {
    console.error('Erro ao criar oficina:', err);
    res.status(500).json({ error: err.message });
  }
});

// Atualizar oficina
router.put('/:id', async (req, res) => {
  const { name, instructor_id, schedule, status, start_date, end_date } = req.body;
  try {
    await updateWorkshopQuery(req.params.id, name, instructor_id, schedule, status, start_date, end_date);
    const workshop = await getWorkshopById(req.params.id);
    res.json(workshop);
  } catch (err) {
    console.error('Erro ao atualizar oficina:', err);
    res.status(500).json({ error: err.message });
  }
});

// Deletar oficina (agora desativar)
router.delete('/:id', async (req, res) => {
  try {
    const result = await updateWorkshopStatusQuery(req.params.id, 'finished');

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Oficina não encontrada' });
    }

    res.status(204).end();
  } catch (err) {
    console.error('Erro ao desativar oficina:', err);
    res.status(500).json({ error: err.message });
  }
});

// Listar participantes de uma oficina
router.get('/:id/participants', async (req, res) => {
  try {
    const participants = await getWorkshopParticipantsQuery(req.params.id);
    res.json(participants);
  } catch (err) {
    console.error('Erro ao buscar participantes da oficina:', err);
    res.status(500).json({ error: err.message });
  }
});

// Listar presenças de uma oficina
router.get('/:id/attendance', async (req, res) => {
  try {
    const attendance = await getWorkshopAttendanceQuery(req.params.id);
    res.json(attendance);
  } catch (err) {
    console.error('Erro ao buscar presenças da oficina:', err);
    res.status(500).json({ error: err.message });
  }
});

// Atualizar status da oficina
router.put('/:id/status', async (req, res) => {
  const { status } = req.body;
  try {
    if (!['active', 'finished'].includes(status)) {
      return res.status(400).json({ error: 'Status inválido. Use "active" ou "finished"' });
    }

    await updateWorkshopStatusQuery(req.params.id, status);

    const workshop = await getWorkshopById(req.params.id);

    if (!workshop) {
      return res.status(404).json({ error: 'Oficina não encontrada' });
    }

    res.json(workshop);
  } catch (err) {
    console.error('Erro ao atualizar status da oficina:', err);
    res.status(500).json({ error: err.message });
  }
});

// Adicionar participante à oficina
router.post('/:id/participants', async (req, res) => {
  const { participant_id } = req.body;
  try {
    const participant = await runSingleQuery(
      'SELECT * FROM participants WHERE id = ? AND type = ? AND status = ?',
      [participant_id, 'student', 'active']
    );

    if (!participant) {
      return res.status(404).json({ error: 'Aluno não encontrado ou não está ativo' });
    }

    const existingParticipant = await runSingleQuery(
      'SELECT * FROM workshop_participants WHERE workshop_id = ? AND participant_id = ?',
      [req.params.id, participant_id]
    );

    if (existingParticipant) {
      return res.status(400).json({ error: 'Aluno já está inscrito nesta oficina' });
    }

    await addWorkshopParticipantQuery(req.params.id, participant_id);

    res.status(201).json({ message: 'Aluno adicionado com sucesso' });
  } catch (err) {
    console.error('Erro ao adicionar participante à oficina:', err);
    res.status(500).json({ error: err.message });
  }
});

// Remover participante da oficina
router.delete('/:id/participants/:participantId', async (req, res) => {
  try {
    const result = await removeWorkshopParticipantQuery(req.params.id, req.params.participantId);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Participante não encontrado na oficina' });
    }

    res.status(204).end();
  } catch (err) {
    console.error('Erro ao remover participante da oficina:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router; 