const mongoose = require('mongoose');

const ProjetoSchema = new mongoose.Schema({
    usuario: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: false, // Pode ser opcional
    },
    nome: { type: String, required: true },
    tipo: { type: String, required: true }, // Ex: 'documento' ou 'lista'
    conteudo: { type: String, required: false }, // Conteúdo do documento (opcional)
    tarefas: [
        {
            descricao: { type: String, required: true },
            concluida: { type: Boolean, default: false },
        },
    ],
    favoritado: { type: Boolean, default: false }, // Adiciona a opção de favoritar
     
    lixeira: { type: Boolean, default: false }, // Adiciona a opção de mandar para a lixeira
    atualizadoEm: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Projeto', ProjetoSchema);
