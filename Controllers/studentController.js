// const db = require("../config/db"); // MySQL connection

// // Get all students
// exports.getAllStudents = (req, res) => {
//   db.query("SELECT * FROM students", (err, results) => {
//     if (err) {
//       return res.status(500).json({ message: "Error fetching students", error: err });
//     }
//     res.json(results);
//   });
// };

// // Add a new student
// exports.addStudent = (req, res) => {
//   const { name, age, className, email } = req.body;

//   // Check for missing fields
//   if (!name || !age || !className || !email) {
//     return res.status(400).json({ message: "All fields are required" });
//   }

//   // Insert a new student into the database
//   const query = " INSERT INTO students (name, age, className, email) VALUES (?, ?, ?, ?)";
//   db.query(query, [name, age, className, email], (err, results) => {
//     if (err) {
//       return res.status(500).json({ message: "Error adding student", error: err });
//     }
//     const newStudent = { id: results.insertId, name, age, className, email };
//     res.status(201).json(newStudent);
//   });
// };

// // Update an existing student
// exports.updateStudent = (req, res) => {
//   const { id } = req.params;
//   const { name, age, className, email } = req.body;

//   // Update student data
//   const query = "UPDATE students SET name = ?, age = ?, className = ?, email = ? WHERE id = ?";
//   db.query(query, [name, age, className, email, id], (err, results) => {
//     if (err) {
//       return res.status(500).json({ message: "Error updating student", error: err });
//     }

//     if (results.affectedRows === 0) {
//       return res.status(404).json({ message: "Student not found" });
//     }

//     const updatedStudent = { id, name, age, className, email };
//     res.json(updatedStudent);
//   });
// };

// // Delete a student
// exports.deleteStudent = (req, res) => {
//   const { id } = req.params;

//   // Delete student from the database
//   const query = "DELETE FROM students WHERE id = ?";
//   db.query(query, [id], (err, results) => {
//     if (err) {
//       return res.status(500).json({ message: "Error deleting student", error: err });
//     }

//     if (results.affectedRows === 0) {
//       return res.status(404).json({ message: "Student not found" });
//     }

//     res.json({ message: "Student deleted successfully" });
//   });
// };









const mongoose = require("mongoose");
const Student = require("../models/Students"); // Mongoose Student model

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students", error });
  }
};

// Add a new student
exports.addStudent = async (req, res) => {
  const { name, age, className, email } = req.body;

  if (!name || !age || !className || !email) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newStudent = new Student({ name, age, className, email });
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ message: "Error adding student", error });
  }
};

// Update an existing student
exports.updateStudent = async (req, res) => {
  const { id } = req.params;
  const { name, age, className, email } = req.body;

  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { name, age, className, email },
      { new: true }
    );
    
    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }
    
    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: "Error updating student", error });
  }
};

// Delete a student
exports.deleteStudent = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedStudent = await Student.findByIdAndDelete(id);
    
    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }
    
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting student", error });
  }
};

