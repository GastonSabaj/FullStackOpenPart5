const testingRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')

testingRouter.post('/reset', async (request, response) => {
  await Note.deleteMany({})
  await User.deleteMany({})

  const notesCount = await Note.estimatedDocumentCount()
  const usersCount = await User.estimatedDocumentCount()
  console.log('notesCount:', notesCount)
  console.log('usersCount:', usersCount)
  response.status(204).end()
})

module.exports = testingRouter