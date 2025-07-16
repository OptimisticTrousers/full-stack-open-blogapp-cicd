const dummy = () => {

  return 1;
};

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes;
  };

  return blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  let favorite = blogs[0];
  for (let i = 1; i < blogs.length; i++) {
    const blog = blogs[i];
    if (favorite.likes < blog.likes) {
      favorite = blog;
    }
  }

  return favorite;
};

const mostBlogs = (blogs) => {
  const counter = {};
  let maximum = -Infinity;
  let most = null;
  for (let i = 0; i < blogs.length; i++) {
    const blog = blogs[i];
    counter[blog.author] = 1 + (counter[blog.author] || 0);
    if (maximum < counter[blog.author]) {
      most = { author: blog.author, blogs: counter[blog.author] };
      maximum = counter[blog.author];
    }
  }

  return most;
};

const mostLikes = (blogs) => {
  const counter = {};
  let maximum = -Infinity;
  let most = null;
  for(let i = 0; i < blogs.length; i++) {
    const blog = blogs[i];
    counter[blog.author] = blog.likes + (counter[blog.author] || 0);
    if (maximum < counter[blog.author]) {
      most = { author: blog.author, likes: counter[blog.author] };
      maximum = counter[blog.author];
    }
  }

  return most;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
};
