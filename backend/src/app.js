require("dotenv").config({
  path: ".env",
});

const express = require("express");
const compression = require("compression");
const cors = require("cors");
const swaggerFile = require("../swagger");
const swaggerUI = require("swagger-ui-express");
const swaggerJSDOC = require("swagger-jsdoc");
const path = require("path");
const bodyParser = require("body-parser");

const createAdmin = require("./scripts/create-admin");  // Importando o script create-admin

class AppController {
  constructor() {
    this.express = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.express.use(compression());
    this.express.use(cors());
    this.express.use(express.json());
    this.express.use(
      bodyParser.json({ type: "application/vnd.api+json", strict: false })
    );
    const specs = swaggerJSDOC(swaggerFile);
    this.express.use("/doc", swaggerUI.serve, swaggerUI.setup(specs));
    this.express.use(express.static(path.join(__dirname, "../", "build")));
  }

  routes() {
    this.express.use("/api/v1", require("./routes/index"));
    this.express.use("/api/v1", require("./routes/auth.routes"));
    this.express.use("/api/v1/client", require("./routes/client.routes"));
    this.express.use("/api/v1/category", require("./routes/category.routes"));
    this.express.use("/api/v1/album", require("./routes/album.routes"));
    this.express.use("/api/v1/instagram", require("./routes/instagram.routes"));
    this.express.use("/api/v1/photo", require("./routes/photo.routes"));
    this.express.use("/api/v1/session", require("./routes/session.routes"));
    /** React */
    this.express.get("/*", (req, res) => {
      res.sendFile(path.join(__dirname, "../", "build", "index.html"));
    });
  }
}

// Executando o script para criar o admin ao iniciar o servidor
createAdmin()
  .then(() => {
    console.log("Admin criado com sucesso!");
  })
  .catch((error) => {
    console.error("Erro ao criar o admin:", error);
  });

module.exports = new AppController().express;
