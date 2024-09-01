const express = require('express')
const config = require('./utils/config')
const logger = require('./utils/logger')
const app = express()
const cors = require('cors')


const mongoose = require('mongoose')
mongoose.set('strictQuery', false)


mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

const blogerRouter = require('./controllers/blogs')

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogerRouter)

module.exports = app

