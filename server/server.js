require('./config/config')

const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
// const cors = require('cors')
const app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
// app.use(cors())
 
app.use(require('./routes/users'))

mongoose.connect(process.env.URLDB, 
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  }, 
  (err, res) => {
    if(err) throw err
    console.log('***DB online!!***')
})
 
app.listen(process.env.PORT, ()=> {
    console.log(`Server running, port ${process.env.PORT}`)
})