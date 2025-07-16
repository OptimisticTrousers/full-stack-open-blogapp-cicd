import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";

test("<BlogForm /> updates parent state and calls onSubmit", async () => {
  const user = userEvent.setup();
  const createBlog = vi.fn();

  render(<BlogForm createBlog={createBlog} />);

  const blogTitle = screen.getByPlaceholderText("write blog title here");
  const blogAuthor = screen.getByPlaceholderText("write blog author here");
  const blogUrl = screen.getByPlaceholderText("write blog url here");
  const sendButton = screen.getByText("save");

  await user.type(blogTitle, "testing title...");
  await user.type(blogAuthor, "testing author...");
  await user.type(blogUrl, "testing url...");
  await user.click(sendButton);

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0].title).toBe("testing title...");
  expect(createBlog.mock.calls[0][0].author).toBe("testing author...");
  expect(createBlog.mock.calls[0][0].url).toBe("testing url...");
});
