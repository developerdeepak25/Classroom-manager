import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { privateApi } from "@/axios/Axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
} from "@mui/material";
import { Student } from "@/types/type";

// interface Student {
//   _id: string;
//   name: string;
//   email: string;
// }

const ClassroomManager: React.FC = () => {
  const { classroomId } = useParams<{ classroomId: string }>();

  // Fetch classroom details
  const { data: classroom, refetch: refetchClassroom } = useQuery({
    queryKey: ["classroom", classroomId],
    queryFn: async () => {
      const response = await privateApi.get(`/classroom/${classroomId}`);
      console.log('response.data of get classroom',response.data);
      
      return response.data;
    },
  });

  // Fetch students not in this class
  const { data: availableStudents, refetch: refetchAvailableStudents } =
    useQuery({
      queryKey: ["availableStudents", classroomId],
      queryFn: async () => {
        const response = await privateApi.get(
          `/classroom/${classroomId}/available-students`
        );
        return response.data;
      },
    });

  // Remove student mutation
  const removeStudentMutation = useMutation({
    mutationFn: (studentId: string) =>
      privateApi.post("/classroom/remove-student", {
        studentId,
        classroomId: classroomId,
      }),
    onSuccess: () => {
      refetchClassroom();
      refetchAvailableStudents();
    },
  });

  // Add student mutation
  const addStudentMutation = useMutation({
    mutationFn: (studentId: string) =>
      privateApi.post("/classroom/assign-student", {
        studentId,
        classroomId: classroomId,
      }),
    onSuccess: () => {
      refetchClassroom();
      refetchAvailableStudents();
    },
  });

  return (
    <div className="px-4 py-4">
      <Typography variant="h4" gutterBottom>
        Manage Classroom: {classroom?.name}
      </Typography>

      <Typography variant="h5" gutterBottom>
        Students in Class
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {classroom?.students?.map((student: Student) => (
              <TableRow key={student._id}>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => removeStudentMutation.mutate(student._id)}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h5" gutterBottom style={{ marginTop: "2rem" }}>
        Available Students
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {availableStudents?.map((student: Student) => (
              <TableRow key={student._id}>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => addStudentMutation.mutate(student._id)}
                  >
                    Add
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ClassroomManager;
