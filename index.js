
const app = require('./app') // la aplicación Express real
const config = require('./utils/config')
const logger = require('./utils/logger')



const PORT = config.PORT
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})