import { Button, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

const Blog = ({ blogs, handleLike, user, handleDelete }) => {
  const blogStyle = {
    paddingTop: 10,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
    paddingRight: 10,
    paddingLeft: 10,
  };
  const { blogId } = useParams();
  const blog = blogs?.find((b) => b.id === blogId);
  const navigate = useNavigate();

  if (!blog) {
    return null;
  }
  return (
    <div style={blogStyle}>
      <span style={{ fontWeight: 600 }}>Title: </span> {blog.title}{" "}
      <span style={{ fontWeight: 600 }}>Author: </span>
      {blog.author}
      <div>
        <div>
          <span style={{ fontWeight: 600 }}>Url: </span>
          {blog.url}
        </div>
        <div style={{ fontSize: 18 }}>
          likes {blog.likes}{" "}
          <Button onClick={() => handleLike(blog)} variant="outlined">
            like
          </Button>
        </div>
        <div style={{ marginTop: 6 }}>
          <span style={{ fontWeight: 600 }}>User: </span>
          {blog.user.name}
        </div>
        {blog.user.username === user.username && (
          <Button
            variant="outlined"
            onClick={async () => {
              await handleDelete(blog);
              navigate("/");
            }}
          >
            remove
          </Button>
        )}
        <Typography level="h3" style={{ marginBottom: 0 }}>
          comments
        </Typography>
        <ul>
          {blog.comments?.length > 0 ? (
            blog.comments.map((comment, index) => {
              return <li key={index}>{comment}</li>;
            })
          ) : (
            <div>no comments</div>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Blog;
