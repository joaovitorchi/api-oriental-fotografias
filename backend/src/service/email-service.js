const nodemailer = require("nodemailer");
const logger = require("../utils/logger");
const { whereAndStackError } = require("../utils/where-and-stack-error");

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: (process.env.MAIL_IS_SECURE === 'false' || !process.env.MAIL_IS_SECURE )? false : true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
      },
      tls: { rejectUnauthorized: false }

    });
  }

  async sendEmail(from, to, subject, htmlMessage, attachments = null) {
    if (!this.transporter) {
      logger.error(
        "Ocorreu um erro ao iniciar o servidor de emails " + __filename
      );
    }

    try {
      var info = await this.transporter.sendMail({
        from: from,
        to: process.env.NODE_ENV == 'production' ? to : process.env.MAIL_TO_HOMOLOG,
        subject: subject,
        html: htmlMessage,
        ...(attachments ? { attachments } : {})
      });
      logger.info(`E-mail enviado para: ${to} assunto: ${subject} -- ${info.messageId}`);
    } catch (error) {
      logger.error(`Ocorreu um erro ao tentar enviar o e-mail. ${whereAndStackError(__filename, error)}`);
      throw new Error("Erro ao enviar o e-mail.");
    }
  }
}

module.exports = EmailService;
