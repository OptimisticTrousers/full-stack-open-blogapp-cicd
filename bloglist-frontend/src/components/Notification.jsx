import { Alert } from "@mui/material";

const Notification = ({ notification }) => {
  if (notification === null) {
    return null;
  }

  return (
    <Alert severity={notification.type === "success" ? "success" : "error"}>
      {notification.content}
    </Alert>
  );
};

export default Notification;
