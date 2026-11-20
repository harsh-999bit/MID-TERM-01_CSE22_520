
import express from 'express';

const app = express();

app.use(express.json());

let students = [];
let nextId = 1;

// POST - Add Student
app.post('/api/students', (req, res) => {
    const { name, course, age } = req.body;

    if (!name || !course || age === undefined || age === null || age === '') {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    if (typeof name !== 'string' || !name.trim() ||
        typeof course !== 'string' || !course.trim() ||
        typeof age !== 'number' || !Number.isFinite(age) || age < 0) {
        return res.status(400).json({
            message: "Invalid student data"
        });
    }

    const duplicate = students.find(
        s => s.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (duplicate) {
        return res.status(409).json({
            message: "Student already exists"
        });
    }

    const newStudent = {
        id: nextId++,
        name: name.trim(),
        course: course.trim(),
        age
    };

    students.push(newStudent);

    res.status(201).json({
        message: "Student added successfully",
        student: newStudent
    });
});


// GET - All Students
app.get('/api/students', (req, res) => {
    const { course } = req.query;

    if (course) {
        const filteredStudents = students.filter(
            s => s.course.toLowerCase() === course.toLowerCase()
        );

        return res.status(200).json(filteredStudents);
    }

    res.status(200).json(students);
});


// GET - Student By ID
app.get('/api/students/:id', (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(404).json({
            message: "Invalid student ID"
        });
    }

    const student = students.find(s => s.id === id);

    if (!student) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    res.status(200).json(student);
});


// PUT - Update Student
app.put('/api/students/:id', (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(404).json({
            message: "Invalid student ID"
        });
    }

    const student = students.find(s => s.id === id);

    if (!student) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    const { name, course, age } = req.body;

    if (!name || !course || age === undefined || age === null || age === '') {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    if (typeof name !== 'string' || !name.trim() ||
        typeof course !== 'string' || !course.trim() ||
        typeof age !== 'number' || !Number.isFinite(age) || age < 0) {
        return res.status(400).json({
            message: "Invalid student data"
        });
    }

    const duplicate = students.find(
        s => s.id !== id &&
        s.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (duplicate) {
        return res.status(409).json({
            message: "Student name already exists"
        });
    }

    student.name = name.trim();
    student.course = course.trim();
    student.age = age;

    res.status(200).json({
        message: "Student updated successfully",
        student
    });
});


// DELETE - Remove Student
app.delete('/api/students/:id', (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(404).json({
            message: "Invalid student ID"
        });
    }

    const index = students.findIndex(s => s.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    const deletedStudent = students.splice(index, 1);

    res.status(200).json({
        message: "Student deleted successfully",
        student: deletedStudent[0]
    });
});


// Start Server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
