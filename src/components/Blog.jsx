import { useState } from "react";

const Blog = ({ blog, handleLike, handleDelete }) => {
  const [isVisible, setVisible] = useState(false);

  if (!isVisible) {
    return (
      <div className="blogListItem">
        <button id="view" onClick={() => setVisible(true)}>
          View
        </button>
        &quot;{blog.title}&quot; by {blog.author}
      </div>
    );
  }
  return (
    <div
      className="blogInfoItem"
      style={{
        borderColor: "#f9f",
        borderWidth: 2,
        borderStyle: "solid",
        padding: 4,
        marginBottom: 4,
      }}
    >
      <div>
        <button onClick={() => setVisible(false)}>hide</button>
        <h3>
          &quot;{blog.title}&quot; by {blog.author}
        </h3>
      </div>
      <a href={blog.url} target="_blank" rel="noopener noreferrer">
        {blog.url}
      </a>
      <div>
        likes {blog.likes}{" "}
        <button id="like" onClick={handleLike}>
          like
        </button>
      </div>
      <div>{blog.user.name}</div>
      {handleDelete && (
        <button id="delete" onClick={handleDelete}>
          delete
        </button>
      )}
    </div>
  );
};

export default Blog;
