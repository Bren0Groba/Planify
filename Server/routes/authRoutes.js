// routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authController'); // Importando o controlador antes de usá-lo

const router = express.Router();

// Definindo as rotas
// Usando a função corretamente agora

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/esqueci-senha', authController.sendVerificationCode);
router.post('/verificar-codigo', authController.verifyCode);
router.post('/checkEmailExists', authController.checkEmailExists);
router.post('/alterarSenha', authController.alterarSenha);


module.exports = router;
