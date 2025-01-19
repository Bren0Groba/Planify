
document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM content loaded");
  
    
    const btnFechar = document.getElementById('btnfechar');
    const btnCancelar = document.getElementById('btnCancelar');
    const btnFecharLista = document.getElementById('btnFecharLista');
    const modalAdicionarProjeto = document.getElementById('modalAdicionarProjeto');
    const modalLista = document.getElementById('modalLista');
    const modalDocumento = document.getElementById('modalDocumento');
    const btnCriarProjeto = document.getElementById('btnCriarProjeto');
    const btnCriarProjetoLista = document.getElementById('btnCriarProjetoLista');
    const addProject = document.getElementById('addProject');
    const filterButton = document.getElementById('filterButton');
    const menu = document.getElementById('menu');
    const submenu = document.getElementById('submenu');
    const btnAdicionar = document.getElementById('btnAdicionar')
    const tarefasLista = document.getElementById('tarefasLista');
    const descricaoInput = document.getElementById('descricaoInput');
    const btnCancelarDocumento = document.getElementById('btnCancelarDocumento');
    const btnFazerDownloadDocumento = document.getElementById('btnFazerDownloadDocumento');
    const modalFormato = document.getElementById('modalFormato');
    const btnConfirmarFormato = document.getElementById('btnConfirmarFormato');
    const btnFecharFormato = document.getElementById('btnFecharFormato');
    const downloadFormatInputs = document.getElementsByName('downloadFormat');
    const btnSair = document.getElementById('btnSair');

    const btnCancelarFormato = document.getElementById('btnCancelarFormato');
    btnCancelarFormato.addEventListener('click', ()=>{
    modalFormato.style.display = 'none';
    })

    btnSair.addEventListener('click', ()=>{
        localStorage.removeItem('userId');  // Remove o ID do usuário do localStorage
        window.location.href = '../../login/login.html'; 
    })

    function showBottomNotification(message, isError = false) {
        const notification = document.getElementById('bottom-notification');
        const messageElement = document.getElementById('bottom-notification-message');
        
        if (!notification || !messageElement) {
            console.error('Elemento de notificação não encontrado no DOM.');
            return;
        }
    
        // Define o texto da mensagem
        messageElement.textContent = message;
    
        // Ajusta a cor com base no tipo de mensagem
        notification.style.backgroundColor = isError ? '#f44336' : '#4CAF50';
    
        // Exibe a notificação
        notification.classList.remove('hidden');
        notification.classList.add('show');
    
        // Fecha a notificação ao clicar no botão
        document.getElementById('close-bottom-notification').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => notification.classList.add('hidden'), 300); // Aguarda a transição
        });
    
        // Auto-esconde a notificação após 5 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.classList.add('hidden'), 300);
        }, 5000);
    }
    
   
    const userId = localStorage.getItem('userId');
    
    // Função assíncrona para carregar os projetos
    // Função executarAcao fora de qualquer evento
    async function executarAcao(acao, projeto) {
    try {
        let url = '';
        let metodo = 'PUT';

        // Define a URL da API com base na ação
        if (acao === 'favoritar' || acao === 'desfavoritar') {
            url = `http://localhost:3000/project/favoritar/${projeto._id}`;
        } else if (acao === 'moverParaLixeira') {
            url = `http://localhost:3000/project/lixeira/${projeto._id}`;
        } else if (acao === 'removerDaLixeira') {
            url = `http://localhost:3000/project/lixeira/${projeto._id}`;
            metodo = 'PUT'; // Mudança de status, não exclusão
        } else if (acao === 'excluir') {
            url = `http://localhost:3000/project/excluir/${projeto._id}`;
            metodo = 'DELETE'; // Exclusão do projeto
        }

        console.log('URL:', url);  // Verifique se a URL está correta

        // Faz a chamada para a API
        const response = await fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
        });

        // Verifique o status da resposta
        if (!response.ok) {
            throw new Error(`Erro na ação ${acao}: ${response.status} - ${response.statusText}`);
        }

        const resultado = await response.json();
        console.log(`Ação ${acao} executada com sucesso:`, resultado);

        // Atualiza a interface com base na ação
        if (acao === 'favoritar' || acao === 'desfavoritar') {
            projeto.favoritado = !projeto.favoritado;
        } else if (acao === 'moverParaLixeira') {
            carregarProjetos();
        } else if (acao === 'removerDaLixeira' || acao === 'excluir') {
            carregarProjetos();
        }

        if (acao === 'favoritar'){
            showBottomNotification(`Projeto "${ projeto.nome}" favoritado com sucesso!`, false);
        }
        if (acao === 'desfavoritar'){
            showBottomNotification(`Projeto "${ projeto.nome}" desfavoritado com sucesso!`, false);
        }
        if (acao === 'moverParaLixeira'){
            showBottomNotification(`Projeto "${ projeto.nome}" movido para a lixeira!`, false);
        }
        if (acao === 'excluir'){
            showBottomNotification(`Projeto "${ projeto.nome}" excluido!`, false);
        }
        
        
    } catch (error) {
        console.error(`Erro ao executar a ação "${acao}":`, error);
        showBottomNotification(`Erro ao executar ação`, true);
    }
    }

    // A função para criar o modal de confirmação
    function criarModalConfirmacao(projeto) {
    const modal = document.createElement('div');
    modal.id = 'modal-confirmacao';
    modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.textAlign = 'center';
    modal.style.padding = '20px';
    modal.style.borderRadius = '5px';
    modal.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
    modal.style.zIndex = '9999';
    modal.innerHTML = `
        <p>Tem certeza de que deseja excluir o projeto "${projeto.nome}"?</p>
        <button id="confirmar-exclusao">Sim, excluir</button>
        <button id="cancelar-exclusao">Cancelar</button>
    `;
    document.body.appendChild(modal);

    // Ações para o botão de confirmação
    document.getElementById('confirmar-exclusao').addEventListener('click', async () => {
        console.log('Excluindo projeto:', projeto._id);  // Verifique se o projeto._id é válido
        await executarAcao('excluir', projeto);  // Chama a função para excluir o projeto
        modal.remove();
    });

    // Ações para o botão de cancelar
    document.getElementById('cancelar-exclusao').addEventListener('click', () => {
        modal.remove();  // Remove o modal se o usuário cancelar
    });
    }

    // Agora o restante do código para carregar os projetos
    async function carregarProjetos() {
    const userId = localStorage.getItem('userId');

    
    if (!userId) {
        console.error('userId não encontrado no localStorage!');
        showBottomNotification(`Usuário não identificado`, true);
        window.location.href = '../../login/login.html'; 
        return;
    }

    console.log('userId recuperado:', userId);

    // Definindo a URL com base na opção selecionada
    let url = '';
    switch (sideBarOpcao) {
        case "Documentos de Texto":
            url = `http://localhost:3000/project/projetosDocumentos?usuarioId=${userId}`;
            console.log("Meus documentos de texto mostrados");
            break;
        case "Favoritos":
            url = `http://localhost:3000/project/projetosFavoritados?usuarioId=${userId}`;
            console.log("Meus favoritados mostrados");
            break;
        case "Lixeira":
            url = `http://localhost:3000/project/projetosLixeira?usuarioId=${userId}`;
            console.log("Meus na lixeira mostrados");
            break;
        case "Listas de tarefas":
            url = `http://localhost:3000/project/projetosListas?usuarioId=${userId}`;
            console.log("Meus projetos de lista mostrados");
            break;
        case "Meus Projetos":
             url = `http://localhost:3000/project/obterProjetos?usuarioId=${userId}`;
            console.log("Meus projetos mostrados");
        break;
        default:
            url = `http://localhost:3000/project/obterProjetos?usuarioId=${userId}`;
            console.log("Meus projetos mostrados");
            break;
            return;
    }

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Erro ao buscar projetos: ${response.status} - ${response.statusText}`);
        }

        const projetos = await response.json();
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = '';
    const container = document.createElement('div');
    container.classList.add('mensagem-container');
    const mensagem = document.createElement('p');
    mensagem.classList.add('mensagem');
    const img = document.createElement('img');  // Criando o elemento da imagem

    if (projetos.length === 0) {
    switch (sideBarOpcao) {
        case "Meus Projetos":
            mensagem.innerText = 'Pareçe que você ainda não possui nenhum projeto.';
            img.src = "../../Assets/imagens/meusPROJETOS.png"; 
            break;
        case "Documentos de Texto":
            mensagem.innerText = 'Pareçe que você ainda não possui nenhum documento de Texto.';
            img.src = "../../Assets/imagens/editor-de-texto.png"; 
            break;
        case "Favoritos":
            mensagem.innerText = 'Pareçe que você ainda não possui nenhum projeto Favoritado.';
            img.src = "../../Assets/imagens/favorito.png"; 
            break;
        case "Lixeira":
            img.src = "../../Assets/imagens/bin (1).png";    
        mensagem.innerText = 'Pareçe que sua lixeira ainda não possui nenhum projeto.';
            break;
        case "Listas de tarefas":
            mensagem.innerText = 'Pareçe que você ainda não possui nenhuma lista de Tarefas';
            img.src = "../../Assets/imagens/lista-de-tarefas.png"; 
            break;
        case "":
            mensagem.innerText = 'Pareçe que você ainda não possui nenhum projeto.';
            img.src = "../../Assets/imagens/meusPROJETOS.png"; 
        break;
        default:
            mensagem.innerText = 'Pareçe que você ainda não possui nenhum projeto.';
            img.src = "../../Assets/imagens/meusPROJETOS.png"; 
            return;
    }

   
    mensagem.style.color = '#fafafa';
    
    container.appendChild(img);
    container.appendChild(mensagem);
    

    mainContent.appendChild(container);


        } else {
            const modal = document.createElement('div');
            modal.id = 'context-menu';
            modal.style.position = 'absolute';
            modal.style.display = 'none';
            modal.style.backgroundColor = '#333';
            modal.style.color = '#fff';
            modal.style.padding = '10px';
            modal.style.borderRadius = '5px';
            modal.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.5)';
            document.body.appendChild(modal);

            projetos.forEach((projeto) => {
                const projetoBtn = document.createElement('button');
                projetoBtn.className = 'projeto-btn';
                const nomeProjeto = document.createElement('span');
                nomeProjeto.innerText = projeto.nome;

                const iconeProjeto = document.createElement('i');
                if (projeto.tipo === 'lista') {
                    iconeProjeto.className = 'material-icons';
                    iconeProjeto.innerText = 'list';
                } else if (projeto.tipo === 'documento') {
                    iconeProjeto.className = 'material-icons';
                    iconeProjeto.innerText = 'text_snippet';
                } else {
                    iconeProjeto.className = 'material-icons';
                    iconeProjeto.innerText = 'help';
                }

                projetoBtn.appendChild(nomeProjeto);
                projetoBtn.appendChild(iconeProjeto);

                // Evento para clique esquerdo
                projetoBtn.addEventListener('click', () => {
                    if (projeto.tipo === 'lista') {
                        abrirModalLista(projeto);
                    } else if (projeto.tipo === 'documento') {
                        abrirModalDocumento(projeto);
                    }
                });

                // Evento para clique com o botão direito
                projetoBtn.addEventListener('contextmenu', (event) => {
                    event.preventDefault();

                    console.log('ID do Projeto:', projeto._id);

                    modal.style.left = `${event.pageX}px`;
                    modal.style.top = `${event.pageY}px`;
                    modal.style.display = 'block';

                    modal.innerHTML = '';

                    // Opções dinâmicas
                    const opcoes = projeto.lixeira
                        ? [
                            { texto: 'Remover da Lixeira', acao: 'removerDaLixeira' },
                            { texto: 'Excluir', acao: 'excluir' },
                        ]
                        : [
                            { texto: projeto.favoritado ? 'Desfavoritar' : 'Favoritar', acao: projeto.favoritado ? 'desfavoritar' : 'favoritar' },
                            { texto: 'Mover para Lixeira', acao: 'moverParaLixeira' },
                        ];

                    opcoes.forEach((opcao) => {
                        const item = document.createElement('div');
                        item.innerText = opcao.texto;
                        item.style.cursor = 'pointer';
                        item.style.padding = '5px 0';
                        item.addEventListener('click', () => {
                            if (opcao.acao === 'excluir') {
                                // Chama o modal de confirmação antes de excluir
                                criarModalConfirmacao(projeto);
                            } else {
                                executarAcao(opcao.acao, projeto);
                            }
                            modal.style.display = 'none';
                        });
                        modal.appendChild(item);
                    });
                });

                mainContent.appendChild(projetoBtn);
            });

            // Fecha o modal ao clicar fora dele
            document.addEventListener('click', (event) => {
                if (event.target !== modal) {
                    modal.style.display = 'none';
                }
            });
        }
    } catch (error) {
        console.error('Erro ao carregar projetos:', error);
        showBottomNotification(`Erro ao carregar os projetos`, true);
    }
    }
    let sideBarOpcao = "";
    carregarProjetos();
    
    
    // Função para criar o modal de confirmação
    
    
    

    

    const btnlixeira = document.getElementById('btnlixeira');
    btnlixeira.addEventListener('click', () => {
        sideBarOpcao = "Lixeira";
        carregarProjetos();
    });
    
    const btnListasDeTarefas = document.getElementById('btnListasDeTarefas');
    btnListasDeTarefas.addEventListener('click', () => {
        sideBarOpcao = "Listas de tarefas";
        carregarProjetos();
    });
    const btnMeusProjetos = document.getElementById('btnMeusProjetos');
    btnMeusProjetos.addEventListener('click', () => {
        sideBarOpcao = "Meus Projetos";
        carregarProjetos();
    });
    
    const btnDocumentosTexto = document.getElementById('btnDocumentosTexto');
    btnDocumentosTexto.addEventListener('click', () => {
        sideBarOpcao = "Documentos de Texto";
        carregarProjetos();
    });
    
    const btnFavoritos = document.getElementById('btnFavoritos');
    btnFavoritos.addEventListener('click', () => {
        sideBarOpcao = "Favoritos";
        carregarProjetos();
    });

    
    // Variáveis de estado locais para evitar problemas globais
    let projectIdLista = null;
    let tarefasEditar = [];
    let todasAsTarefas = [];

    // Função para abrir o modal e carregar as tarefas
    async function abrirModalLista(projeto) {
    try {
        const response = await fetch(`http://localhost:3000/project/obterProjetos?usuarioId=${userId}`);
        if (!response.ok) throw new Error(`Erro ao carregar os dados do projeto: ${response.status}`);

        const dadosProjeto = await response.json();
        const projetoLista = dadosProjeto.find(p => p._id === projeto._id && p.tipo === 'lista');
        if (!projetoLista) {
            console.warn('Nenhum projeto correspondente foi encontrado.');
            return;
        }

        // Atualizar o estado local
        projectIdLista = projetoLista._id;
        todasAsTarefas = [...(projetoLista.tarefas || [])];
        tarefasEditar = [];

        // Atualizar o nome do projeto no modal
        const nomeProjetoListaEditar = document.getElementById('nomeProjeto-ListaEditar');
        if (nomeProjetoListaEditar) {
            nomeProjetoListaEditar.innerText = projetoLista.nome;
        } else {
            console.error('Elemento com ID "nomeProjeto-ListaEditar" não encontrado.');
        }

        // Atualizar as tarefas no modal
        const tarefasListaEditar = document.getElementById('tarefasListaEditar');
        if (tarefasListaEditar) {
            tarefasListaEditar.innerHTML = ''; // Limpar tarefas existentes
            todasAsTarefas.forEach(tarefa => {
                const tarefaElemento = criarElementoTarefaEditar(tarefa);
                tarefasListaEditar.appendChild(tarefaElemento);
            });
        } else {
            console.error('Elemento com ID "tarefasListaEditar" não encontrado.');
        }

        // Exibir o modal
        modalListaEditar.style.display = 'flex';
    } catch (error) {
        console.error('Erro ao abrir o modal de lista:', error);
        showBottomNotification(`Erro ao editar projeto de lista`, true);
    }


    
    }

    // Função para criar um elemento de tarefa
    function criarElementoTarefaEditar(tarefa) {
    const { descricao, concluida } = tarefa;
    const li = document.createElement('li');
    li.classList.add('task-item');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('task-checkbox');
    checkbox.checked = concluida;
    checkbox.addEventListener('change', () => {
        tarefa.concluida = checkbox.checked; // Atualizar o estado da tarefa
    });

    const span = document.createElement('span');
    span.textContent = descricao;

    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '<i class="fa fa-trash"></i>';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', () => {
        li.remove();
        todasAsTarefas = todasAsTarefas.filter(t => t.descricao !== descricao);
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);

    return li;
    }

    // Evento para adicionar uma nova tarefa no modal de edição
    btnAdicionarEditar.addEventListener('click', () => {
    const descricao = descricaoInputEditar.value.trim();
    if (!descricao) {
       
        showBottomNotification(`Por favor, insira uma descrição para a tarefa.`, true);
        return;
    }

    const novaTarefa = { descricao, concluida: false };
    tarefasEditar.push(novaTarefa);
    todasAsTarefas.push(novaTarefa); // Adicionar ao estado local

    const tarefaElemento = criarElementoTarefaEditar(novaTarefa);
    tarefasListaEditar.appendChild(tarefaElemento);

    descricaoInputEditar.value = ''; // Limpar o campo
    });

    // Evento para salvar o projeto
    btnSalvarProjetoLista.addEventListener('click', async () => {
    try {
        if (!projectIdLista) {
            console.error('Projeto ID não encontrado.');
            return;
        }

        const nome = document.getElementById('nomeProjeto-ListaEditar').innerText;
        if (!nome || !todasAsTarefas.length) {
            showBottomNotification(`Erro ao identificar o nome do projeto`, true);
            return;
        }

        const body = JSON.stringify({ nome, tarefas: todasAsTarefas });
        const response = await fetch(`http://localhost:3000/project/atualizarProjeto/${projectIdLista}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body,
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            console.error('Erro na resposta:', errorResponse);
            throw new Error(`Erro ao salvar o projeto: ${response.status}`);
        }

        showBottomNotification(`Projeto atualziado com sucesso!`, false);
        modalListaEditar.style.display = 'none';
        todasAsTarefas = []; // Resetar o estado
    } catch (error) {
        console.error('Erro ao salvar o projeto:', error);
        showBottomNotification(`Erro ao salvar Projeto`, true);
    }
    });



    let editor;  // Substituindo 'quill' por 'editor'
    let projetoIdDoc = null;
    
    async function abrirModalDocumento(projeto) {
        const modalDocumentoEditar = document.getElementById('modalDocumentoEditar');
        try {
            const response = await fetch(`http://localhost:3000/project/obterProjetos?usuarioId=${userId}`);
    
            if (!response.ok) {
                throw new Error(`Erro ao carregar os dados do projeto: ${response.status}`);
            }
    
            const dadosProjeto = await response.json();
            console.log('dadosProjeto:', dadosProjeto);
    
            const projetoDocumento = dadosProjeto.find(p => p._id === projeto._id && p.tipo === 'documento');
    
            if (projetoDocumento) {
                const nomeProjetoDocumentoEditar = document.getElementById('nomeProjeto-DocumentoEditar');
                if (nomeProjetoDocumentoEditar) {
                    nomeProjetoDocumentoEditar.innerHTML = projetoDocumento.nome;
                } else {
                    console.error('ID do elemento "nomeProjeto-DocumentoEditar" não encontrado no HTML');
                }
    
                const toolbarOptions = [
                    ['bold', 'italic', 'underline', 'strike'],
                    ['blockquote', 'code-block'],
                    [{ header: 1 }, { header: 2 }],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    [{ script: 'sub' }, { script: 'super' }],
                    [{ indent: '-1' }, { indent: '+1' }],
                    [{ direction: 'rtl' }],
                    [{ size: ['small', false, 'large', 'huge'] }],
                    [{ header: [1, 2, 3, 4, 5, 6, false] }],
                    [{ color: [] }, { background: [] }],
                    [{ font: [] }],
                    [{ align: [] }],
                    ['clean'],
                    ['link', 'image', 'video']
                ];
    
                if (!editor) {  // Substituindo 'quill' por 'editor'
                    editor = new Quill('#quillEditorEditar', {
                        theme: 'snow',
                        modules: { toolbar: toolbarOptions }
                    });
                }
    
                editor.setContents(editor.clipboard.convert(projetoDocumento.conteudo));  // Substituindo 'quill' por 'editor'
    
                // Salva o ID do projeto para usar no salvar
                projetoIdDoc = projetoDocumento._id;
    
                if (modalDocumentoEditar) {
                    modalDocumentoEditar.style.display = 'flex';
                } else {
                    console.error('ID do modal "modalDocumentoEditar" não encontrado no HTML');
                }
            } else {
                console.error('Projeto do tipo "documento" não encontrado.');
            }
        } catch (error) {
            console.error('Erro ao abrir o modal de documento:', error);
        }
    }
    
    

    const fecharListaEditar = document.getElementById('fecharListaEditar');
    fecharListaEditar.addEventListener('click', ()=>{
        console.log('btn cancelar clicado');
        modalListaEditar.style.display='none';
    })
   

    const btnCancelarDocumentoEditar = document.getElementById('btnCancelarDocumentoEditar')
    btnCancelarDocumentoEditar.addEventListener('click', ()=>{
    modalDocumentoEditar.style.display = 'none';
    })

    const btnSalvarDocumentoTexto = document.getElementById('btnSalvarDocumentoTexto'); // Botão "Salvar Projeto"

    btnSalvarDocumentoTexto.addEventListener('click', async () => {
        try {
            // Verifique se o ID do projeto foi armazenado corretamente
            if (!projetoIdDoc) {
                console.error('Projeto ID não encontrado');
                return;
            }
    
            // Pegando o conteúdo do editor Quill
            const conteudo = editor.root.innerHTML;  // Captura o HTML do conteúdo renderizado
            const nome = document.getElementById('nomeProjeto-DocumentoEditar').innerText;  // Nome do projeto
    
            if (!conteudo || !nome) {
                console.error('Nome ou conteúdo não fornecido para atualização');
                return;
            }
    
            // Criando o corpo da requisição para atualização do projeto
            const body = JSON.stringify({
                nome: nome,
                conteudo: conteudo
            });
    
            // Realizando a requisição PATCH para atualizar o projeto
            const response = await fetch(`http://localhost:3000/project/atualizarProjeto/${projetoIdDoc}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: body
            });
    
            if (!response.ok) {
                throw new Error(`Erro ao salvar o projeto: ${response.status}`);
            }
    
            // Obtendo a resposta da API
            const result = await response.json();
            console.log(result);
    
            // Fechando o modal após salvar
            modalDocumentoEditar.style.display = 'none';
            showBottomNotification(`Projeto salvo com sucesso!`, false);
    
        } catch (error) {
            console.error('Erro ao salvar o projeto:', error);
            showBottomNotification(`Erro ao salvar o projeto`, true);
        }
    });
    

 
    //Botão para adiconar Tarefa
    // Função para criar uma tarefa com estilo consistente
    function criarElementoTarefa(tarefa) {
    const { descricao, concluida } = tarefa;

    const li = document.createElement('li');
    li.classList.add('task-item');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('task-checkbox');
    checkbox.checked = concluida; // Marca o checkbox se a tarefa estiver concluída

    const span = document.createElement('span');
    span.textContent = descricao;

    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '<i class="fa fa-trash"></i>';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.onclick = function () {
        li.remove();
        tarefas = tarefas.filter(t => t.descricao !== descricao);
    };

    // Evento para atualizar a propriedade 'concluida' da tarefa
    checkbox.addEventListener('change', (event) => {
        const isChecked = event.target.checked;
        tarefa.concluida = isChecked; // Atualiza a tarefa com o novo estado de 'concluida'
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);

    return li;
    }

    // Evento para adicionar uma nova tarefa
    btnAdicionar.addEventListener('click', () => {
    const descricao = descricaoInput.value.trim();

    if (!descricao) {
        showBottomNotification(`Por favor, descreva a tarefa`, true);
        return;
    }

    // Cria o objeto da tarefa
    const novaTarefa = { descricao, concluida: false };
    tarefas.push(novaTarefa); // Adiciona ao array de tarefas

    // Cria o elemento visual e adiciona à lista
    const tarefaElemento = criarElementoTarefa(novaTarefa);
    tarefasLista.appendChild(tarefaElemento);

    descricaoInput.value = ''; // Limpa o campo de entrada
    });


    // Função para carregar tarefas do banco de dados no modal
    function carregarTarefas(tarefasBanco) {
    tarefasLista.innerHTML = ''; // Limpa a lista existente

    tarefasBanco.forEach(tarefa => {
        const tarefaElemento = criarElementoTarefa(tarefa);
        tarefasLista.appendChild(tarefaElemento);
    });
    }

    

    // Variáveis para armazenamento temporário
    let nomeDoProjeto = '';
    let tipoDoProjeto = '';
    let tarefas = [];

    // 
    // Abre o modal de adicionar projeto que tem como escolher se é lista ou doc
    addProject?.addEventListener('click', () => {
        console.log("btnAddProt")
        modalAdicionarProjeto.style.display = 'flex';
    });
    function fecharModal() {
        modalAdicionarProjeto.style.display = 'none';
    }

    function fecharModalLista() {
        modalLista.style.display = 'none';
        tarefas = []; // Limpa tarefas armazenadas
        tarefasLista.innerHTML = ''; // Limpa visualmente
        //carregarProjetos();
    }

    // Evento de clique para criar o projeto
    btnCriarProjeto?.addEventListener('click', () => {
        const nomeProjetoInput = document.getElementById('nomeProjeto');
        const tipoProjetoSelect = document.getElementById('mySelect');

        nomeDoProjeto = nomeProjetoInput.value;
        tipoDoProjeto = tipoProjetoSelect.value;

        if (!nomeDoProjeto || tipoDoProjeto === 'selecione') {
            showBottomNotification(`Preencha todos os campos para a criação do projeto`, true);
            return;
        }

        if (tipoDoProjeto === 'lista') {
            const nomeProjetoLista = document.getElementById('nomeProjeto-Lista');
            nomeProjetoLista.innerText = nomeDoProjeto;
            modalLista.style.display = 'flex';
            modalAdicionarProjeto.style.display = 'none';
        } else {
            const nomeProjetoDocumento = document.getElementById('nomeProjeto-documento');
            nomeProjetoDocumento.innerText = nomeDoProjeto;
            modalDocumento.style.display = 'flex';
            modalAdicionarProjeto.style.display = 'none';
        }
    });

    // Adiciona uma tarefa à lista
    
    async function criarProjeto(data) {
        try {
            const response = await fetch('http://localhost:3000/project/criarProjetoLista', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Erro ao criar o projeto.');
            }

            const result = await response.json();
            showBottomNotification(`Projeto criado com sucesso`, false);
            carregarProjeto();
            
            
            console.log(result);
        } catch (error) {
            console.error('Erro:', error);
            showBottomNotification(`Erro ao criar projeto`, true);
        }
    }
    // Cria o projeto tipo "lista"
    btnCriarProjetoLista?.addEventListener('click', () => {
        if (tarefas.length === 0) {
            showBottomNotification(`Adicione pelo menos uma tarefa para a criação do projeto`, true);
            return;
        }
        const userId = localStorage.getItem('userId'); // Recupera o userId do armazenamento local
        if (!userId) {
            showBottomNotification(`Erro ao identificar usuário`, true);
            window.location.href = '../../login/login.html'; 
            return;
        }
        const projetoData = {
            usuario: userId, // Inclui o userId no corpo da requisição
            nome: nomeDoProjeto,
            tipo: tipoDoProjeto,
            tarefas,
        };
    
        // Verifique o estado das tarefas no console
        console.log('Tarefas antes de enviar para o backend:', projetoData.tarefas);
    
        criarProjeto(projetoData); // Enviar os dados para o backend
        fecharModalLista();
        location.reload();

    });
    
    

    // Função para enviar o projeto ao backend
    

    btnCriarDocumentoTexto?.addEventListener('click', () => {
        const userId = localStorage.getItem('userId'); // Recupera o userId do armazenamento local
        if (!userId) {
            showBottomNotification(`Usuário não identificado`, true);
            window.location.href = '../../login/login.html'; 
            return;
        }
    
        const nomeDoProjeto = document.getElementById('nomeProjeto-documento').innerText; // Nome do projeto
        const tipoDoProjeto = 'Documento de Texto'; // Tipo do projeto
        const conteudoDocumento = quill.root.innerHTML; // Conteúdo do editor Quill
    
        if (!conteudoDocumento || conteudoDocumento.trim() === '<p><br></p>') {
           
            showBottomNotification(`O documento está vazio. Adicione conteúdo antes de salvar.`, true);
            return;
        }
    
        const projetoData = {
            usuario: userId, // Inclui o userId no corpo da requisição
            nome: nomeDoProjeto,
            tipo: tipoDoProjeto,
            conteudo: conteudoDocumento, // Inclui o conteúdo do documento
        };
    
        console.log('Dados enviados para o backend:', projetoData);
    
        criarProjetoDocumento(projetoData);
        fecharModalDocumento();
        location.reload();

    });
    
    // Função para enviar o projeto ao backend
    async function criarProjetoDocumento(data) {
        try {
            const response = await fetch('http://localhost:3000/project/criarProjetoDocumento', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
    
            console.log('Response:', response);
            if (!response.ok) {
                throw new Error('Erro ao criar o projeto.');
            }
    
            const result = await response.json();
            showBottomNotification(`Projeto Criado com sucesso`, true);
            console.log(result);
        } catch (error) {
            console.error('Erro:', error);
            showBottomNotification(`Ocorreu um erro na criação do projeto`, true);
        }
    }
    
    btnCancelarDocumento.addEventListener('click', () => {
        fecharModalDocumento();
    })

    // Função para fechar o modal do documento
    function fecharModalDocumento() {
        document.getElementById('modalDocumento').style.display = 'none';
        //carregarProjetos();
    }
    

    let x = null; // Variável global para armazenar qual botão foi clicado

    // Eventos de clique nos botões de download
    btnFazerDownloadDocumento.addEventListener('click', () => {
        x = 1; // Indica que o primeiro editor foi selecionado
        modalFormato.style.display = 'flex';
    });
    
    btnFazerDownloadDocumentoEditar.addEventListener('click', () => {
        x = 2; // Indica que o segundo editor foi selecionado
        modalFormato.style.display = 'flex';
    });
    
    // Fecha o modal de formato
    function fecharModalFormato() {
        modalFormato.style.display = 'none';
    }
    
    // Confirma o formato e realiza o download
   
    
    btnConfirmarFormato.addEventListener('click', () => {
        const selectedInput = [...downloadFormatInputs].find(input => input.checked);
    
        if (!selectedInput) {
            showBottomNotification(`Selecione o tipo do documento para download`, true);
            return;
        }
    
        // Definindo o conteúdo baseado no valor de 'x'
        let content = '';
        if (x === 1) {
            content = quillEditor.innerHTML;  // Verifique se 'quillEditor' é o id correto do seu elemento
        } else if (x === 2) {
            content = quillEditorEditar.innerHTML;  // Verifique se 'quillEditorEditar' é o id correto do seu elemento
        }
    
        const selectedFormat = selectedInput.value;
    
        // Chamando a função de download conforme o formato escolhido
        switch (selectedFormat) {
            case 'html':
                downloadHtml(content);
                break;
            case 'pdf':
                downloadPdf(content);
                break;
            default:
                showBottomNotification(`Selecione um formato válido`, true);
                return;
        }
    
        // Fecha o modal de formato
        modalFormato.style.display = 'none';
    });
    
   
    
    function downloadHtml(content) {
        const blob = new Blob([content], { type: 'text/html' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'editor-content.html';
        link.click();
    }
    
    function downloadPdf(content) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.text(content.replace(/<[^>]+>/g, ''), 10, 10); // Remove tags HTML para PDF simples
        doc.save('editor-content.pdf');
    }
    
    //Quill
    const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'], // Formatações básicas
    ['blockquote', 'code-block'], // Bloco de citação e bloco de código
    [{ header: 1 }, { header: 2 }], // Cabeçalhos H1 e H2
    [{ list: 'ordered' }, { list: 'bullet' }], // Listas ordenadas e não ordenadas
    [{ script: 'sub' }, { script: 'super' }], // Subscrito e sobrescrito
    [{ indent: '-1' }, { indent: '+1' }], // Indentar para frente/para trás
    [{ direction: 'rtl' }], // Direção do texto da direita para a esquerda
    [{ size: ['small', false, 'large', 'huge'] }], // Tamanhos de fonte
    [{ header: [1, 2, 3, 4, 5, 6, false] }], // Cabeçalhos H1-H6
    [{ color: [] }, { background: [] }], // Cor do texto e do fundo
    [{ font: [] }], // Fontes
    [{ align: [] }], // Alinhamento do texto
    ['clean'], // Remover formatação
    ['link', 'image', 'video'] // Links, imagens e vídeos
  ];

  // Inicializando o editor Quill
  const quill = new Quill('#quillEditor', {
    theme: 'snow', // Tema do editor
    modules: {
      toolbar: toolbarOptions // Configuração da toolbar
    }
  }
);


});