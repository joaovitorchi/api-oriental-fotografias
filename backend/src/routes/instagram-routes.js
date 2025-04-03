const express = require('express');
const router = express.Router();
const instagramController = require('../controllers/instagram.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Rotas públicas (feed integrado)
router.get('/feed', instagramController.getPublicFeed);

// Rotas de autenticação OAuth
router.get('/auth', instagramController.startAuth);
router.get('/auth/callback', instagramController.handleCallback);

// Rotas autenticadas para administração
router.get(
  '/admin/feed', 
  authMiddleware(),
  instagramController.getAdminFeed
);

router.post(
  '/sync', 
  authMiddleware(),
  instagramController.syncPosts
);

router.patch(
  '/posts/:id', 
  authMiddleware(),
  instagramController.togglePostVisibility
);

module.exports = router;