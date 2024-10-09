import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import userService from './services/users'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const [notification, setNotification] = useState(null)
  const [notificationType, setNotificationType] = useState('')

  const blogFormRef = useRef()

  //Este useEffect sirve para que si ya estabas logeado, te continue logeado mas allá de que refresques la página
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
      userService.setToken(user.token)
    }
  }, [])

  //Cada vez que me logeo o me deslogeo, se ejecuta esto porque trackea el valor de user cuando cambia
  useEffect(() => {
    console.log("Se actualizó el usuario!!")
    if (user) {
      blogService.getAll().then(blogs =>
        setBlogs(blogs)
      )
    } else {
      setBlogs([])  // Limpiar los blogs cuando no hay usuario logueado
    }
  }, [user]) // Se ejecuta cada vez que cambia 'user'

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      const userForFrontend = {
        username: user.username,
        id: user.id,  // Almacena el id que devuelve el backend
        token: user.token
      }
  
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(userForFrontend)
      ) 
      blogService.setToken(user.token)
      userService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      console.log("Login exitoso!")
      setNotification("Login exitoso!")
      setNotificationType('success')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch (exception) {
      console.log("Login fallido!")
      setNotification("Login fallido!")
      setNotificationType('error')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          data-testid='username'
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          data-testid='password'
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )

  const addBlog = (blogObject) => {
    // event.preventDefault()
    
    // // Crear un objeto FormData desde el evento
    // const formData = new FormData(event.target)
    // // Convertir FormData en un objeto simple
    // const blogObject = Object.fromEntries(formData)
    // console.log(blogObject)
    blogFormRef.current.toggleVisibility()
    blogService
      .createBlog(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        //setErrorMessage("Blog creado exitosamente!")
        setNotification(`A new blog "${returnedBlog.title}" by ${returnedBlog.author} added!`)
        setNotificationType('success')
        setTimeout(() => {
          setNotification(null)
        }, 5000)
        //event.target.reset()  // Limpiar el formulario después de la creación

        console.log("El id de returnedBlog es: ",returnedBlog.id)
      })
      .catch(error => {
        console.log(error)
        setErrorMessage(error.response.data.error)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  const handleDeleteBlog = (id) => {
    console.log("Elimino el blog: ", id)
    setBlogs(blogs.filter(blog => blog.id !== id));  // Filtra el blog eliminado de la lista
    setNotification(`Blog deleted successfully!`);
    setNotificationType('success');
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  return (
    <div>
      {/* <Notification message={errorMessage} /> */}
      <Notification message={notification} type={notificationType} />

      {user === null ?
      loginForm() :
      <div>
          <p>{user.name} logged-in</p>
          <button onClick={() => {
            window.localStorage.clear()
            setUser(null) 
            blogService.setToken(null)
            userService.setToken(null)
          }} data-testid='logout-button'>logout</button>
  
          <Togglable buttonLabel="new blog"  ref={blogFormRef}>
            <BlogForm
              createBlog={addBlog}
            />
          </Togglable>
          
          <h2>blogs</h2>
          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map(blog =>
              <Blog key={blog.id} blog={blog} user={user} onDelete={handleDeleteBlog} />
            )}
        </div>
      }

    </div>
  )
}

export default App
