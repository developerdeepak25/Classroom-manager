// import {
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   MenuItem,
//   TextField,
// } from "@mui/material";
// import { UseMutateFunction } from "@tanstack/react-query";

// type CreateUserDialogProps = {
//   mutate: UseMutateFunction<
//     any,
//     any,
//     {
//       name: string;
//       email: string;
//       password: string;
//       role: string;
//     },
//     unknown
//   >;
//   openDialog: boolean;
//   setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
//   newUserData: {
//     name: string;
//     email: string;
//     password: string;
//     role: string;
//   };
//   setNewUserData: React.Dispatch<
//     React.SetStateAction<{
//         name: string;
//       email: string;
//       password: string;
//       role: string;
//     }>
//   >;
// };

// const CreateUserDialog = ({
//   mutate,
//   openDialog,
//   setOpenDialog,
//   newUserData,
//   setNewUserData,
// }: CreateUserDialogProps) => {
//   const handleCreateUser = () => {
//     mutate(newUserData);
//   };
//   return (
//     <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
//       <DialogTitle>Create New User</DialogTitle>
//       <DialogContent>
//         <TextField
//           autoFocus
//           margin="dense"
//           label="Name"
//           type="text"
//           fullWidth
//           value={newUserData.name}
//           onChange={(e) =>
//             setNewUserData({ ...newUserData, name: e.target.value })
//           }
//         />
//         <TextField
//           margin="dense"
//           label="Email"
//           type="email"
//           fullWidth
//           value={newUserData.email}
//           onChange={(e) =>
//             setNewUserData({ ...newUserData, email: e.target.value })
//           }
//         />
//         <TextField
//           margin="dense"
//           label="Password"
//           type="password"
//           fullWidth
//           value={newUserData.password}
//           onChange={(e) =>
//             setNewUserData({ ...newUserData, password: e.target.value })
//           }
//         />
//         <TextField
//           select
//           margin="dense"
//           label="Role"
//           fullWidth
//           value={newUserData.role}
//           onChange={(e) =>
//             setNewUserData({
//               ...newUserData,
//               role: e.target.value,
//             })
//           }
//         >
//           <MenuItem key={"Teacher"} value="Teacher">
//             Teacher
//           </MenuItem>
//           <MenuItem key={"Student"} value="Student">
//             Student
//           </MenuItem>
//         </TextField>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
//         <Button onClick={handleCreateUser}>Create</Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default CreateUserDialog;


import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
// import { UseMutateFunction } from "@tanstack/react-query";
import { useState, useEffect } from "react";

type User = {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role?: "Teacher" | "Student";
};

type UserDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (userData: User) => void;
  user?: User | null;
  isEditMode: boolean;
};

const UserDialog = ({
  open,
  onClose,
  onSubmit,
  user,
  isEditMode,
}: UserDialogProps) => {
  const [userData, setUserData] = useState<User>({
    name: "",
    email: "",
    password: "",
    role: "Teacher",
  });

  useEffect(() => {
    if (user && isEditMode) {
      setUserData({
        ...user,
        password: "", // Clear password when editing
      });
    } else {
      setUserData({
        name: "",
        email: "",
        password: "",
        role: "Teacher",
      });
    }
  }, [user, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit(userData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{isEditMode ? "Edit User" : "Create New User"}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Name"
          type="text"
          fullWidth
          value={userData.name}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="email"
          label="Email"
          type="email"
          fullWidth
          value={userData.email}
          onChange={handleChange}
        />
        {!isEditMode && (
          <TextField
            margin="dense"
            name="password"
            label="Password"
            type="password"
            fullWidth
            value={userData.password}
            onChange={handleChange}
          />
        )}
        <TextField
          select
          margin="dense"
          name="role"
          label="Role"
          fullWidth
          value={userData.role}
          onChange={handleChange}
        >
          <MenuItem value="Teacher">Teacher</MenuItem>
          <MenuItem value="Student">Student</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>{isEditMode ? "Save" : "Create"}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserDialog;