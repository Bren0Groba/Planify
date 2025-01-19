// Função para alternar entre mostrar/ocultar senha
function olhos() {
  const passwordInput = document.getElementById('password');
  const eyeIcon = document.getElementById('eyeIcon');
  
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    eyeIcon.src = '../Assets/imagens/olhoAberto.png';
  } else {
    passwordInput.type = 'password';
    eyeIcon.src = '../Assets/imagens/olhoFechado.png';
  }
}

// Função para mostrar a notificação na parte inferior
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
}

// Código para o login
document.querySelector('.form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Obtém o email e a senha do formulário
  const email = document.getElementById('email').value.trim();  // Remove espaços extras do email
  let password = document.getElementById('password').value.trim();  // Remove espaços extras da senha
  
  console.log('Senha fornecida:', password);  // Verifique a senha recebida
  
  // Verifique se a senha e o email não estão vazios
  if (!email || !password) {
    console.log('Erro: Email ou senha não fornecidos');
    return showBottomNotification('Por favor, preencha todos os campos.', true);  // Exibe a notificação de erro
  }

  try {
    // Envia a requisição para o back-end
    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Salva os dados do usuário no Local Storage
      salvarUsuarioLocalStorage(data);
      
      // Exibe a notificação de sucesso
      showBottomNotification('Login realizado com sucesso!', false);
      
      // Redireciona para a página inicial após o login
      window.location.href = "../home/home/index.html";
    } else {
      console.log('Erro no login:', data.msg);
      showBottomNotification(data.msg || 'Erro ao tentar fazer login', true);  // Exibe a notificação de erro
    }
  } catch (error) {
    console.error('Erro:', error);
    showBottomNotification('Ocorreu um erro. Tente novamente.', true);  // Exibe a notificação de erro
  }
});

function salvarUsuarioLocalStorage(data) {
  if (data && data.userId) {  // Verifica se `userId` está na resposta
    localStorage.setItem('userId', data.userId);
    console.log('ID do usuário salvo no localStorage:', data.userId);
  } else {
    console.error('ID do usuário não encontrado na resposta.');
  }
}
