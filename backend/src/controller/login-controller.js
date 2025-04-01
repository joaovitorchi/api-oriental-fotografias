const { body, validationResult } = require("express-validator");
const UserRepository = require("../repository/user-repository");
const authService = require("../service/auth-service");
const { whereAndStackError } = require("../utils/where-and-stack-error");
const logger = require("../utils/logger");
const EmailService = require("../service/email-service");
const fs = require("fs");

var self;

class LoginController {
  constructor() {
    self = this;
  }

  validate() {
    return [
      body("email", "O e-mail é inválido.").isEmail(),
     
      body(
        "password",
        "Senha deve ser informada."
      ).isLength({ min: 3 }),
    ];
  }

  validateChangePassword() {
    return [
      body(
        "password",
        "Senha deve conter entre 8 e 25 caracteres, incluindo letras maiúsculas, letras minúsculas, números e símbolos."
      ).isStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        returnScore: false,
      }),
      body(
        "password",
        "Senha deve conter entre 8 e 25 caracteres, incluindo letras maiúsculas, letras minúsculas, números e símbolos."
      ).isLength({ min: 8, max: 25 }),
      body("validation_code", "Precisa de um código de validação").isLength({ min: 10 }),
    ];
  }

  validateLostPassword() {
    return [body("email", "Email Invalido").isEmail()];
  }

  /**
   * @swagger
   * /password/recovery:
   *   post:
   *     summary: Troca a Senha depois da recuperação.
   *     description: Funcionalidade para trocar a senha depois de recuperação, passando um token recebido por email e a nova senha.
   *     tags:
   *       - Autenticação
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *            type: object
   *            properties:
   *              validationCode:
   *                type: string
   *              password:
   *                type: string
   *     responses:
   *       200:
   *         description: Retorna mensagem.
   *         content:
   *           application/json:
   *             schema:
   *              type: object
   *              properties:
   *                msg:
   *                  type: string
   *       400:
   *         description: Ocorreu um erro na atualização da senha.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 msg:
   *                   type: string
   */
  async changePassword(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        logger.error(
          `Código: ${req.body.validationCode} Tentou trocar a senha, mas ocorreu um erro de validação. ${__filename} `
        );
        return res.status(400).json({ errors: errors.array() });
      }

      await new UserRepository().updatePasswordFromUid(
        req.body.validationCode,
        req.body.password
      );

      return res.status(200).send({ msg: "Senha atualizada." });
    } catch (error) {
      logger.error(
        `Código: [ ${req.body.validationCode} ] Ocorreu um erro na atualização da senha. ${whereAndStackError(__filename, error)}`
      );
      return res.status(400).send({ errors: [{ msg: error.message }] });
    }
  }

  /**
   * @swagger
   * /password/lost:
   *   post:
   *     summary: Solicita a recuperação de senha.
   *     description: Funcionalidade para recuperação de senha através de e-mail.
   *     tags:
   *       - Autenticação
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *            type: object
   *            properties:
   *              email:
   *                type: string
   *     responses:
   *       200:
   *         description: Retorna mensagem.
   *         content:
   *           application/json:
   *             schema:
   *              type: object
   *              properties:
   *                msg:
   *                  type: string
   *       400:
   *         description: Não foi possível solicitar a redefinição de senha.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 errors:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       msg:
   *                         type: string
   */
  async lostPassword(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        logger.error(
          `Email de recuperação de senha inválido : ${req.body.email} . ${__filename} `
        );
        return res.status(400).json({ errors: errors.array() });
      }

      const userRepository = new UserRepository();
      const user = await userRepository.getUserByEmail(req.body.email);

      if (!user || !user.userId) {
        throw new Error("Não foi encontrado nenhum usuário com este e-mail.");
      }
      const uid = await userRepository.genUidNewPassword(user);

      const emailService = new EmailService();
      const filePath = path.normalize(
        __dirname + "../template/email-template/alert.html"
      );
      const template = fs.readFileSync(filePath, { encoding: "utf-8" });
      await emailService.sendEmail(
        process.env.MAIL_FROM_ADDRESS,
        user.email,
        "Recuperação de Senha",
        template.replace(
          "$replaceLink",
          `${process.env.BASE_PATH_AND_DOMAIN}/auth/restore/${encodeURIComponent(uid)}`
        )
      );
      logger.info(
        `Email: [${req.body.email}] solicitou a recuperação de senha ${__filename}`
      );

      return res
        .status(200)
        .send({ msg: "Um link foi enviado para o e-mail informado." });
    } catch (error) {
      logger.error(
        `Email: [${req.body.email}] não conseguiu solicitar a recuperação de senha. ${whereAndStackError(__filename, error)}`
      );
      return res
        .status(400)
        .json({
          errors: [{ msg: "Não foi possível solicitar a redefinição de senha." }],
        });
    }
  }

  /**
   * @swagger
   * /login:
   *   post:
   *     summary: Efetua Login.
   *     description: Um post com uma definição de objeto e retorna confirmação e token.
   *     tags:
   *       - Autenticação
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *            type: object
   *            properties:
   *              email:
   *                type: string
   *              password:
   *                type: string
   *     responses:
   *       200:
   *         description: Retorna a situação e o token.
   *         content:
   *           application/json:
   *             schema:
   *              type: object
   *              properties:
   *                auth:
   *                  type: boolean
   *                token:
   *                  type: string
   *       400:
   *         description: Retorna erros de validação.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 errors:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       msg:
   *                         type: string
   *       401:
   *         description: Não foi possível fazer login.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 errors:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       msg:
   *                         type: string
   */
  async login(req, res) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const token = await self.doLogin(req.body.email, req.body.password);

      return res.status(200).send({
        auth: true,
        token: token,
      });
    } catch (error) {
      logger.error(`Falha ao efetuar login: ${whereAndStackError(__filename, error)}`);
      return res
        .status(401)
        .send({ errors: [{ msg: error.message }] });
    }
  }

  async loadPermissions(user) {
    await user.loadPermissions();

    if (user.permissions.length < 1) {
      logger.error("Falha ao efetuar login usuário sem permissões.");
      throw new Error("Usuário cadastrado sem permissões, favor entrar em contato com o administrador do sistema.");
    }
    return user;
  }

  async authenticate(password, user) {
    try {
      return user.comparePassword(password);
    } catch (error) {
      logger.error("Falha ao efetuar login" + error.stack);
      throw new Error("Falha na autenticação do sistema.");
    }
  }

  async doLogin(email, password) {
    const userRepository = new UserRepository();
    let user = await userRepository.getUserByEmail(email, true);
    let logged = false;

    if (!user) {
      logger.error("Falha ao efetuar login, usuário desconhecido: ");
      throw new Error("Usuário ou Senha incorretos.");
    }

    if (!user.active) {
      logger.error("Falha ao efetuar login, usuário inativo: " + user);
      throw new Error("Este usuário não está ativo.");
    }

    try {
      logged = await self.authenticate(password, user);
    } catch (errExc) {
      logger.error("Falha ao efetuar login" + errExc.stack);
      throw new Error("Erro inesperado.");
    }

    if (!logged) throw new Error("E-mail ou Senha incorretos.");

    user = await self.loadPermissions(user);
    logger.info(`Usuário: ${user.userId} Fez login. ${__filename}`);

    return authService.generateToken(user);
  }
}

module.exports = new LoginController();