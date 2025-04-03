const nodemailer = require('nodemailer');
const logger = require('../utils/logger');
const { NotificationError } = require('../utils/errors');

class NotificationService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async sendEmail(to, subject, html) {
    try {
      const mailOptions = {
        from: `"Estúdio Fotográfico" <${process.env.EMAIL_FROM}>`,
        to,
        subject,
        html
      };

      await this.transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      logger.error('Email sending failed:', error);
      throw new NotificationError('Falha ao enviar email');
    }
  }

  async sendClientAlbumNotification(clientEmail, albumId, albumTitle) {
    const subject = 'Seu álbum de fotos está pronto!';
    const html = `
      <h1>Seu álbum "${albumTitle}" está pronto</h1>
      <p>Acesse o link abaixo para visualizar suas fotos:</p>
      <a href="${process.env.APP_URL}/albums/${albumId}">Ver Álbum</a>
      <p>Atenciosamente,<br>Equipe do Estúdio Fotográfico</p>
    `;

    return this.sendEmail(clientEmail, subject, html);
  }

  async sendPasswordResetEmail(email, resetToken) {
    const subject = 'Redefinição de Senha';
    const html = `
      <h1>Redefina sua senha</h1>
      <p>Clique no link abaixo para redefinir sua senha:</p>
      <a href="${process.env.APP_URL}/reset-password?token=${resetToken}">Redefinir Senha</a>
      <p>Se você não solicitou isso, ignore este email.</p>
    `;

    return this.sendEmail(email, subject, html);
  }
}

module.exports = new NotificationService();