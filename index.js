
const app = require('./app') // la aplicación Express real
const config = require('./utils/config')
const logger = require('./utils/logger')

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)


mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })


const PORT = config.PORT
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})