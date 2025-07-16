import { useState, useEffect, useRef, useReducer } from "react";
import blogService from "./services/blogs";
import userService from "./services/users";
import loginService from "./services/login";
import Notification from "./components/Notification";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";
import Blogs from "./components/Blogs";
import Users from "./components/Users";
import User from "./components/User";
import Blog from "./components/Blog";
import Navigate from "./components/Navigate";
import { Button, Container, TextField, Typography } from "@mui/material";

function notificationReducer(state, action) {
  switch (action.type) {
    case "SET_NOTIFICATION":
      return action.payload;
    case "REMOVE_NOTIFICATION":
      return null;
  }
}

function userReducer(state, action) {
  switch (action.type) {
    case "SET_USER":
      return action.payload;
    case "REMOVE_USER":
      return null;
  }
}

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, userDispatch] = useReducer(userReducer, null);
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    null,
  );
  const blogResult = useQuery({
    queryKey: ["blogs"],
    queryFn: blogService.getAll,
  });
  const userResult = useQuery({
    queryKey: ["users"],
    queryFn: userService.getAll,
  });
  const blogs = blogResult.data?.sort((blogA, blogB) => {
    return blogB.likes - blogA.likes;
  });
  const queryClient = useQueryClient();

  async function handleLike(blog) {
    const id = blog.id;
    const returnedBlog = await blogService.update(id, {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    });
    const blogs = queryClient.getQueryData(["blogs"]);
    queryClient.setQueryData(
      ["blogs"],
      blogs.map((blog) => {
        if (id === blog.id) {
          return { ...returnedBlog, user: blog.user };
        }
        return blog;
      }),
    );
  }

  async function handleDelete(blog) {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      const id = blog.id;
      await blogService.remove(id);
      const blogs = queryClient.getQueryData(["blogs"]);
      queryClient.setQueryData(
        ["blogs"],
        blogs.filter((blog) => {
          return blog.id !== id;
        }),
      );
    }
  }

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedNoteappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      userDispatch({ type: "SET_USER", payload: user });
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogout = async () => {
    window.localStorage.removeItem("loggedNoteappUser");
    userDispatch({ type: "REMOVE_USER" });
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedNoteappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      userDispatch({ type: "SET_USER", payload: user });
      setUsername("");
      setPassword("");
    } catch (exception) {
      notificationDispatch({
        type: "SET_NOTIFICATION",
        payload: { type: "error", content: "wrong username or password" },
      });
      setTimeout(() => {
        notificationDispatch({ type: "REMOVE_NOTIFICATION" });
      }, 5000);
    }
  };

  if (user === null) {
    return (
      <div>
        <Notification notification={notification} />
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            <TextField
              label="username"
              type="text"
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
              style={{ marginBottom: 4 }}
              required
            />
          </div>
          <div>
            <TextField
              type="password"
              value={password}
              label="password"
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
              style={{ marginBottom: 4 }}
              required
            />
          </div>
          <Button variant="contained" color="primary" type="submit">
            login
          </Button>
        </form>
      </div>
    );
  }

  return (
    <Container>
      <Router>
        <Navigate user={user} handleLogout={handleLogout} />
        <h2>blogs</h2>
        <Notification notification={notification} />
        <Routes>
          <Route
            path="/"
            element={
              <Blogs
                blogs={blogs}
                user={user}
                notificationDispatch={notificationDispatch}
                handleLike={handleLike}
                handleDelete={handleDelete}
              />
            }
          />
          <Route path="/users" element={<Users users={userResult.data} />} />
          <Route
            path="/users/:userId"
            element={<User users={userResult.data} />}
          />
          <Route
            path="/blogs/:blogId"
            element={
              <Blog
                user={user}
                handleLike={handleLike}
                handleDelete={handleDelete}
                blogs={blogs}
              />
            }
          />
        </Routes>
      </Router>
    </Container>
  );
};

export default App;
