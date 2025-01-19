document.addEventListener("DOMContentLoaded", function () {
  const btnVerificar = document.querySelector('.btnVerificar');
  const btnReenviarCodigo = document.querySelector('.btnReenviarCodigo'); // Botão de reenviar
  const emailInput = document.getElementById("email");
  const codeInput = document.getElementById("code");
  const codigoVerificacaoDiv = document.getElementById("codigo-verificacao");
  const modalSucesso = document.getElementById("modal"); // Modal de Sucesso
  const closeModalBtn = document.getElementById("close-btn");
  const btnFecharModal = document.getElementById("btnFecharModal");
  const btnVerificarCod = document.getElementById("btnVerificarCod");
  const textinho = document.getElementById("textinho");
  const modalNovaSenha = document.getElementById("modalNovaSenha");
  const btnAtualizarSenha = document.getElementById("btnAtualizarSenha");
  const btnAlterarSenha = document.getElementById("btnFecharModalNovaSenha"); // Você pode adicionar outro botão específico se preferir
  const resposta = document.getElementById("mensagem");
  const passInput = document.getElementById("pass");
  const passConfirmInput = document.getElementById("passConfirm");
  
  const btnverSenha = document.getElementById("verSenha");
  const emailPraver = document.getElementById("emailPraver");
  let emailDoUsuario = "";

  async function alterarSenha(email, novaSenha, confirmacaoSenha) {
    try {
        const response = await fetch("http://localhost:3000/auth/alterarSenha", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, novaSenha, confirmacaoSenha }) // Use "email" corretamente
        });

       console.log('Requisição enviada:', JSON.stringify({ email, novaSenha, confirmacaoSenha }));

    const result = await response.json();
    console.log('Resposta do servidor:', result);

        if (!response.ok) {
            console.error('Erro ao alterar a senha:', result.msg || 'Erro desconhecido.');
            exibirMensagem('erro', result.msg || 'Erro desconhecido ao alterar a senha.');
            return;
        }

        console.log('Senha alterada com sucesso:', result.msg);
        exibirMensagem('sucesso', 'Senha alterada com sucesso! Redirecionando...');
        
        // Aguarde alguns segundos antes de redirecionar (opcional)
        setTimeout(() => {
            window.location.href = "../login/login.html"; // Redireciona para a página de login
        }, 2000); // Redireciona após 2 segundos
    } catch (error) {
        console.error('Erro ao conectar com o servidor:', error);
        exibirMensagem('erro', 'Erro ao conectar com o servidor.');
    }
  }



  btnAtualizarSenha.addEventListener('click', async () => {
    const novaSenha = passInput.value.trim();
    const confirmacaoSenha = passConfirmInput.value.trim();
  
    // Verifica se os campos estão preenchidos
    if (!novaSenha || !confirmacaoSenha) {
      exibirMensagem('erro', 'Preencha todos os campos!');
      return;
    }
  
    // Verifica se as senhas coincidem
    if (novaSenha !== confirmacaoSenha) {
      exibirMensagem('erro', 'As senhas não coincidem!');
      return;
    }
  
    try {
      // Faz a requisição ao backend
      const response = await fetch('http://localhost:3000/auth/alterarSenha', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailDoUsuario, // Email passado de outra parte do sistema
          novaSenha, // Nome do campo alinhado com o backend
          confirmacaoSenha, // Nome do campo alinhado com o backend
        }),
      });
  
      const data = await response.json();
  
      // Trata a resposta do backend
      if (!response.ok) {
        exibirMensagem('erro', data.msg || 'Erro ao atualizar a senha!');
        showBottomNotification('Erro ao alterar senha', false);
      } else {
        exibirMensagem('sucesso', 'Senha atualizada com sucesso!');
        showBottomNotification('Senha alterada com sucesso', false);
        // Redireciona para a página de login ou limpa os campos
        window.location.href = '../login/login.html';
      }
    } catch (error) {
      console.error('Erro ao conectar com o servidor:', error);
      exibirMensagem('erro', 'Erro ao conectar com o servidor. Tente novamente mais tarde!');
    }
  });
  
  

  



  btnverSenha.addEventListener('click', async => {
    if (pass.type === 'password') {
      pass.type = 'text';
      passConfirmInput.type = 'text';
      eyeIcon.src = '../Assets/imagens/olhoAberto.png';
    } else {
      pass.type = 'password';
      passConfirmInput.type = 'password';
      eyeIcon.src = '../Assets/imagens/olhoFechado.png';
    }
  })

  
  

  // Rota para verificar se o e-mail existe no banco de dados
  btnVerificarCod.addEventListener('click', async () => {
    const email = emailInput.value;
    const codigo = codeInput.value;
    
    if (!codigo) {
      exibirMensagem('erro', 'Por favor, insira o código.');
      return;
    }
  
    try {
      // Chama a função verificarCodigo que é assíncrona
      await verificarCodigo(email, codigo);
    } catch (error) {
      exibirMensagem('erro', 'Ocorreu um erro ao verificar o código. Tente novamente.');
    }
  });


  async function verificarCodigo(email, codigo) {
   try {
    const response = await fetch("http://localhost:3000/auth/verificar-codigo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email: emailDoUsuario, code: codigo })
    });

    const result = await response.json();

    if (!response.ok) {
      
      // Força a exibição de uma mensagem fixa
      resposta.textContent = 'Código expirado ou incorreto';
      resposta.className = 'erro';
      showBottomNotification('Codigo expirado ou incorreto', false);
      return;
    }
    

    // Código verificado com sucesso
    exibirMensagem('sucesso', result.msg || 'Código verificado com sucesso!');
    modalNovaSenha.style.display = 'block';
    modalSucesso.style.display = 'none'; // Feche o modal de verificação
    
  } catch (error) {
    //('erro', 'Erro de conexão. O servidor pode estar offline.');
  }
  }


  // Exibir campo de verificação de código após envio do código
  btnVerificar.addEventListener("click", async function (e) {
    e.preventDefault(); // Impede o comportamento padrão do formulário (não recarregar a página)
    const email = emailInput.value;
    console.log("botão Acionado")
  
    if (!email) {
      textinho.textContent = 'Insira um email válido';
      return;
    }
    emailDoUsuario = email; 
    // Verificar se o e-mail existe no banco
    await verificarEmail(email);
  });
  
  // Função para verificar se o e-mail existe
  async function verificarEmail(email) {
    try {
      console.log("funcão de verificar email executando")
      const response = await fetch("http://localhost:3000/auth/checkEmailExists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });
  
      const result = await response.json();
  
      // Verificando a resposta com base no status
      if (response.status === 404) {
      console.log('E-mail não encontrado!');
      showBottomNotification('E-mail não encontrado', true);
        textinho.textContent = 'E-mail não cadastrado'; // Altera o conteúdo do parágrafo

        
        return;
      }
  
      if (response.status === 200) {
        console.log("sucesso E-mail encontrado")
        await enviarCodigo(email);
        
        // Enviar o código de verificação, se necessário
        
      } else {
        // Exibir mensagem de erro genérico caso ocorra algum outro erro
        exibirMensagem('erro', result.msg || 'Erro ao verificar o e-mail.');
        
      }
  
    } catch (error) {
      exibirMensagem('erro', 'Erro de conexão. O servidor pode estar offline.');
      showBottomNotification('Erro de conexão. O servidor pode estar offline..', true);
    }
  }
  
  // Função simulada de envio de código
  async function enviarCodigo(email) {
    try {
      console.log(' Function chamada. EnviarCodigo ');
      const response = await fetch("http://localhost:3000/auth/esqueci-senha", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        const result = await response.json();
        console.log('Erro ao enviar codigo.');
        showBottomNotification('Erro ao enviar o código de verificação!', true);
        return;
      }
    
      showBottomNotification('Código enviado com sucesso, verifique seu email!.', false);

      // Exibir o modal de sucesso (Código Enviado)
      modalSucesso.style.display = 'block';

      // Exibir o campo de verificação de código
      codigoVerificacaoDiv.style.display = 'block';
    } catch (error) {
      // exibirMensagem('erro', 'Erro de conexão. O servidor pode estar offline.');
    }
  }

  // Função para exibir mensagens
  function exibirMensagem(tipo, mensagem) {
    const mensagemDiv = document.getElementById("mensagem");
    if (mensagemDiv) {
      mensagemDiv.className = tipo;
      mensagemDiv.textContent = mensagem;
    }
  }

  // Fechar o modal de sucesso ao clicar no "X" ou "Fechar"
  closeModalBtn.addEventListener("click", () => {
    modalSucesso.style.display = 'none';
  });
  
  

  // Reenviar o código ao clicar no botão "Reenviar Código"
  btnReenviarCodigo.addEventListener("click", async function (e) {
    const email = emailInput.value;

    if (!email) {
      exibirMensagem('erro', 'Por favor, insira um e-mail válido para reenviar o código.');
      
      return;
    }

    // Reenviar o código
    await enviarCodigo(email);
  });



function showBottomNotification(message, isError = false) {
  const notification = document.getElementById('bottom-notification');
  const messageElement = document.getElementById('bottom-notification-message');
  
  messageElement.textContent = message;
  notification.classList.remove('hidden');
  
  // Definir a cor da notificação (erro ou sucesso)
  if (isError) {
      notification.style.backgroundColor = '#f44336'; // Vermelho para erro
  } else {
      notification.style.backgroundColor = '#4CAF50'; // Verde para sucesso
  }

  // Fecha a notificação quando o botão for clicado
  document.getElementById('close-bottom-notification').addEventListener('click', () => {
      notification.classList.add('hidden');
  });
  
  // Auto esconder a notificação após 5 segundos
  setTimeout(() => {
      notification.classList.add('hidden');
  }, 5000);
}});