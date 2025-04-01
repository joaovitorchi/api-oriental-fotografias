const swaggerOptions = {
  definition:{
    info: {
       title: 'API Oriental Fotografias',
       version: '1.0.0', 
       description: 'Esse é um sistema desenvolvido com a finalidade de construir um site interativo para um estudio de fotografia.', 
     },
     servers: [
      {
        url: '/api/v1',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          name: 'Authorization',
          in: 'header',
          description: 'JWT authorization token',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  
  // Path to the API docs
  // Note that this path is relative to the current directory from which the Node.js is ran, not the application itself.
  apis: ['./src/**/*.js'],
};

module.exports = swaggerOptions;
