const axios = require('axios');

const AXIOS_IMGBB_INSTANCE = axios.create({
  baseURL: process.env.IMGBB_BASE_URL,
  timeout: 60000,
});

module.exports = { AXIOS_IMGBB_INSTANCE };