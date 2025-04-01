const crypto = require("crypto");
const pool = require("../database/pool");
const User = require("../model/user-model");
const logger = require("../utils/logger");
const { whereAndStackError } = require("../utils/where-and-stack-error");
// const FornecedorRepository = require("../fornecedor/fornecedor-repository");
// const PermissaoRepository = require("../permissao/permissao-repository");
// const GrupoRepository = require("../grupo/grupo-repository");
// const PrepareSql = require("../../utils/prepare-sql");

class UserRepository {
  async genUidNewPassword(user){
    try {
      const sql = "UPDATE cup.usuario SET uid_new_password = $1 where id_usuario = $2 ";
      const uidNewPassword = crypto.randomBytes(10).toString("base64");
      await pool.query(sql, [
        uidNewPassword,
        user.userId,
      ]);

      return uidNewPassword;
    } catch (error) {
      logger.error(`Não foi possível gerar token para o usuário: ${user}. ${whereAndStackError(__filename, error)}`);
      throw new Error("Não foi possível gerar token para o usuário");
    }
  }
  
  async updatePassword(userId, password) {
    try {
      const user = new User({});
      user.encryptPassword(password);

      const sql = "UPDATE cup.usuario SET password_hash = $1, uid_new_password = NULL where id_usuario = $2 RETURNING *;";

      const result = await pool.query(sql, [
        user.passwordHash,
        userId,
      ]);
      
      if (result.rowCount < 1) {
        throw new Error("Nada foi atualizado.");
      }
      return true;
    } catch (error) {
      logger.error(`Não foi possível atualizar a senha do usuário. ${whereAndStackError(__filename, error)}`);
      throw new Error("Não foi possível atualizar a senha para este usuário.");
    }
  }

  async updatePasswordFromUid(uid_new_password, password){
    try {
      const user = new User({});
      user.encryptPassword(password);
  
      const sql = 
        `UPDATE cup.usuario SET 
          password_hash = $1, 
          uid_new_password = NULL, 
          generate_password = FALSE 
        WHERE uid_new_password = $2
        RETURNING *;`;

      const result = await pool.query(sql, [
        user.passwordHash,
        uid_new_password,
      ]);
      
      if (result.rowCount < 1) {
        throw new Error("Nada foi atualizado.");
      }
      return true;
    } catch (error) {
      logger.error(`Não foi possível atualizar a senha do usuário. ${whereAndStackError(__filename, error)}`);
      throw new Error("Não foi possível atualizar a senha para este usuário.");
    }
  }

  async resetPassword(user) {
    try {
      const sql =
      `UPDATE cup.usuario SET 
        password_hash = $1,
        generate_password = TRUE,
        uid_new_password = $2
      WHERE id_usuario = $3 
      RETURNING *;`;

      const { rows } = await pool.query(sql, [
        user.passwordHash,
        user.uidNewPassword,
        user.userId
      ]);

      const users = this.factoryUser(rows, false);
      return users[0] || null;
    } catch (error) {
      logger.error(`Não foi possível gerar a senha. ${whereAndStackError(__filename, error)}`);
      throw new Error("Não foi possível gerar a senha.");
    }
  }
  
  async updateUser(user) {
    try {
      const sql = 
        `UPDATE cup.usuario SET 
          nome = $1, 
          idcnpj_cpf = $2, 
          email = $3,
          id_situacao_usuario = $4 
        WHERE id_usuario = $5 
        RETURNING *;`;

      const { rows } = await pool.query(sql, [
        user.nome,
        user.idcnpj_cpf,
        user.email,
        user.idSituacaoUsuario,
        user.userId,
      ]);

      const users = this.factoryUser(rows, false);
      return users[0] || null;
    } catch (error) {
      logger.error(`Não foi possível atualizar o usuário. ${whereAndStackError(__filename, error)}`);
      throw new Error("Não foi possível atualizar este usuário.");
    }
  }

  async createUser(userDto) {
    try {
    const sql =
      `INSERT INTO users.user (
        name, 
        email,  
        password_hash, 
        active
      ) VALUES (
        INITCAP($1), $2, $3, $4
      ) 
      RETURNING *;`;

      const { rows } = await pool.query(sql, [
        userDto.name,
        userDto.email,
        userDto.passwordHash,
        true
      ]);
      const user = this.factoryUser(rows, false);
      return user[0] || null;
    } catch (error) {
      logger.error(`Não foi possível inserir o usuário. ${whereAndStackError(__filename, error)}`);
      throw new Error("Não foi possível inserir este usuário.");
    }
  }

  async userExists(email, cpf) {
    try {
      const { rows } = await pool.query(
        "SELECT id_usuario FROM cup.usuario WHERE email = $1 OR cpf = $2",
        [email, cpf]
      );
      return rows.length > 0;
    } catch (error) {
      logger.error(`Não foi possível encontrar este email de usuário. ${whereAndStackError(__filename, error)}`);
      throw new Error("Não foi possível encontrar este email de usuário.");
    }
  }

  async getUserById(userId, showHash = false) {
    try {
      let users = await this.genericListUsersBy(
        "SELECT * FROM cup.usuario WHERE id_usuario = $1",
        [userId], 
        showHash
      );

      const user = users[0];

      const permissoesrepo = new PermissaoRepository();
      const grupoRepo = new GrupoRepository();
      user.permissoes = await permissoesrepo.listPermissoesFromUsuario(user.userId);
      user.permissoesAdicionais = await permissoesrepo.listPermissoesAdicionaisOfUsuario(user.userId);
      user.grupos = await grupoRepo.listGruposByuserId(user.userId);

      return user;
    } catch (error) {
      logger.error(`Não foi possível encontrar o usuário. ${whereAndStackError(__filename, error)}`);
      throw new Error("Não foi possível encontrar este usuário.");
    }
  }

  /**
   * 
   * @param {integer} userId 
   * @returns {Promise<string>}
   */
  async getUserNameById(userId) {
    try {
      const { rows } = await pool.query(
        `SELECT INITCAP(u."nome") nome
        FROM cup.usuario u
        WHERE id_usuario = $1;`,
        [userId]
      );
      return rows ? rows[0].nome : null;
    } catch (error) {
      logger.error(`Não foi possível encontrar o nome do usuario. ${whereAndStackError(__filename, error)}`);
      throw new Error("Não foi possível encontrar nome deste usuário.");
    }
  }

  async getUsuarioByCpf(cpf, showHash = false) {
    try {
      var users = await this.genericListUsersBy(
        "SELECT * FROM cup.usuario where cpf = $1",
        [cpf],
        showHash
      );

      return users[0];
    } catch (error) {
      logger.error(`Não foi possível encontrar este cpf de usuário. ${whereAndStackError(__filename, error)}`);
      throw new Error("Não foi possível encontrar este cpf de usuário.");
    }
  }

  async getUserByEmail(email, showHash = false) {
    try {
      var users = await this.genericListUsersBy(
        "SELECT * FROM users.user WHERE email = $1;",
        [email],
        showHash
      );

      return users && users.length > 0 ? users[0] : null;
    } catch (error) {
      logger.error(`Não foi possível encontrar usuario com este email. ${whereAndStackError(__filename, error)}`);
      throw new Error("Não foi possível encontrar usuario com este email.");
    }
  }

  async findUserByPortionOfEmail(email, showHash = false) {
    try {
      const users = await this.genericListUsersBy(
        "SELECT * FROM cup.usuario where email like $1 order by nome",
        ["%" + email + "%"],
        showHash
      );

      return users;
    } catch (error) {
      logger.error(`Não foi possível localizar este email de usuário. ${whereAndStackError(__filename, error)}`);
      throw new Error("Não foi possível encontrar usuario com este email.");
    }
  }
  
  async listAllUsers() {
    try {
      return await this.genericListUsersBy(
        "SELECT * FROM cup.usuario ORDER BY nome;",
        []
      );
    } catch (error) {
      logger.error(`Não foi possível encontrar usuários. ${whereAndStackError(__filename, error)}`);
      throw new Error("Não foi possível encontrar usuários.");
    }
  }

  async genericListUsersBy(stringQuery, arrayParams, showHash = false) {
    try {
      const { rows } = await pool.query(stringQuery, arrayParams);
      const users = this.factoryUser(rows, showHash);

      return users;
    } catch (error) {
      logger.error(`Não foi possível listar usuários. ${whereAndStackError(__filename, error)}`);
      throw new Error("Ocorreu um erro na consulta.");
    }
  }

  async findUsersByPortionOfNome(nome) {
    try {
      return await this.genericListUsersBy(
        "SELECT * FROM cup.usuario where upper(nome) like  $1 ORDER BY nome",
        ["%" + nome.toUpperCase() + "%"]
      );
    } catch (error) {
      logger.error(`Não foi possível encontrar usuarios por este nome. ${whereAndStackError(__filename, error)}`);
      throw new Error("Não foi possível encontrar este nome de usuário.");
    }
  }

  async getUserByName(userName, showHash = false) {
    try {
      const users = await this.genericListUsersBy(
        "SELECT * FROM cup.usuario where nome_usuario = $1",
        [userName],
        showHash
      );
      return users[0];
    } catch (error) {
      logger.error(`Não foi possível encontrar este usuario por nome de usuario. ${whereAndStackError(__filename, error)}`);
      throw new Error("Não foi possível encontrar este nome de usuário.");
    }
  }

  async verifyCpfWasUsed(userId, cpf) {
    var userByCpf = await this.getUsuarioByCpf(cpf);
    return userByCpf && userByCpf.userId !== userId;
  }

  async verifyEmailWasUsed(userId, email) {
    var userByEmail = await this.getUserByEmail(email);
    return userByEmail && userByEmail.userId != userId;
  }

  factoryUser(rows, showHash = false) {
    let users = [];

    rows.forEach((row) => {
      let userDto = {};
      userDto.userId = row.user_id;
      userDto.name = row.name;
      userDto.email = row.email;
      userDto.active = row.active;
      userDto.generatePassword = row.generate_password;
      userDto.uidNewPassword = row.uid_new_password;

      if (showHash) {
        userDto.passwordHash = row.password_hash;
      }

      let user = new User(userDto);

      users.push(user);
    });
    return users;
  }
}

module.exports = UserRepository;