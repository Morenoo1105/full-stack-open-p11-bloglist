const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  return blogs.reduce((max, blog) => (max.likes > blog.likes ? max : blog), {});
};

const mostBlogs = (blogs) => {
  const authors = blogs.reduce((authors, blog) => {
    authors[blog.author] = authors[blog.author] ? authors[blog.author] + 1 : 1;
    return authors;
  }, {});

  const authorWithMostBlogs = Object.keys(authors).reduce(
    (max, author) => (authors[max] > authors[author] ? max : author),
    {}
  );

  return {
    author: authorWithMostBlogs,
    blogs: authors[authorWithMostBlogs],
  };
};

const mostLikes = (blogs) => {
  const authors = blogs.reduce((authors, blog) => {
    authors[blog.author] = authors[blog.author]
      ? authors[blog.author] + blog.likes
      : blog.likes;
    return authors;
  }, {});

  const authorWithMostLikes = Object.keys(authors).reduce(
    (max, author) => (authors[max] > authors[author] ? max : author),
    {}
  );

  return {
    author: authorWithMostLikes,
    likes: authors[authorWithMostLikes],
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
