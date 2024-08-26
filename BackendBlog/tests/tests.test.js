/* PENDIENTE: Crear un mock object de la API para no tener que actualizar la base de datos en cada test */

const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const mongoose = require('mongoose')


const Blog = require('../models/Blog') 

const jwt = require('jsonwebtoken')
const User = require('../models/User') // Asegúrate de importar el modelo correcto

const getTokenForTest = async () => {
  // Buscar el primer usuario en la base de datos
  let user = await User.findOne()

  // Si no existe ningún usuario, crear uno nuevo para test
  if (!user) {
    user = new User({ username: 'testuser', password: 'testpassword' })
    await user.save()
  }

  // Generar un token para este usuario
  const userForToken = {
    username: user.username,
    id: user._id
  }

  return jwt.sign(userForToken, process.env.SECRET) // Usa tu clave secreta aquí
}

let token // Variable global para el token

//Este código se ejecuta antes de cada prueba
beforeEach(async () => {
  await Blog.deleteMany({})
  console.log('cleared')

  for (const blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
    console.log('saved')
  }

  token = await getTokenForTest() // Función que genera un token de prueba
  console.log('done')
})


// test('dummy returns one', () => {
//   const blogs = []

//   const result = listHelper.dummy(blogs)
//   assert.strictEqual(result, 1)
// })

// describe('total likes', () => {
//     const blogs = [
//         {
//           _id: "5a422a851b54a676234d17f7",
//           title: "React patterns",
//           author: "Michael Chan",
//           url: "https://reactpatterns.com/",
//           likes: 7,
//           __v: 0
//         },
//         {
//           _id: "5a422aa71b54a676234d17f8",
//           title: "Go To Statement Considered Harmful",
//           author: "Edsger W. Dijkstra",
//           url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
//           likes: 5,
//           __v: 0
//         },
//         {
//           _id: "5a422b3a1b54a676234d17f9",
//           title: "Canonical string reduction",
//           author: "Edsger W. Dijkstra",
//           url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
//           likes: 12,
//           __v: 0
//         },
//         {
//           _id: "5a422b891b54a676234d17fa",
//           title: "First class tests",
//           author: "Robert C. Martin",
//           url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
//           likes: 10,
//           __v: 0
//         },
//         {
//           _id: "5a422ba71b54a676234d17fb",
//           title: "TDD harms architecture",
//           author: "Robert C. Martin",
//           url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
//           likes: 0,
//           __v: 0
//         },
//         {
//           _id: "5a422bc61b54a676234d17fc",
//           title: "Type wars",
//           author: "Robert C. Martin",
//           url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
//           likes: 2,
//           __v: 0
//         }  
//       ]
  
//     test('the sum of all likes in the list equals to 36', () => {
//       const result = listHelper.totalLikes(blogs)
//       assert.strictEqual(result, 36)
//     })
//   })

// describe("favorite blog", () => {
//     const blogs = [
//         {
//           _id: "5a422a851b54a676234d17f7",
//           title: "React patterns",
//           author: "Michael Chan",
//           url: "https://reactpatterns.com/",
//           likes: 7,
//           __v: 0
//         },
//         {
//           _id: "5a422aa71b54a676234d17f8",
//           title: "Go To Statement Considered Harmful",
//           author: "Edsger W. Dijkstra",
//           url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
//           likes: 5,
//           __v: 0
//         },
//         {
//           _id: "5a422b3a1b54a676234d17f9",
//           title: "Canonical string reduction",  
//           author: "Edsger W. Dijkstra",
//           url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
//           likes: 12,
//           __v: 0
//         },
//         {
//           _id: "5a422b891b54a676234d17fa",
//           title: "First class tests",
//           author: "Robert C. Martin",
//           url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
//           likes: 10,
//           __v: 0
//         },
//         {
//           _id: "5a422ba71b54a676234d17fb",
//           title: "TDD harms architecture",
//           author: "Robert C. Martin",
//           url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
//           likes: 0,
//           __v: 0
//         },
//         {
//           _id: "5a422bc61b54a676234d17fc",
//           title: "Type wars",
//           author: "Robert C. Martin",
//           url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
//           likes: 2,
//           __v: 0
//         }  
//       ]

//     test('the favorite blog is \'Canonical string reduction\' ', () => {
//       const result = listHelper.favoriteBlog(blogs)
//       assert.deepStrictEqual(result, {
//         title: "Canonical string reduction",
//         author: "Edsger W. Dijkstra",
//         likes: 12,
//         url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
//         _id: "5a422b3a1b54a676234d17f9",
//         __v: 0,
//       })
//     })
// })

// describe("most blogs", () => {
//   const blogs = [
//     {
//       _id: "5a422a851b54a676234d17f7",
//       title: "React patterns",
//       author: "Michael Chan",
//       url: "https://reactpatterns.com/",
//       likes: 7,
//       __v: 0
//     },
//     {
//       _id: "5a422aa71b54a676234d17f8",
//       title: "Go To Statement Considered Harmful",
//       author: "Edsger W. Dijkstra",
//       url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
//       likes: 5,
//       __v: 0
//     },
//     {
//       _id: "5a422b3a1b54a676234d17f9",
//       title: "Canonical string reduction",  
//       author: "Edsger W. Dijkstra",
//       url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
//       likes: 12,
//       __v: 0
//     },
//     {
//       _id: "5a422b891b54a676234d17fa",
//       title: "First class tests",
//       author: "Robert C. Martin",
//       url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
//       likes: 10,
//       __v: 0
//     },
//     {
//       _id: "5a422ba71b54a676234d17fb",
//       title: "TDD harms architecture",
//       author: "Robert C. Martin",
//       url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
//       likes: 0,
//       __v: 0
//     },
//     {
//       _id: "5a422bc61b54a676234d17fc",
//       title: "Type wars",
//       author: "Robert C. Martin",
//       url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
//       likes: 2,
//       __v: 0
//     }  
//   ]

//   test('the author with most blogs is \'Robert C. Martin\' ', () => {
//     const result = listHelper.mostBlogs(blogs)
//     assert.deepStrictEqual(result, {
//       author: "Robert C. Martin",
//       blogs: 3
//     })
//   })
// })

// describe('Most likes author', () => {
//   const blogs = [
//     {
//       _id: "5a422a851b54a676234d17f7",
//       title: "React patterns",
//       author: "Michael Chan",
//       url: "https://reactpatterns.com/",
//       likes: 7,
//       __v: 0
//     },
//     {
//       _id: "5a422aa71b54a676234d17f8",
//       title: "Go To Statement Considered Harmful",
//       author: "Edsger W. Dijkstra",
//       url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
//       likes: 5,
//       __v: 0
//     },
//     {
//       _id: "5a422b3a1b54a676234d17f9",
//       title: "Canonical string reduction",
//       author: "Edsger W. Dijkstra",
//       url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
//       likes: 12,
//       __v: 0
//     },
//     {
//       _id: "5a422b891b54a676234d17fa",
//       title: "First class tests",
//       author: "Robert C. Martin",
//       url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
//       likes: 10,
//       __v: 0
//     },
//     {
//       _id: "5a422ba71b54a676234d17fb",
//       title: "TDD harms architecture",
//       author: "Robert C. Martin",
//       url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
//       likes: 0,
//       __v: 0
//     },
//     {
//       _id: "5a422bc61b54a676234d17fc",
//       title: "Type wars", 
//       author: "Robert C. Martin",
//       url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
//       likes: 2,
//       __v: 0
//     }  
//   ]

//   test('the author with most likes is \'Edsger W. Dijkstra\' ', () => {
//     const result = listHelper.mostLikes(blogs)
//     assert.deepStrictEqual(result, {
//       author: "Edsger W. Dijkstra",
//       likes: 17
//     })
//   })
// })

test.only('blogs are returned as json', async () => {
  await api
    .get('/api/blogs/')
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test.only('total number of blogs equals to the origin number of blogs', async () => {

  const response = await api.get('/api/blogs/').set('Authorization', `Bearer ${token}`)

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test.only('blog posts have an "id" property by default', async () => {
  const response = await api.get('/api/blogs/').set('Authorization', `Bearer ${token}`)
  const blogs = response.body
  //console.log(blogs)

  blogs.forEach(blog => {
    assert.strictEqual(blog.id, blog._id.toString())
  })
})

test.only('a valid blog can be added', async () => {
  const newBlog = {
    title: 'async/await simplifies making async calls',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7
  }

  await api
    .post('/api/blogs').set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  const titles = blogsAtEnd.map(b => b.title)

  assert(titles.includes('async/await simplifies making async calls'))
  assert(blogsAtEnd.length === helper.initialBlogs.length + 1)
})

test.only('if the property \'likes\' is missing, it will default to 0', async () => {
  const newBlog = {
    title: 'async/await simplifies making async calls',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/'
  }

  await api
    .post('/api/blogs').set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  const likes = blogsAtEnd.map(b => b.likes)

  assert(likes.includes(0))
  assert(blogsAtEnd.length === helper.initialBlogs.length + 1)
})

test.only('if title or url property is missing, an error is returned', async () => {
  const newBlog = {
    author: 'Michael Chan',
    likes: 7
  }

  await api
    .post('/api/blogs').set('Authorization', `Bearer ${token}`)
    .send(newBlog)  
    .expect(400) //Chequeo que de el status 400 de error

  //Chequeo que el blog no se ha añadido
  const blogsAtEnd = await helper.blogsInDb()
  assert(blogsAtEnd.length === helper.initialBlogs.length)
})

//Agrupo por tests de delete de un blog
describe.only('Deletion of a blog', () => {
  //Test de delete de un blog por id
  test.only("Deleting a blog by id", async () => {
    const newBlog = {
      title: 'async/await simplifies making async calls',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7
    }
    const blog = await api
      .post('/api/blogs').set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)  
  
    await api
      .delete(`/api/blogs/${blog.body.id}`).set('Authorization', `Bearer ${token}`)
      .expect(204)  
      
    
    const blogsAtEnd = await helper.blogsInDb()
    assert(blogsAtEnd.length === helper.initialBlogs.length)
  })
})

describe.only('Updating a blog', () => {
  //Test de update de un blog por id
  test.only("Updating a blog by likes", async () => {
    const newBlog = {
      title: 'async/await simplifies making async calls',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7
    }

    //Creo un nuevo blog
    const blog = await api
      .post('/api/blogs').set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)  
  
    //Updateo por likes (no hace falta especificar todos los campos a a actualizar)
    const blogUpdate = {
      likes: 9
    }
    await api
      .put(`/api/blogs/${blog.body.id}`).set('Authorization', `Bearer ${token}`)
      .send(blogUpdate)
      .expect(200)  
  })
})

describe.only("Creating a new user", () => {
  test.only("Creating a new user correctly", async () => {
    const newUser = {
      username: "test1",
      name: "test1",
      password: "test1"
    }

    //Atención! Si el usuario ya estaba creado por alguna razón, me va a devolver 400 bad request. 
    //El newUser NO tiene que existir en la base de datos.
    await api
      .post('/api/users').set('Authorization', `Bearer ${token}`)
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  })

  test.only("Creating a new user with an existing username", async () => {
    const newUser = {
      username: "test1",
      name: "test1",
      password: "test1"
    }
    await api
      .post('/api/users').set('Authorization', `Bearer ${token}`)
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })

})




after(async () => {
  await mongoose.connection.close()
})