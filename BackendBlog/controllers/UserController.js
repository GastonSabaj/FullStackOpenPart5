const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/User')
const middleware = require('../utils/middleware')


//Obtengo todos los usuarios
usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1, likes: 1 })
    response.json(users)
})

// Esta ruta particularmente fue definida para que reciba acá particularmente los middleware de tokenExtractor y userExtractor
usersRouter.get('/:id', middleware.tokenExtractor, middleware.userExtractor, async (request, response) => {
  console.log("El usuario ess:", request.user)
  const user = await User.findById(request.user.id).populate('blogs', { title: 1, author: 1, url: 1, likes: 1 })
  response.json(user)     

  // const objectId = require('mongodb').ObjectId
  // const id = new objectId(request.params.id)

  //const user = await User.findById(id)
  //console.log("el user es: ",user)
  //const user = await User.findOne({ username: request.params.username })
  //console.log(user)

  //const user = await User.findById(request.params.id).populate('blogs', { title: 1, author: 1, url: 1, likes: 1 })
  //response.json(user)
})


//Creo un nuevo usuario
usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

//Tanto el username como el password deben tener al menos 3 caracteres. Además, el username debe ser único
  if(username.length < 3 || password.length < 3){
    return response.status(400).json({
      error: 'username and password must be at least 3 characters long'
    })
  }

  const existingUser = await User.findOne({ username: username })
  if (existingUser) {
    return response.status(400).json({
      error: 'username must be unique'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

//Borro un usuario
usersRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  const user = await User.findByIdAndRemove(id)
  if (!user) {
    return response.status(404).json({
      error: 'User not found'
    })
  }
  response.status(204).end()
})

module.exports = usersRouter