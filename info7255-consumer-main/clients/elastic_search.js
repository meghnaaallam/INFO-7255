const { Client } = require('@elastic/elasticsearch')
const config = require("./../utils/config")
const fs = require("fs");
const path = require("path");

const es_client = new Client({
  node: 'https://localhost:9200',
  auth: {
    username: config.ELASTIC_USERNAME,
    password: config.ELASTIC_PASSWORD
  },
  tls: {
    ca: path.resolve(__dirname, './http_ca.crt'),
    rejectUnauthorized: false
  }
})


module.exports = es_client;
