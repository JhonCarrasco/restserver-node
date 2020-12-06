const express = require('express')
// const mongoose = require('mongoose')
// const bodyParser = require('body-parser')
// // const cors = require('cors')
const app = express()


app.use(require('./users'))
app.use(require('./login'))

module.exports = app