// Função para alternar entre mostrar/ocultar senha
function olhos() {
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirm-password');
  const eyeIcon = document.getElementById('eyeIcon');
  
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    if (confirmPasswordInput) {
      confirmPasswordInput.type = 'text';
    }
    eyeIcon.src = '../Assets/imagens/olhoAberto.png';
  } else {
    passwordInput.type = 'password';
    if (confirmPasswordInput) {
      confirmPasswordInput.type = 'password';
    }
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

// Código para o envio do formulário
document.querySelector('.form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmpassword = document.getElementById('confirm-password').value;
  
  // Verificar se todos os campos foram preenchidos
  if (!name || !email || !password || !confirmpassword) {
    showBottomNotification('Por favor, preencha todos os campos.', true); // Exibe a notificação de erro
    return;
  }

  // Verificar se as senhas coincidem
  if (password !== confirmpassword) {
    showBottomNotification('As senhas não conferem. Tente novamente.', true); // Exibe a notificação de erro
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, confirmpassword }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Exibe a notificação de sucesso
      showBottomNotification('Cadastro realizado com sucesso!', false);
      
      // Redireciona para a página de login
      window.location.href = "../Login/login.html";
    } else {
      // Se o erro for relacionado ao email ou username já usados
      if (data.msg === 'Username já utilizado') {
        showBottomNotification('Esse nome de usuário já está em uso. Tente outro.', true);
      } else if (data.msg === 'Email já utilizado') {
        showBottomNotification('Esse e-mail já está em uso. Tente outro.', true);
      } else {
        showBottomNotification(data.msg || 'Erro ao tentar realizar o cadastro', true); // Exibe a notificação de erro
      }
    }
  } catch (error) {
    console.error('Erro:', error);
    showBottomNotification('Ocorreu um erro. Tente novamente.', true); // Exibe a notificação de erro
  }
});
