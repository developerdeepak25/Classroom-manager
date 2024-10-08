// components/ClassroomList.tsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { privateApi } from "@/axios/Axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import { Classroom } from "@/types/type";
import { useAppSelector } from "@/store/hooks";

// interface Classroom {
//   _id: string;
//   name: string;
//   teacher: string;
//   students: string[];
// }

const ClassroomList: React.FC = () => {
  const {
    data: classrooms,
    isLoading,
    error,
  } = useQuery<Classroom[]>({
    queryKey: ["classrooms"],
    queryFn: () => privateApi.get("/classroom").then((res) => res.data),
  });

  const { role } = useAppSelector((state) => {
    return state.Auth;
  });

  if (isLoading) return <div>Loading classrooms...</div>;
  if (error) return <div>Error loading classrooms</div>;
  if (classrooms?.length === 0 || !classrooms)
    return (
      <>
        {role === "Principal" ? (
          <div>no classrooms Created </div>
        ) : (
          <div>not in a classroom</div>
        )}{" "}
      </>
    );
  return (
    <>
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Classrooms{" "}
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Teacher</TableCell>
              <TableCell>Number of Students</TableCell>
              {/* {role === "Principal" && <TableCell>Actions</TableCell>} */}
            </TableRow>
          </TableHead>
          <TableBody>
            {classrooms?.map((classroom) => (
              <TableRow key={classroom._id}>
                <TableCell>{classroom.name}</TableCell>
                <TableCell>{classroom.teacher.name}</TableCell>
                <TableCell>{classroom.students.length}</TableCell>
                {/* {role === "Principal" && (
                <TableCell>
                  <Button variant="outlined" color="primary">
                    Edit
                  </Button>
                  <Button variant="outlined" color="error">
                    Delete
                  </Button>
                </TableCell>
              )} */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ClassroomList;
