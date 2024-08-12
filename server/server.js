const express = require("express");
const cors = require("cors");
const connectDB = require("./config/dbConfig");
const User = require("./models/User");
require("dotenv").config();
const bcrypt = require('bcryptjs');

// Initialize Express app
const app = express();

// Connect to Database
connectDB();

var corsOptions = {
  origin: process.env.CLIENT_URL,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json()); // for parsing application/json

// Define Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/classroom", require("./routes/classroomRoute"));
// app.use("/api/principal", require("./routes/principal"));
// app.use("/api/teacher", require("./routes/teacher"));
// app.use("/api/student", require("./routes/student"));

// Root Route (Optional)
app.get("/", (req, res) => {
  res.send("Welcome to the Classroom App API");
});

const createPrincipalAccount = async () => {
  try {
    const principal = await User.findOne({ role: "Principal" });

    if (!principal) {
      const hashedPassword = await bcrypt.hash(
        process.env.PRINCIPAL_PASSWORD,
        10
      );

      const newPrincipal = new User({
        name:'Principal',
        email: process.env.PRINCIPAL_EMAIL,
        password: hashedPassword,
        role: "Principal",
      });

      await newPrincipal.save();
      console.log("Principal account created.");
    } else {
      console.log("Principal account already exists.");
    }
  } catch (err) {
    console.error("Error creating Principal account:", err.message);
  }
};

// Set up the server to listen on a port
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
 await createPrincipalAccount()
});
