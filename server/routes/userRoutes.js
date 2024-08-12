const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");

// Route for principal to create a new user (teacher or student)
router.post(
  "/create",
  auth,
  roleCheck("Principal", "Teacher"),
  userController.createUser
);

router.post("/login", userController.login);

router.get("/all", auth, userController.getAllUsers);

// Get all teachers (accessible by Principal only)
router.get(
  '/teachers',
  auth,
  roleCheck('Principal'),
  userController.getAllTeachers
);

// Get all students (accessible by Principal and Teachers)
router.get(
  '/students',
  auth,
  roleCheck('Principal', 'Teacher'),
  userController.getAllStudents
);

router.put(
  "/edit/:userId",
  auth,
  roleCheck("Principal", "Teacher"),
  userController.editUser
);

router.delete(
  "/delete/:userId",
  auth,
  roleCheck("Principal", "Teacher"),
  userController.deleteUser
);

module.exports = router;
