const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const Classroom = require("../models/Classroom");

exports.createUser = async (req, res) => {
  try {
    const { email, password, role, name } = req.body;

    // Validate input
    if (!email || !password || !role || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (role === req.user.role) {
      return res.status(403).json({
        message: "You are not authorized to create a user with this role",
      });
    }

    // Check if the role is valid (teacher or student)
    if (role !== "Teacher" && role !== "Student") {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      email,
      password: hashedPassword,
      role,
      name,
    });

    await newUser.save();

    res
      .status(201)
      .json({ message: "User created successfully", userId: newUser._id });
  } catch (error) {
    console.error("Error in createUser:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// exports.register = async (req, res) => {
//   try {
//     const { email, password, name, role } = req.body;

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Create new user
//     const newUser = new User({
//       email,
//       password: hashedPassword,
//       name,
//       role,
//     });

//     await newUser.save();

//     res.status(201).json({ message: "User registered successfully" });
//   } catch (error) {
//     console.error("Error in register:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log(user.id, user.role);

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create and send token
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user._id,
            name: user.name,
            role: user.role,
            email: user.email,
          },
        });
      }
    );
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "Principal") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Exclude users with the role of "Principal"
    const users = await User.find({ role: { $ne: "Principal" } }).select(
      "-password"
    );

    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

// Get all teachers
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: 'Teacher' })
      .select('_id name email')
      .sort({ name: 1 }); // Sort by name in ascending order

    res.json(teachers);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({ message: 'Error fetching teachers', error: error.message });
  }
};

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'Student' })
      .select('_id name email')
      .sort({ name: 1 }); // Sort by name in ascending order

    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
};


exports.editUser = async (req, res) => {
  console.log('edit user called');
  
  try {
    const { userId } = req.params;
    console.log('users to edit:', userId);
    
    const { name, email,role } = req.body;
        console.log("New details:", { name, email });


    const userToEdit = await User.findById(userId);
        console.log("User found:", userToEdit);


    if (!userToEdit) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check permissions
    if (req.user.role === "Teacher" && userToEdit.role !== "Student") {
      return res
        .status(403)
        .json({ message: "Teachers can only edit student details" });
    }

    // Update user details
    userToEdit.name = name || userToEdit.name;
    userToEdit.email = email || userToEdit.email;
    userToEdit.role = role || userToEdit.role;

    await userToEdit.save();

    res.json({
      message: "User details updated successfully",
      user: userToEdit,
    });
  } catch (error) {
    console.log(error);
    
    res
      .status(500)
      .json({ message: "Error updating user details", error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const userToDelete = await User.findById(userId);

    if (!userToDelete) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check permissions
    if (req.user.role === "Teacher" && userToDelete.role !== "Student") {
      return res
        .status(403)
        .json({ message: "Teachers can only delete students" });
    }

    // If the user is a student, remove them from their classroom
    if (userToDelete.role === "Student" && userToDelete.classroom) {
      await Classroom.findByIdAndUpdate(userToDelete.classroom, {
        $pull: { students: userId },
      });
    }

    // If the user is a teacher, remove them from their assigned classroom
    if (userToDelete.role === "Teacher") {
      await Classroom.findOneAndUpdate(
        { teacher: userId },
        { $unset: { teacher: 1 } }
      );
    }

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.json({
      message:
        "User deleted successfully and removed from associated classroom",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
};
