const User = require('./models/user');
const UserRepository = require('./repositories/user-repository');
const bcrypt = require('bcryptjs');

// 1. Criando uma instância do repositório
const userRepository = new UserRepository();

// 2. Criando um novo usuário
async function createUser() {
  const userData = {
    name: "Ana Fotógrafa",
    email: "ana@estudio.com",
    username: "ana_fotografia",
    password: "senhaSuperSegura123",
    role: "photographer",
    profilePhoto: "https://estudio.com/profiles/ana.jpg"
  };

  const user = new User(userData);
  
  try {
    // Validação básica (poderia ser mais elaborada)
    if (!user.email || !user.passwordHash) {
      throw new Error("Dados do usuário inválidos");
    }

    // Salvar no banco de dados
    const createdUser = await userRepository.create(user);
    console.log("Usuário criado com ID:", createdUser.userId);
    
    return createdUser;
  } catch (error) {
    console.error("Erro ao criar usuário:", error.message);
    throw error;
  }
}

// 3. Autenticação de usuário
async function authenticateUser(email, password) {
  try {
    // Buscar usuário por email
    const user = await userRepository.findByEmail(email);
    
    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    // Verificar senha
    if (!user.comparePassword(password)) {
      throw new Error("Senha incorreta");
    }

    // Atualizar último login
    await userRepository.updateLastLogin(user.userId);
    
    console.log("Usuário autenticado:", user.name);
    return user;
  } catch (error) {
    console.error("Falha na autenticação:", error.message);
    throw error;
  }
}

// 4. Carregar permissões do usuário
async function loadUserPermissions(userId) {
  try {
    const user = await userRepository.findById(userId);
    
    // Carrega permissões padrão baseadas no role
    await user.loadPermissions();
    
    // Carrega permissões adicionais específicas
    await user.loadAdditionalPermissions();
    
    console.log(`Permissões do usuário ${user.name}:`, user.permissions);
    console.log(`Permissões adicionais:`, user.additionalPermissions);
    
    return user;
  } catch (error) {
    console.error("Erro ao carregar permissões:", error.message);
    throw error;
  }
}

// 5. Verificar permissões específicas
async function checkUserAbilities(userId) {
  const user = await loadUserPermissions(userId);
  
  console.log(`Pode fazer upload de fotos?`, user.canUploadPhotos());
  console.log(`Pode publicar conteúdo?`, user.canPublishContent());
  console.log(`Tem permissão para gerenciar usuários?`, user.hasPermission('manage_users'));
}

// 6. Atualizar usuário existente
async function updateUser(userId, updateData) {
  try {
    // Buscar usuário existente
    const user = await userRepository.findById(userId);
    
    // Aplicar atualizações
    if (updateData.name) user.name = updateData.name;
    if (updateData.email) user.email = updateData.email;
    if (updateData.profilePhoto) user.profilePhoto = updateData.profilePhoto;
    
    // Se estiver atualizando a senha
    if (updateData.password) {
      user.encryptPassword(updateData.password);
    }
    
    // Salvar alterações
    const updatedUser = await userRepository.update(user);
    console.log("Usuário atualizado:", updatedUser);
    
    return updatedUser;
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error.message);
    throw error;
  }
}

// 7. Exemplo de fluxo completo
async function main() {
  try {
    // Criar usuário
    const newUser = await createUser();
    
    // Autenticar
    const authenticatedUser = await authenticateUser("ana@estudio.com", "senhaSuperSegura123");
    
    // Carregar permissões
    await loadUserPermissions(authenticatedUser.userId);
    
    // Verificar habilidades
    await checkUserAbilities(authenticatedUser.userId);
    
    // Atualizar usuário
    await updateUser(authenticatedUser.userId, {
      name: "Ana Silva Fotógrafa",
      profilePhoto: "https://estudio.com/profiles/ana_silva.jpg"
    });
    
  } catch (error) {
    console.error("Erro no fluxo principal:", error);
  }
}

// Executar o exemplo
main();