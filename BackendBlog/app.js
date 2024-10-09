const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const notesRouter = require('./controllers/BlogController')
const usersRouter = require('./controllers/UserController')
const loginRouter = require('./controllers/LoginController')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

//Lo que hago es hacer un enrutador que arma las rutas a partir de /api/blogs
// Aplicar el tokenExtractor y userExtractor solo a las rutas que lo necesiten
app.use('/api/blogs', middleware.tokenExtractor, middleware.userExtractor, notesRouter)
app.use('/api/users', usersRouter); // Para operaciones públicas
app.use('/api/users/:id', middleware.tokenExtractor, middleware.userExtractor, usersRouter); // Para obtener datos del usuario
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app