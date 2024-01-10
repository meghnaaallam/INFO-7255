require("dotenv").config()

const PORT = process.env.PORT
const QUEUE_NAME = process.env.QUEUE_NAME
const ELASTIC_USERNAME = process.env.ELASTIC_USERNAME
const ELASTIC_PASSWORD = process.env.ELASTIC_PASSWORD

console.log(ELASTIC_USERNAME)
console.log(ELASTIC_PASSWORD)

module.exports = { PORT, QUEUE_NAME, ELASTIC_USERNAME, ELASTIC_PASSWORD }