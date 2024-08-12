import  { useState, useEffect } from "react";
import { privateApi } from "@/axios/Axios";
import ClassroomDialog from "@/components/ClassroomDialog";
import { useAppSelector } from "@/store/hooks";
import { ClassroomData } from "@/types/type";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

type Teacher = {
  _id: string;
  name: string;
  email: string;
};

type Student = {
  _id: string;
  name: string;
  email: string;
};

interface Classroom {
  _id: string;
  name: string;
  teacher: Teacher;
  students: Student[];
  startTime: string;
  endTime: string;
  days: string[];
}

const Classroom = () => {
  const { role } = useAppSelector((state) => state.Auth);
  const [openDialog, setOpenDialog] = useState(false);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(
    null
  );
  const navigate = useNavigate();

  // Fetch teachers to populate the dropdown
  const { data: teachersData } = useQuery<Teacher[]>({
    queryKey: ["teachers"],
    queryFn: async () => {
      const response = await privateApi.get("/users/teachers");
      return response.data;
    },
    enabled: role === "Principal",
  });

  // Fetch classrooms
  const { data: classrooms, refetch: refetchClassrooms } = useQuery<
    Classroom[]
  >({
    queryKey: ["classrooms"],
    queryFn: async () => {
      const response = await privateApi.get("/classroom");
      return response.data;
    },
  });

  useEffect(() => {
    if (teachersData) {
      setTeachers(teachersData);
    }
  }, [teachersData]);

  // Handle form submission
  const { mutate } = useMutation({
    mutationFn: (classroomData: ClassroomData) =>
      privateApi.post("/classroom/create", classroomData),
    onSuccess: () => {
      setOpenDialog(false);
      refetchClassrooms(); // Refresh the list of classrooms
    },
  });

  const handleCreateClassroom = (classroomData: ClassroomData) => {
    mutate(classroomData);
  };

  const handleViewStudents = (classroom: Classroom) => {
    setSelectedClassroom(classroom);
  };

  const handleCloseDialog = () => {
    setSelectedClassroom(null);
  };

  return (
    <div className="px-4 py-4">
      {role === "Principal" && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenDialog(true)}
          style={{ marginBottom: "20px" }}
        >
          Create New Classroom
        </Button>
      )}

      <Typography variant="h5" gutterBottom>
        Classrooms
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Teacher</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Days</TableCell>
              <TableCell>Students</TableCell>
              {role !== "Student" && <TableCell>Action</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {classrooms?.map((classroom) => (
              <TableRow key={classroom._id}>
                <TableCell>{classroom.name}</TableCell>
                <TableCell>{classroom.teacher.name}</TableCell>
                <TableCell>{`${classroom.startTime} - ${classroom.endTime}`}</TableCell>
                <TableCell>{classroom.days.join(", ")}</TableCell>
                <TableCell>
                  {classroom.students.length} students
                  <Button
                    size="small"
                    onClick={() => handleViewStudents(classroom)}
                  >
                    View
                  </Button>
                </TableCell>
                {role !== "Student" && (
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => navigate(`${classroom._id}`)}
                    >
                      Manage
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={!!selectedClassroom} onClose={handleCloseDialog}>
        <DialogTitle>Students in {selectedClassroom?.name}</DialogTitle>
        <DialogContent>
          <List dense>
            {selectedClassroom?.students.map((student) => (
              <ListItem key={student._id}>
                <ListItemText
                  primary={student.name}
                  secondary={student.email}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>

      {role === "Principal" && (
        <ClassroomDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onSubmit={handleCreateClassroom}
          teachers={teachers}
          isEditMode={false}
        />
      )}
    </div>
  );
};

export default Classroom;
