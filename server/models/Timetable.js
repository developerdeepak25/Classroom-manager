const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const timetableSchema = new Schema({
  classroom: {
    type: Schema.Types.ObjectId,
    ref: "Classroom",
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  day: {
    type: String,
    enum: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    required: true,
  },
});

const Timetable = mongoose.model("Timetable", timetableSchema);
module.exports = Timetable;
