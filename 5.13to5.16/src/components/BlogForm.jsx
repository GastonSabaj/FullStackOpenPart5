import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
    //const [newBlog, setNewBlog] = useState('')

    const addBlog = (event) => {
        event.preventDefault()
        // Crear un objeto FormData desde el evento
        const formData = new FormData(event.target)
        // Convertir FormData en un objeto simple
        const blogObject = Object.fromEntries(formData)

        createBlog(blogObject)
    }
    
    return (
        <div>
        <h2>create new</h2>
        <form onSubmit={addBlog}>
          <div>
            title
            <input
              data-testid='title'
              type="text"
              name="title"
              required
            />
          </div>
          <div>
            author
            <input
              data-testid='author'
              type="text"
              name="author"
              required
            />
          </div>
          <div>
            url
            <input
              data-testid='url'
              type="text"
              name="url"
              required
            />
          </div>
          <button type="submit">create</button>
        </form>
      </div>
    )
    
}

export default BlogForm