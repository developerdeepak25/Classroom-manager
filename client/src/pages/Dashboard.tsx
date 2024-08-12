import { privateApi } from "@/axios/Axios";
import ClassroomList from "@/components/ClassroomList";
import UserDialog from "@/components/userDialog";
import { useAppSelector } from "@/store/hooks";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

// interface User {
//   _id: string;
//   name: string;
//   email: string;
//   role: "Teacher" | "Student";
// }

interface UserData {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role?: "Teacher" | "Student";
}

// interface Classroom {
//   _id: string;
//   name: string;
//   teacher?: string;
// }

const Dashboard = () => {
  const { role } = useAppSelector((state) => {
    return state.Auth;
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  //   const [newUserData, setNewUserData] = useState({
  //   name: "",
  //   email: "",
  //   password: "",
  //   role: "Teacher",
  // });

  const createUserMutation = useMutation({
    mutationFn: (userData: UserData) =>
      privateApi.post("/users/create", userData),
    onSuccess: () => {
      setDialogOpen(false);
      // setNewUserData({ name: "", email: "", password: "", role: "Teacher" });
      refetch();
    },
  });
  const editUserMutation = useMutation({
    mutationFn: (userData: UserData) =>
      privateApi.put(`/users/edit/${userData._id}`, userData),
    onSuccess: () => {
      setDialogOpen(false);
      // setNewUserData({ name: "", email: "", password: "", role: "Teacher" });
      refetch();
    },
  });

  const {
    data: users,
    isLoading: isLoadingUsers,
    refetch,
  } = useQuery<UserData[]>({
    queryKey: ["users"],
    queryFn: () => privateApi.get("/users/all").then((res) => res.data),
    enabled: role === "Principal",
  });

  const handleDelete = (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      privateApi
        .delete(`/users/delete/${userId}`)
        .then(() => {
          refetch();
          // Refetch users after successful deletion
          // QueryClient.invalidateQueries(["users"]);
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
        });
    }
  };
  const handleEditUser = (user: UserData) => {
    setIsEditMode(true);
    setSelectedUser(user);
    setDialogOpen(true);
  };
  const handleCreateUser = () => {
    setIsEditMode(false);
    setSelectedUser(null);
    setDialogOpen(true);
  };
  const handleSubmitUser = (userData: UserData) => {
    console.log("form handle submit", userData);

    if (isEditMode) {
      // Call your edit user mutation
      editUserMutation.mutate(userData);
    } else {
      // Call your create user mutation
      createUserMutation.mutate(userData);
    }
  };

  useEffect(() => {
    console.log(users);
  }, [users]);

  return (
    <>
      <div className=" px-4 py-4">
        {role === "Principal" && (
          <>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleCreateUser()}
            >
              Create New User
            </Button>
          </>
        )}
        {role === "Principal" && (
          <>
            {isLoadingUsers && <p>Loading users...</p>}

            {users?.length !== 0 ? (
              <>
                <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                  All Users
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Delete</TableCell>
                        <TableCell>Edit</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users?.map((user) => (
                        <TableRow key={user._id}>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.role}</TableCell>
                          <TableCell>
                            <Button
                              variant="outlined"
                              color="error"
                              onClick={() => handleDelete(user._id!)}
                            >
                              Delete
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outlined"
                              color="primary"
                              onClick={() => handleEditUser(user)}
                            >
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            ) : (
              <p>No users yet</p>
            )}
          </>
        )}

        {/* dailog for creating user */}
        {/* <CreateUserDialog
          mutate={mutate}
          newUserData={newUserData}
          setNewUserData={setNewUserData}
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
        /> */}

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Classrooms{" "}
        </Typography>

        <ClassroomList />

        <UserDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSubmit={handleSubmitUser}
          user={selectedUser}
          isEditMode={isEditMode}
        />
      </div>
    </>
  );
};

export default Dashboard;
