const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

router.post('/criarProjetoLista', projectController.criarProjetoLista);
router.post('/criarProjetoDocumento',  projectController.criarProjetoDocumentoTexto);
router.get('/obterProjetos', projectController.obterProjetos);
router.get('/projetosListas', projectController.obterProjetosListas);
router.get('/projetosDocumentos', projectController.obterProjetosDocumentos);
router.get('/projetosFavoritados', projectController.obterProjetosFavoritados);
router.get('/projetosLixeira', projectController.obterProjetosLixeira);
router.patch('/edicaoProjeto', projectController.edicaoProjeto) 
router.patch('/atualizarProjeto/:id', projectController.atualizarProjeto);
router.put('/favoritar/:id', projectController.favoritarProjeto);
router.put('/lixeira/:id', projectController.moverParaLixeira);
router.get('/buscarProjetos', projectController.buscarProjetos);
router.delete('/excluir/:id', projectController.excluirProjeto);

module.exports = router;
