const testingRouter = require('express').Router()
const Blog = require('../models/Blog')
const User = require('../models/User')

//Este endpoint sirve para reiniciar la base de datos de testing antes de cada prueba
testingRouter.post('/reset', async (request, response) => {
  try {
      const usersBefore = await User.find({}).exec();
      console.log('usersBefore.length:', usersBefore.length);

      await Blog.deleteMany({});
      await User.deleteMany({});

      const blogsCount = await Blog.estimatedDocumentCount();
      const usersCount = await User.estimatedDocumentCount();
      console.log('blogsCount:', blogsCount);
      console.log('usersCount:', usersCount);
      response.status(204).end();
  } catch (error) {
      console.error('Error al resetear la base de datos:', error);
      response.status(500).send('Error al reiniciar la base de datos');
  }
});

module.exports = testingRouter