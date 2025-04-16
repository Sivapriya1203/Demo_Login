const express = require("express");
const router = express.Router();
const { getAllStudents, addStudent, updateStudent,deleteStudent } = require("../Controllers/studentController");

router.get("/allstudents", getAllStudents);
router.post("/studentspost", addStudent);
router.put("/students/:id", updateStudent);  // Update student by ID
router.delete("/students/:id", deleteStudent);  // Delete student by ID

module.exports = router;
