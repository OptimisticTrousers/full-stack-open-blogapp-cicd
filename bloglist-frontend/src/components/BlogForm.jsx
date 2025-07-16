import { Button, TextField } from "@mui/material";
import { useState } from "react";

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const marginStyle = {
    marginBottom: 4,
  };

  async function handleSubmit(event) {
    event.preventDefault();
    await createBlog({ title, author, url });
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            label="title"
            type="text"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
            placeholder="write blog title here"
            style={marginStyle}
            required
          />
        </div>
        <div>
          <TextField
            label="author"
            type="text"
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
            placeholder="write blog author here"
            style={marginStyle}
            required
          />
        </div>
        <div>
          <TextField
            type="text"
            label="url"
            value={url}
            name="Url"
            onChange={({ target }) => setUrl(target.value)}
            placeholder="write blog url here"
            style={marginStyle}
            required
          />
        </div>
        <Button type="submit" variant="contained" style={{ marginTop: 6 }}>
          save
        </Button>
      </form>
    </div>
  );
};

export default BlogForm;
