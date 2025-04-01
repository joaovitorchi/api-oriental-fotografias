const logger = require("../utils/logger");
const { Pool } = require("pg");
const databasePrepare = require("../lib/database-prepare");

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  application_name: process.env.APP_NAME
});

module.exports = {
  async query(sql, params=[], debug = false) {
    params = this.normalizeToApiDatabase(params);

    if (debug) {
      logger.info(sql);
      logger.info(params);
    }

    if (params.length > 0) {
      sql = await databasePrepare.pgPrepare(sql, params);
    }

    try {
      const result = await pool.query(sql);

      const ret = {
        rows: result.rows,
        rowCount: result.rowCount
      };

      return ret;
    } catch (error) {
      logger.error(`Ocorreu um erro na SQL: ${error.message}`);
      console.error("*****************************")
      console.error(sql)
      console.error("*****************************")
      const errorToThrow = {
        code: error.code,
        msgDb: error.message,
        schema: error.schema,
        table: error.table
      };
      throw new Error(JSON.stringify(errorToThrow));
    }
  },

  normalizeToApiDatabase(arr) {
    for (let i = 0; i < arr.length; i++) {
      arr[i] = this.translateTypes(arr[i]);
    }

    return arr;
  },

  translateTypes(val) {
    if (val === true) return "t";
    if (val === false) return "f";
    if (val === undefined) return null;

    return val;
  },

  getConnectionString() {
    return `host=${DB_HOST} port=${process.env.DB_PORT} user=${process.env.DB_USER} dbname=${process.env.DB_DATABASE} password=${process.env.DB_PASSWORD}`;
  }

};
