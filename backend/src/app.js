require("dotenv").config({
  path: ".env",
});

const express = require("express");
const compression = require("compression");
const cors = require("cors");
const swaggerFile = require('../swagger')
const swaggerUI = require("swagger-ui-express");
const swaggerJSDOC = require("swagger-jsdoc");
const path = require('path');
const bodyParser = require("body-parser");

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
    this.express.use(bodyParser.json({ type: "application/vnd.api+json", strict: false }));
    const specs = swaggerJSDOC(swaggerFile);
    this.express.use('/doc', swaggerUI.serve, swaggerUI.setup(specs));
    this.express.use(express.static(path.join(__dirname, '../', 'build')));
  }

  routes() {
    this.express.use("/api/v1", require("./routes/index-routes"));
    this.express.use("/api/v1", require("./routes/login-routes"));
    this.express.use("/api/v1/user", require("./routes/user-routes"));
    this.express.use("/api/v1/dashboard", require("./routes/dashboard-routes"));
    this.express.use("/api/v1/service", require("./routes/service-routes"));
    this.express.use("/api/v1/service/file", require("./routes/service-file-routes"));
    this.express.use("/api/v1/service/schedule", require("./routes/service-schedule-routes"));

    /** React */
    this.express.get('/*', (req, res) => {
      res.sendFile(path.join(__dirname, '../', 'build', 'index.html'));
    });
  }
}

module.exports = new AppController().express;
