const express = require('express')
const app = express()
const cors = require('cors')
const blogerRouter = require('./controllers/blogs')

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogerRouter)

module.exports = app

