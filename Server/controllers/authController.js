
  const nodemailer = require('nodemailer');  
  const bcrypt = require('bcrypt');
  const User = require('../models/User');
  const VerificationCode = require('../Models/verificationCode');

  
  exports.alterarSenha = async (req, res) => {
    const { email, novaSenha, confirmacaoSenha } = req.body;

    if (!novaSenha || !confirmacaoSenha) {
        return res.status(422).json({ msg: "Preencha todos os campos!" });
    }

    if (novaSenha !== confirmacaoSenha) {
        return res.status(422).json({ msg: "As senhas não coincidem!" });
    }

    try {
        const usuario = await User.findOne({ email });
        if (!usuario) {
            return res.status(404).json({ msg: "Usuário não encontrado!" });
        }

        usuario.password = novaSenha; // O middleware `pre('save')` irá gerar o hash
        await usuario.save();

        return res.status(200).json({ msg: "Senha atualizada com sucesso!" });
    } catch (error) {
        console.error('Erro ao atualizar a senha:', error);
        return res.status(500).json({ msg: "Erro ao atualizar a senha. Tente novamente mais tarde." });
    }
};





  
  
  
  // Registro
  exports.register = async (req, res) => {
    const { name, email, password, confirmpassword } = req.body;

    if (!name || !email || !password || !confirmpassword) {
        return res.status(422).json({ msg: 'Preencha todos os campos' });
    }
    if (password !== confirmpassword) {
        return res.status(422).json({ msg: 'As senhas não conferem' });
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
        return res.status(422).json({ msg: 'E-mail já cadastrado!' });
    }

    const usernameExist = await User.findOne({ name });
    if (usernameExist) {
        return res.status(422).json({ msg: 'Username já cadastrado!' });
    }

    const user = new User({ name, email, password }); // Passe a senha em texto plano

    try {
        await user.save(); // O middleware fará o hash automaticamente
        res.status(201).json({ msg: 'Usuário cadastrado com sucesso!' });
    } catch (error) {
        res.status(500).json({ msg: 'Erro no servidor', error: error.message });
    }
};

//login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    console.log("Erro: Campo vazio");
    return res.status(422).json({ msg: 'Preencha todos os campos' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("Erro: Usuário não encontrado");
      return res.status(404).json({ msg: 'Usuário não encontrado!' });
    }

    console.log('Usuário encontrado:', user);
    console.log('Senha armazenada (hash):', user.password);
    console.log('Senha fornecida:', password);

    // Ajuste aqui: use o método correto do modelo
    const isPasswordValid = await user.isPasswordValid(password);

    if (!isPasswordValid) {
      console.log("Erro: Senha incorreta");
      return res.status(422).json({ msg: 'Senha inválida!' });
    }

    console.log("Autenticado com sucesso!");

    return res.status(200).json({
      msg: 'Autenticado com sucesso!',
      userId: user._id,
      name: user.name,
      email: user.email,
    });

  } catch (error) {
    console.error("Erro no servidor:", error);
    return res.status(500).json({ msg: 'Erro no servidor', error: error.message });
  }
};






// Enviar código de verificação
exports.sendVerificationCode = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ msg: 'O e-mail é obrigatório.' });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  try {
    await transport.sendMail({
      from: `Planify <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Código de Verificação - Planify',
      html: `<h1>Seu Código de Verificação</h1><p>Use o código abaixo para redefinir sua senha:</p><h2>${code}</h2><p>Este código expira em 10 minutos.</p>`,
    });

    await VerificationCode.create({ email, code });
    res.status(200).json({ msg: 'Código enviado para o e-mail!' });
  } catch (error) {
    res.status(500).json({ msg: 'Erro ao enviar o código de verificação.', error: error.message });
  }
};

  // Função para verificar se o e-mail já existe no banco de dados
// controllers/authController.js
// controllers/authController.js
exports.checkEmailExists = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ msg: 'O e-mail é obrigatório.' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      // Logando o erro no console para depuração
      console.log(`Usuário não encontrado para o e-mail: ${email}`);
      return res.status(404).json({ msg: 'Usuário não encontrado com esse e-mail.' });
    }

    return res.status(200).json({ msg: 'E-mail encontrado!' });

  } catch (error) {
    // Logando o erro completo para depuração
    console.error("Erro ao verificar o e-mail:", error);
    return res.status(500).json({ msg: 'Erro ao verificar e-mail.', error: error.message });
  }
};


  // Verificar código
exports.verifyCode = async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(422).json({ msg: 'Email e código são obrigatórios!' });
  }

  try {
    const verification = await VerificationCode.findOne({ email, code });
    if (!verification) {
      return res.status(404).json({ msg: 'Código inválido ou não encontrado!' });
    }

    const expirationTime = 10 * 60 * 1000;
    const isExpired = new Date() - new Date(verification.createdAt) > expirationTime;

    if (isExpired) {
      return res.status(404).json({ msg: 'Código expirado!' });
    }

    await VerificationCode.deleteMany({ email });
    res.status(200).json({ msg: 'Código verificado com sucesso!' });  
  } catch (error) {
    res.status(500).json({ msg: 'Erro ao verificar o código', error: error.message });
  }
}
