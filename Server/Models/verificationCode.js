// models/VerificationCode.js
const mongoose = require('mongoose');

const VerificationCodeSchema = new mongoose.Schema({
  email: { type: String, required: true },
  code: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 3600 }, // Expira em 1 hora
});

module.exports = mongoose.model('VerificationCode', VerificationCodeSchema);
