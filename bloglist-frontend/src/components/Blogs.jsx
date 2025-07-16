import { useQueryClient } from "@tanstack/react-query";
import Blog from "./Blog";
import BlogForm from "./BlogForm";
import Togglable from "./Togglable";
import { useRef } from "react";
import blogService from "../services/blogs";
import { Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const Blogs = ({ blogs, user, notificationDispatch }) => {
  const queryClient = useQueryClient();
  const blogFormRef = useRef();
  const addBlog = async ({ title, author, url }) => {
    try {
      blogFormRef.current.toggleVisibility();
      const blogObject = {
        title,
        author,
        url,
        user: user.id,
      };

      const returnedBlog = await blogService.create(blogObject);
      notificationDispatch({
        type: "SET_NOTIFICATION",
        payload: {
          type: "success",
          content: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
        },
      });
      setTimeout(() => {
        notificationDispatch({ type: "REMOVE_NOTIFICATION" });
      }, 5000);
      const blogs = queryClient.getQueryData(["blogs"]);
      queryClient.setQueryData(["blogs"], blogs.concat(returnedBlog));
    } catch (exception) {
      notificationDispatch({
        type: "SET_NOTIFICATION",
        payload: {
          type: "error",
          content: "unknown error when creating blog",
        },
      });
      setTimeout(() => {
        notificationDispatch({ type: "REMOVE_NOTIFICATION" });
      }, 5000);
    }
  };

  return (
    <div>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
      <ul>
        {blogs?.map((blog) => (
          <li key={blog.id}>
            <Link component={RouterLink} to={`/blogs/${blog.id}`}>
              {blog.title} {blog.author}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Blogs;
