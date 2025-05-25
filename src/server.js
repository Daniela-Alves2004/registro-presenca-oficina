import express from 'express';
import cors from 'cors';
import workshopsRouter from './routes/workshops.js';
import participantsRouter from './routes/participants.js';
import attendanceRouter from './routes/attendance.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/workshops', workshopsRouter);
app.use('/api/participants', participantsRouter);
app.use('/api/attendance', attendanceRouter);

// Iniciar servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
}); 