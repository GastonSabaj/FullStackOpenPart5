import { useState, useEffect } from 'react';
import  blogService  from '../services/blogs'
import userService from '../services/users'

const Blog = ({ blog, onDelete, user, onLikeHandler }) => {
  
  const [visible, setVisible] = useState(false)
  const [blogObject, setBlogObject] = useState(blog)
  //const [likes, setLikes] = useState(blog.likes)

  useEffect(() => {
    console.log("Actualizo el blog!")
    setBlogObject(blogObject)
  }, [blogObject])

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const addLike = () => {
    const updatedBlog = { ...blogObject, likes: blogObject.likes + 1 };
    
    blogService.addLikesToBlog(blogObject.id, updatedBlog)
      .then(() => {
        setBlogObject(updatedBlog);
        console.log(`Incrementé en 1 los likes del blog: ${blogObject.title}`);
      })
      .catch(err => console.log(err));

    if(onLikeHandler) onLikeHandler();
  };

  const deleteBlog =  () => {
    //console.log(user)
    //console.log(blogObject)
    //Obtengo los datos del usuario logeado
    userService.getUser(user).then((usuarioLogeado) => {
      //Si el usuario logeado coincide con el usuario creador del blog, entonces puedo borrarlo
      if(blogObject.user.id === usuarioLogeado.id){
        if(window.confirm(`Do you really want to delete the blog "${blogObject.title}" by ${blogObject.author}?`)){
          blogService
            .deleteBlog(blogObject.id)
            .then(() => {
              console.log(`Eliminó el blog: ${blogObject.title}`);
              onDelete(blogObject.id);  // Llama a la función de actualización pasada como prop
            })
            .catch(err => console.log(err));
        }
      }
      else{
        window.alert("No puedes borrar un blog que no te pertenece");
      }
    });
  }

  return (
    <div style={blogStyle}>
      {!visible && (
        <div>
          <span data-testid="blog-title">{blogObject.title}</span> 
          <span data-testid="blog-author">{blogObject.author}</span>
          <button onClick={toggleVisibility}>view</button>
        </div>
      )}
      {visible && (
        <div>
          <p data-testid="blog-title">{blogObject.title}</p>
          <p data-testid="blog-author">{blogObject.author}</p>
          <p data-testid="blog-url">{blogObject.url}</p>
          <p data-testid="blog-likes">likes {blogObject.likes}</p>
          <button onClick={addLike}>like</button>
          <button onClick={toggleVisibility}>hide</button>
          <button style={{ backgroundColor: 'red' }} onClick={deleteBlog}>delete</button>
        </div>
      )}
    </div>
  )
}

export default Blog