const express = require("express");
const router = express.Router();
const classroomController = require("../controllers/classroomController");
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");

// Create a classroom and assign teacher (Principal only)
router.post(
  "/create",
  auth,
  roleCheck("Principal"),
  classroomController.createClassroom
);

// Get classrooms (different views for different roles)
router.get("/", auth, classroomController.getClassrooms);

router.get("/:classroomId", auth, classroomController.getClassroomById);

router.post(
  "/assign-student",
  auth,
  roleCheck("Principal", "Teacher"),
  classroomController.assignStudentToClassroom
);


// Remove a student from a classroom (Principal and Teacher)
router.post(
  "/remove-student",
  auth,
  roleCheck("Principal", "Teacher"),
  classroomController.removeStudentFromClassroom
);

// Delete a classroom (Principal only)
router.delete(
  "/delete/:classroomId",
  auth,
  roleCheck("Principal"),
  classroomController.deleteClassroom
);


router.get(
  "/:classroomId/available-students",
  auth,
  roleCheck("Principal", "Teacher"),
  classroomController.getAvailableStudents
);
module.exports = router;
