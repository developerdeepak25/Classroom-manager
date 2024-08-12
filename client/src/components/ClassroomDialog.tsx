import { ClassroomData } from "@/types/type";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  TextField,
} from "@mui/material";
import { useState, useEffect } from "react";

type Teacher = {
  _id: string;
  name: string;
  email: string;
};

type ClassroomDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (classroomData: ClassroomData) => void;
  teachers: Teacher[]; 
  classroom?: ClassroomData | null;
  isEditMode: boolean;
};


const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const ClassroomDialog = ({
  open,
  onClose,
  onSubmit,
  teachers,
  classroom,
  isEditMode,
}: ClassroomDialogProps) => {
  const [classroomData, setClassroomData] = useState<ClassroomData>({
    name: "",
    teacherId: "",
    startTime: "",
    endTime: "",
    days: [],
  });

  useEffect(() => {
    if (classroom && isEditMode) {
      setClassroomData({
        ...classroom,
      });
    } else {
      setClassroomData({
        name: "",
        teacherId: "",
        startTime: "",
        endTime: "",
        days: [],
      });
    }
  }, [classroom, isEditMode]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setClassroomData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDaysChange = (day: string) => {
    setClassroomData((prev) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day],
    }));
  };

  const handleSubmit = () => {
    console.log('classroomData',classroomData);
    
    onSubmit(classroomData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {isEditMode ? "Edit Classroom" : "Create New Classroom"}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Classroom Name"
          type="text"
          fullWidth
          value={classroomData.name}
          onChange={handleChange}
        />
        <TextField
          select
          margin="dense"
          name="teacherId"
          label="Teacher"
          fullWidth
          value={classroomData.teacherId}
          onChange={handleChange}
        >
          {teachers.map((teacher) => (
            <MenuItem key={teacher._id} value={teacher._id}>
              {teacher.name} 
              {/* ({teacher.email}) */}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          margin="dense"
          name="startTime"
          label="Start Time"
          type="time"
          fullWidth
          value={classroomData.startTime}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            step: 300, // 5 min
          }}
        />
        <TextField
          margin="dense"
          name="endTime"
          label="End Time"
          type="time"
          fullWidth
          value={classroomData.endTime}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            step: 300, // 5 min
          }}
        />
        <div>
          {DAYS_OF_WEEK.map((day) => (
            <FormControlLabel
              key={day}
              control={
                <Checkbox
                  checked={classroomData.days.includes(day)}
                  onChange={() => handleDaysChange(day)}
                  name={day}
                />
              }
              label={day}
            />
          ))}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>{isEditMode ? "Save" : "Create"}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClassroomDialog;
