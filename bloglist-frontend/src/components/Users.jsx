import { Table, TableBody, TableCell, TableRow } from "@mui/material";
import { Link } from "react-router-dom";

const Users = ({ users }) => {
  return (
    <div>
      <h2 style={{ marginBottom: 0 }}>Users</h2>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>&nbsp;</TableCell>
            <TableCell style={{ fontWeight: 600 }}>blogs created</TableCell>
          </TableRow>
          {users?.map((user) => {
            return (
              <TableRow key={user.id}>
                <TableCell>
                  <Link to={`/users/${user.id}`}>{user.name}</Link>
                </TableCell>
                <TableCell>{user.blogs.length}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default Users;
