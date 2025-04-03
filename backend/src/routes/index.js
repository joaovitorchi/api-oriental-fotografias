const express = require('express');
const router = express.Router();

// Importar todas as rotas
const authRoutes = require('./auth.routes');
const photoRoutes = require('./photo.routes');
const sessionRoutes = require('./session.routes');
const albumRoutes = require('./album.routes');
const instagramRoutes = require('./instagram.routes');
const clientRoutes = require('./client.routes');
const categoryRoutes = require('./category.routes');

// Configurar prefixos para APIs
router.use('/auth', authRoutes);
router.use('/photos', photoRoutes);
router.use('/sessions', sessionRoutes);
router.use('/albums', albumRoutes);
router.use('/instagram', instagramRoutes);
router.use('/clients', clientRoutes);
router.use('/categories', categoryRoutes);

// Rota de health check
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

module.exports = router;