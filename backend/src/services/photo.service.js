const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const sharp = require('sharp');
const logger = require('../utils/logger');
const { StorageError } = require('../utils/errors');

// Classe para gerenciar o serviço de armazenamento (AWS S3)
class StorageService {
  constructor() {
    // Inicializa o cliente S3
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY
      }
    });
    this.bucketName = process.env.S3_BUCKET_NAME;
  }

  /**
   * Faz o upload do arquivo para o S3 e gera uma thumbnail (se for uma imagem).
   * @param {Object} file - O arquivo a ser enviado.
   * @param {Object} options - Opções adicionais como pasta e metadados.
   * @returns {Object} - Dados do arquivo após o upload.
   */
  async upload(file, options = {}) {
    try {
      const { folder, metadata } = options;
      const fileKey = folder ? `${folder}/${file.originalname}` : file.originalname;

      // Upload do arquivo original
      await this.s3Client.send(new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
        Metadata: metadata
      }));

      let thumbnailUrl = null;

      // Se for uma imagem, cria uma thumbnail
      if (file.mimetype.startsWith('image/')) {
        const thumbnailBuffer = await sharp(file.buffer)
          .resize(300, 300, { fit: 'inside' })
          .toBuffer();

        const thumbnailKey = `thumbnails/${fileKey}`;
        await this.s3Client.send(new PutObjectCommand({
          Bucket: this.bucketName,
          Key: thumbnailKey,
          Body: thumbnailBuffer,
          ContentType: file.mimetype
        }));

        thumbnailUrl = `${process.env.S3_PUBLIC_URL}/${thumbnailKey}`;
      }

      // Obtém os metadados da imagem
      let imageMetadata = {};
      if (file.mimetype.startsWith('image/')) {
        const imageMeta = await sharp(file.buffer).metadata();
        imageMetadata = {
          width: imageMeta.width,
          height: imageMeta.height,
          format: imageMeta.format
        };
      }

      return {
        url: `${process.env.S3_PUBLIC_URL}/${fileKey}`,
        thumbnailUrl,
        metadata: { ...metadata, ...imageMetadata },
        ...imageMetadata,
        size: file.size,
        type: file.mimetype
      };
    } catch (error) {
      logger.error('Storage upload failed:', error);
      throw new StorageError('Falha ao fazer upload do arquivo');
    }
  }

  /**
   * Deleta um arquivo do S3.
   * @param {string} fileUrl - URL do arquivo a ser deletado.
   * @returns {Object} - Objeto indicando sucesso da operação.
   */
  async delete(fileUrl) {
    try {
      const fileKey = fileUrl.replace(`${process.env.S3_PUBLIC_URL}/`, '');
      await this.s3Client.send(new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey
      }));
      return { success: true };
    } catch (error) {
      logger.error('Storage delete failed:', error);
      throw new StorageError('Falha ao excluir arquivo');
    }
  }

  /**
   * Obtém o arquivo a partir do S3.
   * @param {string} fileUrl - URL do arquivo a ser obtido.
   * @returns {Stream} - Corpo do arquivo.
   */
  async getFileStream(fileUrl) {
    try {
      const fileKey = fileUrl.replace(`${process.env.S3_PUBLIC_URL}/`, '');
      const response = await this.s3Client.send(new GetObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey
      }));
      return response.Body;
    } catch (error) {
      logger.error('Storage get failed:', error);
      throw new StorageError('Falha ao obter arquivo');
    }
  }
}

module.exports = new StorageService();
