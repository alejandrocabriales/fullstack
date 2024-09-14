const express = require('express')
const config = require('./utils/config')
const logger = require('./utils/logger')
const app = express()
const cors = require('cors')
const middleware = require('./utils/middleware')


const mongoose = require('mongoose')
mongoose.set('strictQuery', false)


mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })
  app.use(middleware.tokenExtractor)
 
const blogerRouter = require('./controllers/blogs')
const userRouter = require('./controllers/user')
const loginRouter = require('./controllers/login')

app.use(cors())
app.use(express.json())
 
app.use('/api/blogs',  blogerRouter)
app.use('/api/users', userRouter)
app.use('/api/login',loginRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app

