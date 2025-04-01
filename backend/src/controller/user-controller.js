const { validationResult, body } = require("express-validator");
const UserRepository = require("../repository/user-repository");
const logger = require("../utils/logger");
const { whereAndStackError } = require("../utils/where-and-stack-error");
const User = require("../model/user-model");
const { TYPE_USER, TYPE_USER_IDS } = require("../constants/user-constants");
const UserGroupRepository = require("../repository/user-group-repository");
const { GROUP } = require("../constants/group-constants");
const loginController = require("./login-controller");

var self;

class UserController {
  constructor() {
    self = this;
  }

  validateCreation() {
    return [
      body("name", "Nome deve ter entre 3 e 50 caracteres").isLength({ min: 3, max: 50 }),
      
      body("name", "Nome de usuário não pode ter números").isAlpha("pt-BR", {
        ignore: " ",
      }),

      body("email", "Email inválido").isEmail().isLength({ min: 6, max: 90 })
        .custom(async (value) => {
          return await self.testEmailExists(value);
        }),

      body("password", "A senha não atende aos requisitos mínimos.")
        .optional({ nullable: true, checkFalsy: true })
        .isStrongPassword({
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
          returnScore: false,
        }),
      body("password", "Senha deve ter 8 caracteres")
        .optional({ nullable: true, checkFalsy: true })
        .isLength({ min: 8, max: 50 }),
    ];
  }

  async testEmailExists(email) {
    const user = await new UserRepository().getUserByEmail(email);
    if (user) {
      throw new Error("Este e-mail já está cadastrado.");
    }
    return true;
  }

  async createUser(req, res) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userDto = new User(req.body);
      const user = await new UserRepository().createUser(userDto);
      await self.associateUserGroup(user.userId, 1);
      const token = await loginController.doLogin(req.body.email, req.body.password);

      return res.status(200).send({ msg: "Success.", token });
    } catch (error) {
      logger.error(`Erro ao criar o usuário. ${whereAndStackError(__filename, error)}`);
      return res.status(400).send({ 
        errors: [{ msg: error.message }] 
      });
    }
  }

  async associateUserGroup(userId, typeUserId) {
    const userGroupRepository = new UserGroupRepository();

    switch (typeUserId) {
      case TYPE_USER.SERVICE_PROVIDER:
        await userGroupRepository.associateUserGroup(userId, GROUP.SERVICE_PROVIDER);
        break;
    
      case TYPE_USER.SERVICE_CLIENT:
        await userGroupRepository.associateUserGroup(userId, GROUP.SERVICE_CLIENT);
        break;
    
      default:
        break;
    }
  }
}

module.exports = new UserController();