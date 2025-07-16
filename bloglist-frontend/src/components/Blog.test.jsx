import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";
import { BrowserRouter } from "react-router-dom";

test("renders content", () => {
  const blog = {
    title: "new blog",
    author: "bob",
    url: "https://blog.com",
    likes: 0,
    user: {
      username: "joe",
    },
  };
  const mockHandleLike = vi.fn();

  render(
    <BrowserRouter>
      <Blog blogs={[blog]} handleLike={mockHandleLike} user={blog.user} />
    </BrowserRouter>,
  );

  const title = screen.getByText("new blog", { exact: false });
  const author = screen.getByText("bob", { exact: false });
  const url = screen.getByText("https://blog.com");
  const likes = screen.getByText("likes 0");
  expect(title).toBeDefined();
  expect(author).toBeDefined();
  expect(url).toBeDefined();
  expect(likes).toBeDefined();
});

test("correctly calls the function to like blog", async () => {
  const blog = {
    title: "new blog",
    author: "bob",
    url: "https://blog.com",
    likes: 0,
    user: {
      username: "joe",
    },
  };
  const mockHandleLike = vi.fn();

  render(
    <BrowserRouter>
      <Blog blogs={[blog]} handleLike={mockHandleLike} user={blog.user} />
    </BrowserRouter>,
  );

  const user = userEvent.setup();
  const likeButton = screen.getByText("like");
  await user.click(likeButton);
  await user.click(likeButton);

  expect(mockHandleLike).toHaveBeenCalledTimes(2);
  expect(mockHandleLike).toHaveBeenCalledWith(blog);
  expect(mockHandleLike).toHaveBeenCalledWith(blog);
});
