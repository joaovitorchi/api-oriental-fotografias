require('dotenv').config({ path: './.env' });
const User = require('../models/user.model.js');
const UserRepository = require('../repositories/user.repository.js');
const bcrypt = require('bcryptjs');

const userRepository = new UserRepository();

async function createAdmin() {
  try {
    const adminData = {
      name: "Administrador",
      email: "admin@estudio.com",
      username: "admin_estudio",
      password: "senhaSuperSegura123",
      role: "admin",
      profilePhoto: "https://estudio.com/profiles/admin.jpg",
    };

    // Verificar se o usuário já existe
    const existingUser = await userRepository.findByEmail(adminData.email);
    if (existingUser) {
      console.log("Admin já existe, processo de criação cancelado.");
      return;
    }

    // Criptografando a senha
    adminData.password = bcrypt.hashSync(adminData.password, 10);

    const admin = new User(adminData);

    // Criando o usuário admin
    const createdAdmin = await userRepository.create(admin);
    console.log("Admin criado com sucesso. ID:", createdAdmin.userId);
    return createdAdmin;

  } catch (error) {
    console.error("Erro ao criar admin:", error.message);
  }
}

module.exports = createAdmin;
