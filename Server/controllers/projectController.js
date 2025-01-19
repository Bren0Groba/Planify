const Projeto = require('../Models/project');

// funcão para cuscar prjts



// Função para criar um projeto de lista


const criarProjetoLista = async (req, res) => {
    try {
        const { usuario, nome, tipo, tarefas } = req.body;

        // Verifique os dados recebidos no console
        console.log('Dados recebidos no backend:', tarefas);

        // Garantir que cada tarefa tenha a propriedade 'concluida' (caso não tenha, coloca como false)
        tarefas.forEach(tarefa => {
            if (tarefa.concluida === undefined) {
                tarefa.concluida = false; // Define como false caso não tenha valor
            }
        });

        // Lógica para criar o projeto
        const novoProjeto = new Projeto({
            usuario,
            nome,
            tipo,
            tarefas,
        });

        await novoProjeto.save(); // Salvar no banco de dados

        return res.status(201).json(novoProjeto); // Envia a resposta de sucesso
    } catch (error) {
        console.error("Erro ao criar projeto:", error);
        return res.status(500).json({ error: 'Erro ao criar o projeto.' });
    }
};





const criarProjetoDocumentoTexto = async (req, res) => {
    try {
        const { nome, conteudo, usuario } = req.body;

        console.log('Dados recebidos no body:', req.body); // Log para verificar os dados recebidos

        // Validação
        if (!nome || !conteudo || conteudo.trim() === '') {
            console.error('Erro de validação: Nome ou conteúdo ausentes.');
            return res.status(400).json({ error: 'Nome e conteúdo são obrigatórios.' });
        }

        // Verificar se o usuário está autenticado
        if (!usuario) {
            console.error('Erro de validação: Usuário não autenticado.');
            return res.status(400).json({ error: 'Usuário não autenticado.' });
        }

        // Criação do projeto de documento
        const novoProjeto = new Projeto({
            usuario, // Associar ao usuário autenticado
            nome,
            tipo: 'documento',
            conteudo, // Conteúdo do documento de texto
        });

        await novoProjeto.save();
        console.log('Projeto de documento criado com sucesso:', novoProjeto);

        res.status(201).json({ message: 'Projeto de documento criado com sucesso!', projeto: novoProjeto });
    } catch (error) {
        console.error('Erro ao criar projeto de documento:', error.message);
        res.status(500).json({ error: 'Erro ao criar projeto de documento.' });
    }
};





const obterProjetosFavoritados = async (req, res) => {
    try {
        const { usuarioId } = req.query;

        if (!usuarioId) {
            return res.status(400).json({ error: 'ID do usuário não fornecido.' });
        }

        // Filtra projetos que não estão arquivados nem na lixeira
        const projetos = await Projeto.find({
            usuario: usuarioId,
            lixeira: false,
            favoritado: true
        });

        if (projetos.length === 0) {
            console.log('Nenhum projeto favoritado encontrado.');
        }

        res.status(200).json(projetos);
    } catch (error) {
        console.error('Erro ao buscar projetos Favoritados:', error.message);
        res.status(500).json({ error: 'Erro ao buscar projetos Favoritados.' });
    }
}

const obterProjetosLixeira = async (req, res) => {
    try {
        const { usuarioId } = req.query;

        if (!usuarioId) {
            return res.status(400).json({ error: 'ID do usuário não fornecido.' });
        }

        // Filtra projetos que estão na lixeira
        const projetos = await Projeto.find({
            usuario: usuarioId,
            lixeira: true,
        });

        if (projetos.length === 0) {
            console.log('Nenhum projeto encontrado na lixeira.');
        }

        res.status(200).json(projetos);
    } catch (error) {
        console.error('Erro ao buscar projetos Lixeira:', error.message);
        res.status(500).json({ error: 'Erro ao buscar projetos Lixeira.' });
    }
}

const obterProjetosDocumentos = async (req, res) => {
    try {
        const { usuarioId } = req.query;

        if (!usuarioId) {
            return res.status(400).json({ error: 'ID do usuário não fornecido.' });
        }

        // Filtra projetos do tipo "documento" que não estão na lixeira
        const projetos = await Projeto.find({
            usuario: usuarioId,
            lixeira: false,
            tipo: "documento"
        });

        if (projetos.length === 0) {
            console.log('Nenhum projeto do tipo "documento" encontrado.');
        }

        res.status(200).json(projetos);
    } catch (error) {
        console.error('Erro ao buscar projetos do tipo "documento":', error.message);
        res.status(500).json({ error: 'Erro ao buscar projetos.' });
    }
}

const obterProjetosListas = async (req, res) => {
    try {
        const { usuarioId } = req.query;

        if (!usuarioId) {
            return res.status(400).json({ error: 'ID do usuário não fornecido.' });
        }

        // Filtra projetos do tipo "lista" que não estão na lixeira
        const projetos = await Projeto.find({
            usuario: usuarioId,
            tipo: "lista",
            lixeira: false,
        });

        if (projetos.length === 0) {
            console.log('Nenhum projeto do tipo "lista" encontrado.');
        }

        res.status(200).json(projetos);
    } catch (error) {
        console.error('Erro ao buscar projetos do tipo "lista":', error.message);
        res.status(500).json({ error: 'Erro ao buscar projetos.' });
    }
}

const obterProjetos = async (req, res) => {
    try {
        const { usuarioId } = req.query;

        if (!usuarioId) {
            return res.status(400).json({ error: 'ID do usuário não fornecido.' });
        }

        // Filtra projetos que não estão arquivados nem na lixeira
        const projetos = await Projeto.find({
            usuario: usuarioId,
            lixeira: false,
        });

        if (projetos.length === 0) {
            console.log('Nenhum projeto encontrado para o usuário.');
        }

        res.status(200).json(projetos);
    } catch (error) {
        console.error('Erro ao buscar projetos:', error.message);
        res.status(500).json({ error: 'Erro ao buscar projetos.' });
    }
}

// Função para alternar o status de favorito do projeto
const favoritarProjeto = async (req, res) => {
    const { id } = req.params; // Este é o _id do MongoDB
    console.log('Favoritando projeto com ID:', id);

    try {
        const projeto = await Projeto.findById(id);
        if (!projeto) {
            return res.status(404).json({ message: 'Projeto não encontrado' });
        }

        projeto.favoritado = !projeto.favoritado;
        projeto.atualizadoEm = Date.now();
        await projeto.save();

        res.status(200).json({ message: 'Status de favorito atualizado', projeto });
    } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};


// Função para arquivar um projeto


// Função para mover um projeto para a lixeira
const mongoose = require('mongoose');

const moverParaLixeira = async (req, res) => {
    console.log("API de lixeira carregada");

    try {
        const { id } = req.params;
        console.log('Movendo projeto para a lixeira com ID:', id);

        // Verifica se o ID é válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.error('ID inválido:', id);
            return res.status(400).json({ message: 'ID inválido' });
        }

        // Busca o projeto pelo ID
        const projeto = await Projeto.findById(id);
        if (!projeto) {
            console.error('Projeto não encontrado para mover para a lixeira:', id);
            return res.status(404).json({ message: 'Projeto não encontrado' });
        }

        // Atualiza o campo "lixeira" e salva
        projeto.lixeira = !projeto.lixeira;
        projeto.atualizadoEm = Date.now();
        await projeto.save();

        console.log('Projeto movido para a lixeira com sucesso:', projeto);
        return res.status(200).json({ message: 'Projeto movido para a lixeira', projeto });
    } catch (error) {
        console.error('Erro ao mover projeto para lixeira:', {
            message: error.message,
            stack: error.stack,
            id,
        });
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

const atualizarProjeto = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, conteudo, tarefas } = req.body;

        // Verificar se pelo menos um campo foi enviado
        if (!nome && !conteudo && !tarefas) {
            return res.status(400).json({ message: 'Nenhum dado para atualizar foi fornecido.' });
        }

        // Buscar o projeto pelo ID
        const projeto = await Projeto.findById(id);
        if (!projeto) {
            return res.status(404).json({ message: 'Projeto não encontrado' });
        }

        // Atualizar apenas os campos fornecidos
        if (nome) projeto.nome = nome;
        if (conteudo !== undefined) projeto.conteudo = conteudo; // Pode ser vazio em alguns casos
        if (tarefas !== undefined) projeto.tarefas = tarefas; // Pode ser um array vazio ou um valor

        // Atualizar a data de modificação
        projeto.atualizadoEm = Date.now();

        // Salvar o projeto atualizado no banco de dados
        await projeto.save();

        // Resposta de sucesso
        res.status(200).json({ message: 'Projeto atualizado com sucesso', projeto });
    } catch (error) {
        console.error('Erro ao atualizar projeto:', error.message);
        res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
    }
};



// Função para fcluir permanentemente um projeto
const excluirProjeto = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Excluindo projeto com ID:', id);

        const projeto = await Projeto.findById(id);

        if (!projeto) {
            console.error('Projeto não encontrado para excluir:', id);
            return res.status(404).json({ message: 'Projeto não encontrado' });
        }

        // Remove a verificação da lixeira
        await Projeto.findByIdAndDelete(id);

        console.log('Projeto excluído permanentemente:', id);
        res.status(200).json({ message: 'Projeto excluído permanentemente' });
    } catch (error) {
        console.error('Erro ao excluir projeto:', error.message);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};


const buscarProjetos = async (req, res) => {
    console.log('Requisição recebida:', req.query); // Verifique os parâmetros

    try {
        const { query, usuario } = req.query;
        if (!query || query.length < 3) {
            return res.status(400).json({ error: 'A consulta deve ter pelo menos 3 caracteres' });
        }

        // Aqui deve vir sua lógica de busca
        const projetos = await Projeto.find({
            nome: { $regex: query, $options: 'i' },
            usuario: usuario,
        });

        if (projetos.length === 0) {
            return res.status(404).json({ message: 'Nenhum projeto encontrado' });
        }

        return res.status(200).json(projetos);
    } catch (error) {
        console.error('Erro ao buscar projetos:', error);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

// controller.js
 // Supondo que você tenha um modelo de projeto no MongoDB

// Função para buscar o projeto pelo ID
const edicaoProjeto = async (req, res) => {
    const { id } = req.params;  // Obtém o ID do projeto da URL

    try {
        // Busca o projeto no banco de dados
        const projeto = await Projeto.findById(id);

        if (!projeto) {
            return res.status(404).json({ message: 'Projeto não encontrado' });
        }

        // Verifica o tipo do projeto e retorna os dados apropriados
        if (projeto.tipo === 'lista') {
            res.json({
                nome: projeto.nome,
                tipo: projeto.tipo,
                tarefas: projeto.tarefas,  // Retorna as tarefas se for um projeto de lista
            });
        } else if (projeto.tipo === 'documento') {
            res.json({
                nome: projeto.nome,
                tipo: projeto.tipo,
                conteudo: projeto.conteudo,  // Retorna o conteúdo se for um projeto de documento
            });
        } else {
            res.status(400).json({ message: 'Tipo de projeto inválido' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar o projeto' });
    }
};



module.exports = {
    edicaoProjeto,
    atualizarProjeto,
    buscarProjetos,
    obterProjetosListas,obterProjetosLixeira,
    obterProjetosDocumentos,
    obterProjetos,obterProjetosFavoritados,
    criarProjetoDocumentoTexto, 
    criarProjetoLista,
    favoritarProjeto,
    moverParaLixeira,
    excluirProjeto,
};
