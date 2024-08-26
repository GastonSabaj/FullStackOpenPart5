/* 
    El enrutador es de hecho un middleware, que se puede utilizar para definir "rutas relacionadas" en un solo lugar, 
    que normalmente se coloca en su propio módulo.
*/
const blogRouter = require('express').Router()
const Blog = require('../models/Blog')
const User = require('../models/User')

const jwt = require('jsonwebtoken')
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}


blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs)
})
  
blogRouter.post('/', async (request, response, next) => {
  try{
    //Necesito chequear que el body tenga el title y url
    const body = request.body
    if(!body.title || !body.url){
      return response.status(400).json({
        error: 'title and url are required'
      })
    }

    const user = await User.findById(request.user.id)

    if (!user) {
      return response.status(400).json({
        error: 'No users found'
      });
    }

    body.user = user._id;

    const blog = new Blog(request.body)
    const savedBlog = await blog.save()
    
    // Agregar el blog al array de blogs del usuario y guardar el usuario
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();  // Guardar los cambios en el usuario


    response.status(201).json(savedBlog)
  }catch(exception){
    next(exception)
  }
})

blogRouter.delete('/:id', async (request, response,next) => {
  try{

    const userAutenticado = await User.findById(request.user.id)
    if(!userAutenticado){
      return response.status(401).json({ error: 'User not found' })
    }

    //Obtengo el usuario del blog
    const blog = await Blog.findById(request.params.id)
    if(!blog){
      return response.status(404).json({ error: 'Blog not found' })
    }

    const userCreadorDelBlog = await User.findById(blog.user.toString())
    console.log(blog)
    console.log(userCreadorDelBlog)
    console.log(userAutenticado)

    if(userAutenticado.id !== userCreadorDelBlog.id){
      return response.status(401).json({ error: 'Cannot delete blog because you are not the owner of the blog' })
    }

    await Blog.findByIdAndDelete(blog.id)
    
    // Elimino el blog de la lista de blogs del usuario
    userCreadorDelBlog.blogs = userCreadorDelBlog.blogs.filter(blog => blog.toString() !== request.params.id.toString())
    await userCreadorDelBlog.save();

    response.status(204).end()
  }catch(exception){
    next(exception)
  }
})

blogRouter.put('/:id', async (request, response, next) => {
  try {
    //Agarro el body de la request
    const body = request.body;

    //Chequeo el usuario autenticado exista
    const userAutenticado = await User.findById(request.user.id)
    if(!userAutenticado){
      return response.status(401).json({ error: 'User not found' })
    }

    //Creo un objeto blog con los datos para actualizar
    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes
    };

    //Busco por ID y actualizo el Blog, devolviendo el Blog actualizado
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true });
    response.status(200).json(updatedBlog).end();
  } catch (exception) {
    next(exception);
  }
});

module.exports = blogRouter