// server.js
require('dotenv').config({ path: './.env' });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');  // Adicionando as rotas de projeto

const app = express();
app.use(express.json());
app.use(cors());

// Conecta ao MongoDB
connectDB();

// Configura as rotas
app.use('/auth', authRoutes);  // Rota de autenticação
app.use('/project', projectRoutes);

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
