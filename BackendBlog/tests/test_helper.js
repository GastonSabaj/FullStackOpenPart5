const Blog = require('../models/Blog')

/* Blog structure:
    title: String,
    author: String,
    url: String,
    likes: Number
*/

const initialBlogs = [
  {
    title: 'A blog title',
    author: 'A blog author',
    url: 'https://example.com',
    likes: 11
  },
  {
    title: 'Another blog title',
    author: 'Another blog author',
    url: 'https://example.com',
    likes: 22
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
    initialBlogs, nonExistingId, blogsInDb
}