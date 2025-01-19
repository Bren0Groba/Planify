const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Middleware para hash da senha antes de salvar ou atualizar
UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

// Método estático para criar hash manualmente (caso necessário)
UserSchema.statics.hashPassword = function (password) {
    return bcrypt.hash(password, 10);
};

// Método para comparar a senha fornecida com o hash armazenado
UserSchema.methods.isPasswordValid = function (password) {
    return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', UserSchema, 'users');

module.exports = User;
