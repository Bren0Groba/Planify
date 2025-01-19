// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const dbuser = process.env.DB_USER;
    const dbpass = process.env.DB_PASS;

    await mongoose.connect(
      `mongodb+srv://${dbuser}:${dbpass}@planify.fnifi.mongodb.net/?retryWrites=true&w=majority&appName=Planify`,
       {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log('Conectado ao MongoDB Atlas!');
  } catch (err) {
    console.error('Erro ao conectar ao MongoDB:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
