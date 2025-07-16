import { AppBar, Button, IconButton, Toolbar } from "@mui/material";
import { Link } from "react-router-dom";

const Navigate = ({ user, handleLogout }) => {
  const navigationStyle = {
    backgroundColor: "grey",
    margin: 2,
    padding: 4,
    display: "flex",
  };
  const marginStyle = {
    marginRight: 4,
  };

  return (
    <AppBar style={navigationStyle} position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu"></IconButton>
        <Button color="inherit" component={Link} style={marginStyle} to="/">
          blogs
        </Button>
        <Button
          color="inherit"
          component={Link}
          style={marginStyle}
          to="/users"
        >
          users
        </Button>
        <div style={{ ...marginStyle, fontWeight: 800 }}>
          {user.name} logged in
        </div>
        <Button color="inherit" onClick={handleLogout}>
          log out
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navigate;
