const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const sharp = require('sharp');
const logger = require('../utils/logger');
const { StorageError } = require('../utils/errors');

class StorageService {
  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY
      }
    });
    this.bucketName = process.env.S3_BUCKET_NAME;
  }

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

      // Cria thumbnail se for imagem
      let thumbnailUrl = null;
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

      // Obtém metadados da imagem
      let imageMetadata = {};
      if (file.mimetype.startsWith('image/')) {
        const sharpImage = sharp(file.buffer);
        const metadata = await sharpImage.metadata();
        imageMetadata = {
          width: metadata.width,
          height: metadata.height,
          format: metadata.format
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