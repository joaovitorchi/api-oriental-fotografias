const express = require('express');
const app = express();

// Importar middlewares
const errorHandler = require('./middlewares/error.middleware');
const loggerMiddleware = require('./middlewares/logger.middleware');
const authMiddleware = require('./middlewares/auth.middleware');
const validatorMiddleware = require('./middlewares/validator.middleware');
const corsMiddleware = require('./middlewares/cors.middleware');
const compressionMiddleware = require('./middlewares/compression.middleware');

// Aplicar middlewares globais
app.use(express.json());
app.use(corsMiddleware());
app.use(compressionMiddleware());
app.use(loggerMiddleware());

// Rotas com autenticação
app.use('/api', authMiddleware(), require('./routes'));

// Middleware de erro (deve ser o último)
app.use(errorHandler);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});