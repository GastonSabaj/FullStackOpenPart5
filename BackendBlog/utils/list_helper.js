const dummy = (blogs) => {
    return 1
  }
  
const totalLikes = (blogs) => {
  
  if(blogs.length === 0) {
    return 0
  }

  return blogs.reduce((acum, blog) => { return acum + blog.likes }, 0)
}

const favoriteBlog = (blogs) => {
  if(blogs.length === 0)
    return null

  return blogs.reduce((acum, blog) => { return (blog.likes > acum.likes) ? blog : acum }, blogs[0])
}


var _ = require('lodash');

const mostBlogs = (blogs) => {
  if(blogs.length === 0)
    return null

  /* 
    Por ejemplo, si blogs es:
      [
        { author: 'Alice' },
        { author: 'Bob' },
        { author: 'Alice' }
      ]
    Entonces, authorCount será:
      {
        'Alice': 2,
        'Bob': 1
      }
    Donde 'Alice' aparece 2 veces y 'Bob' aparece 1 vez en la lista de blogs.
  */
  const authorCount = _.countBy(blogs, 'author');

  //Devuelve el autor con mas blogs
  const maxAuthor = _.maxBy(Object.keys(authorCount), (author) => authorCount[author]);

  return { author: maxAuthor, blogs: authorCount[maxAuthor] };
}

const mostLikes = (blogs) => {
  if (blogs.length === 0)
    return null;

  //Se genera un array por nombre del autor
  const likesByAuthor = _.groupBy(blogs, 'author');
  let maxLikes = 0;
  let authorWithMostLikes = '';

  //Recorro cada array por autor y calculo el total de likes
  _.forEach(likesByAuthor, (blogs, author) => {
    const totalLikes = _.sumBy(blogs, 'likes');
    if (totalLikes > maxLikes) {
      maxLikes = totalLikes;
      authorWithMostLikes = author;
    }
  });

  return { author: authorWithMostLikes, likes: maxLikes };
};

  module.exports = {
    dummy, 
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }