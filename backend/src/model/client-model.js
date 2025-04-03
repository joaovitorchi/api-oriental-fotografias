/**
 * @swagger
 * definitions:
 *   Client:
 *     type: object
 *     properties:
 *       clientId:
 *         type: integer
 *         description: ID único do cliente
 *       name:
 *         type: string
 *         description: Nome completo
 *       email:
 *         type: string
 *         format: email
 *         description: E-mail principal
 *       phone:
 *         type: string
 *         description: Telefone para contato
 *       address:
 *         type: string
 *         description: Endereço completo
 *       notes:
 *         type: string
 *         description: Observações sobre o cliente
 *       profilePhotoUrl:
 *         type: string
 *         description: URL da foto de perfil
 *       createdAt:
 *         type: string
 *         format: date-time
 *       updatedAt:
 *         type: string
 *         format: date-time
 */
class Client {
    constructor(dto) {
      this.clientId = dto.client_id || dto.clientId;
      this.name = dto.name;
      this.email = dto.email || null;
      this.phone = dto.phone || null;
      this.address = dto.address || null;
      this.notes = dto.notes || null;
      this.profilePhotoUrl = dto.profile_photo_url || dto.profilePhotoUrl || null;
      this.createdAt = new Date(dto.created_at || Date.now());
      this.updatedAt = new Date(dto.updated_at || Date.now());
    }
  
    validate() {
      if (!this.name) throw new Error("Client name is required");
      if (this.email && !this.validateEmail(this.email)) {
        throw new Error("Invalid email format");
      }
      return true;
    }
  
    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }
  }
  
  module.exports = Client;