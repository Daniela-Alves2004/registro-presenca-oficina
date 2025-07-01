import express from 'express';
import { runQuery, runSingleQuery, runWriteQuery } from '../database/db.js';
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
} from '../database/queries/participants.queries.js';

const router = express.Router();

// Listar todos os participantes
router.get('/', async (req, res) => {
  try {
    const participants = await getAllParticipantsQuery();
    res.json(participants);
  } catch (err) {
    console.error('Erro ao buscar participantes:', err);
    res.status(500).json({ error: err.message });
  }
});

// Buscar participante por ID
router.get('/:id', async (req, res) => {
  try {
    const participant = await getParticipantByIdQuery(req.params.id);
    if (!participant) return res.status(404).json({ error: 'Participante não encontrado' });
    res.json(participant);
  } catch (err) {
    console.error('Erro ao buscar participante por ID:', err);
    res.status(500).json({ error: err.message });
  }
});

// Criar novo participante
router.post('/', async (req, res) => {
  const { name, email, phone, type, ra, cpf } = req.body;

  // Validação de campos obrigatórios
  if (!name || !email || !phone || !type || !cpf) {
    return res.status(400).json({ error: 'Campos obrigatórios faltando.' });
  }

  // Validação de formato
  const emailRegex = /^[\w-.]+@[\w-]+\.[a-zA-Z]{2,}$/;
  const phoneRegex = /^\d{10,11}$/; // Ex: 41999999999
  const cpfRegex = /^\d{11}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Formato de email inválido.' });
  }
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ error: 'Formato de telefone inválido. Use apenas números com DDD.' });
  }
  if (!cpfRegex.test(cpf)) {
    return res.status(400).json({ error: 'Formato de CPF inválido. Use apenas 11 dígitos.' });
  }

  try {
    // Verificar se o CPF já existe
    const existingParticipantCPF = await getParticipantByCpfQuery(cpf);
    if (existingParticipantCPF) {
      return res.status(400).json({ error: 'CPF já cadastrado.' });
    }

    // Verificar se o email já existe
    const existingParticipantEmail = await getParticipantByEmailQuery(email);
    if (existingParticipantEmail) {
      return res.status(400).json({ error: 'Email já cadastrado.' });
    }

    const result = await createParticipantQuery(name, email, phone, type, ra, cpf);
    const participant = await getParticipantByIdQuery(result.id);
    res.status(201).json(participant);
  } catch (err) {
    console.error('Erro ao criar participante:', err);
    res.status(500).json({ error: err.message });
  }
});

// Atualizar participante
router.put('/:id', async (req, res) => {
  const { name, email, phone, type } = req.body;

  // Validação de formato (apenas se os campos forem enviados)
  const emailRegex = /^[\w-.]+@[\w-]+\.[a-zA-Z]{2,}$/;
  const phoneRegex = /^\d{10,11}$/;
  if (email && !emailRegex.test(email)) {
    return res.status(400).json({ error: 'Formato de email inválido.' });
  }
  if (phone && !phoneRegex.test(phone)) {
    return res.status(400).json({ error: 'Formato de telefone inválido. Use apenas números com DDD.' });
  }

  try {
    await updateParticipantQuery(req.params.id, name, email, phone, type);
    const participant = await getParticipantByIdQuery(req.params.id);
    res.json(participant);
  } catch (err) {
    console.error('Erro ao atualizar participante:', err);
    res.status(500).json({ error: err.message });
  }
});

// Deletar participante (agora desativar)
router.delete('/:id', async (req, res) => {
  try {
    // Check if participant exists
    const participant = await getParticipantByIdQuery(req.params.id);
    if (!participant) {
      return res.status(404).json({ error: 'Participante não encontrado' });
    }

    // Check if participant is an instructor in any workshop
    const instructorWorkshops = await getInstructorWorkshopsQuery(req.params.id);
    if (instructorWorkshops.length > 0) {
      return res.status(400).json({
        error: 'Não é possível excluir este participante pois ele é instrutor de uma ou mais oficinas',
        workshops: instructorWorkshops
      });
    }

    // Mark as inactive
    const result = await deactivateParticipantQuery(req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Participante não encontrado' });
    }

    res.status(204).end();
  } catch (err) {
    console.error('Erro ao desativar participante:', err);
    res.status(500).json({
      error: 'Erro ao desativar participante',
      details: err.message,
      code: err.code
    });
  }
});

// Buscar estatísticas de presença do participante
router.get('/:id/attendance-stats', async (req, res) => {
  try {
    const participantId = req.params.id;
    const stats = await getParticipantAttendanceStatsQuery(participantId);
    res.json({
      total_classes: stats.total_classes || 0,
      presences: stats.presences || 0,
      absences: stats.absences || 0,
      attendance_percentage: stats.total_classes
        ? Math.round((stats.presences / stats.total_classes) * 100)
        : 0
    });
  } catch (err) {
    console.error('Erro ao buscar estatísticas de presença:', err);
    res.status(500).json({ error: err.message });
  }
});

// Buscar histórico detalhado de presenças do participante
router.get('/:id/attendance-history', async (req, res) => {
  try {
    const participantId = req.params.id;
    const history = await getParticipantAttendanceHistoryQuery(participantId);
    res.json(history);
  } catch (err) {
    console.error('Erro ao buscar histórico de presenças:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router; 