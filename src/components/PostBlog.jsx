import React, { useState } from "react";

const PostBlog = ({ handleBlogPost }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const handlePost = async (event) => {
    event.preventDefault();
    handleBlogPost({ title, author, url });
    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <>
      <h3>New Blog Entry</h3>
      <form onSubmit={handlePost}>
        <div>
          title
          <input
            type="text"
            value={title}
            name="Title"
            placeholder="title"
            data-testid="title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            type="text"
            value={author}
            name="Author"
            placeholder="author"
            data-testid="author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url
          <input
            type="text"
            value={url}
            name="Url"
            placeholder="url"
            data-testid="url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">Create</button>
      </form>
    </>
  );
};

export default PostBlog;
