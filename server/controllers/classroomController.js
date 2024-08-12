const Classroom = require("../models/Classroom");
const User = require("../models/User");

exports.createClassroom = async (req, res) => {
  try {
    const { name, startTime, endTime, days, teacherId } = req.body;

    if (!name || !startTime || !endTime || !days || !teacherId) {
      return res.status(400).json({
        message:
          "All fields are required",
      });
    }

    // Check if the teacher exists and is not already assigned to a classroom
    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== "Teacher") {
      return res.status(400).json({ message: "Invalid teacher" });
    }
    if (teacher.classroom.length !== 0) {
      return res
        .status(400)
        .json({ message: "Teacher is already assigned to a classroom" });
    }

    // Create new classroom
    const newClassroom = new Classroom({
      name,
      startTime,
      endTime,
      days,
      teacher: teacherId,
    });
    await newClassroom.save();

    // Assign classroom to teacher
    teacher.classroom = newClassroom._id;
    await teacher.save();

    res.status(201).json({
      message: "Classroom created and teacher assigned successfully",
      classroom: newClassroom,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating classroom", error: error.message });
  }
};

exports.getClassrooms = async (req, res) => {
  try {
    let classrooms;

    switch (req.user.role) {
      case "Principal":
        // Principal can see all classrooms with teacher and students populated
        classrooms = await Classroom.find()
          .populate("teacher", "email name")
          .populate("students", "email name");
        break;

      case "Teacher":
        // Teacher can see their assigned classroom with students populated
        classrooms = await Classroom.find({ teacher: req.user.id })
          .populate("teacher", "email name")
          .populate("students", "email name");
        break;

      case "Student":
        // Student can see all classrooms they are enrolled in, with classmates populated
       classrooms = await Classroom.find({ students: { $in: [req.user.id] } })
         .populate("teacher", "email name")
         .populate("students", "email name");
        break;
        // classrooms = student.classroom ? student.classroom : [];
        // break;

      default:
        return res.status(403).json({ message: "Unauthorized" });
    }

    res.json(classrooms);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching classrooms", error: error.message });
  }
};



exports.assignStudentToClassroom = async (req, res) => {
  try {
    const { studentId, classroomId } = req.body;

    // Check if the student exists and is not already assigned to a classroom
    const student = await User.findById(studentId);
    if (!student || student.role !== "Student") {
      return res.status(400).json({ message: "Invalid student" });
    }
    if (student.classroom.length !== 0) {
      return res
        .status(400)
        .json({ message: "Student is already assigned to a classroom" });
    }

    // Check if the classroom exists
    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      return res.status(400).json({ message: "Classroom not found" });
    }

    // If the user is a teacher, ensure they are assigning to their own classroom
    if (
      req.user.role === "Teacher" &&
      classroom.teacher.toString() !== req.user.id
    ) {
      return res
        .status(403)
        .json({
          message: "Teachers can only assign students to their own classroom",
        });
    }

    // Assign student to classroom
    student.classroom = classroomId;
    await student.save();

    // Add student to classroom's students array (if you're maintaining this)
    classroom.students.push(studentId);
    await classroom.save();

    res.status(200).json({
      message: "Student assigned to classroom successfully",
      student: student,
      classroom: classroom,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error assigning student to classroom",
        error: error.message,
      });
  }
};



// Remove a student from a classroom
exports.removeStudentFromClassroom = async (req, res) => {
  try {
    const { studentId, classroomId } = req.body;

    // Check if the classroom exists
    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    // Check if the user has permission to remove students
    if (req.user.role === "Teacher" && classroom.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: "Teachers can only remove students from their own classroom" });
    }

    // Check if the student exists and is in the classroom
    const student = await User.findById(studentId);
    if (!student || student.role !== "Student") {
      return res.status(404).json({ message: "Student not found" });
    }
    if (!student.classroom.includes(classroomId)) {
      return res.status(400).json({ message: "Student is not in this classroom" });
    }

    // Remove student from classroom
    classroom.students = classroom.students.filter(id => id.toString() !== studentId);
    await classroom.save();

    // Remove classroom from student
    student.classroom = student.classroom.filter(id => id.toString() !== classroomId);
    await student.save();

    res.status(200).json({
      message: "Student removed from classroom successfully",
      student: student,
      classroom: classroom,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error removing student from classroom",
      error: error.message,
    });
  }
};

// Delete a classroom
exports.deleteClassroom = async (req, res) => {
  try {
    const { classroomId } = req.params;

    // Check if the classroom exists
    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    // Remove classroom from assigned teacher
    if (classroom.teacher) {
      await User.findByIdAndUpdate(classroom.teacher, {
        $pull: { classroom: classroomId }
      });
    }

    // Remove classroom from all students
    await User.updateMany(
      { _id: { $in: classroom.students } },
      { $pull: { classroom: classroomId } }
    );

    // Delete the classroom
    await Classroom.findByIdAndDelete(classroomId);

    res.status(200).json({
      message: "Classroom deleted successfully and removed from all associated users",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting classroom",
      error: error.message,
    });
  }
};


exports.getAvailableStudents = async (req, res) => {
  try {
    const { classroomId } = req.params;

    // Get the classroom
    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    // Get all students not in this classroom
    const availableStudents = await User.find({
      role: "Student",
      _id: { $nin: classroom.students },
    }).select("_id name email");

    res.json(availableStudents);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching available students",
      error: error.message,
    });
  }
};


exports.getClassroomById = async (req, res) => {
  try {
    const { classroomId } = req.params;

    const classroom = await Classroom.findById(classroomId)
      .populate("teacher", "name email")
      .populate("students", "name email");

    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    res.json(classroom);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching classroom details",
      error: error.message,
    });
  }
};