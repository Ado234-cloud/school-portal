const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
const dbURI = 'mongodb+srv://alihandsome227_db_user:V8m9vfesTH999LYJ@cluster0.pf6dpl3.mongodb.net/schoolPortal?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(dbURI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Database connection error:', err));

// Student Data Schema
const studentSchema = new mongoose.Schema({
    studentId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    math: Number,
    english: Number,
    basic: Number,
    total: Number,
    average: String,
    grade: String,
    statusText: String,
    statusClass: String,
    badgeClass: String
});

const Student = mongoose.model('Student', studentSchema);

// API 1: Save or Update Student Result (Teacher Portal)
app.post('/api/results', async (req, res) => {
    try {
        const data = req.body;
        const student = await Student.findOneAndUpdate(
            { studentId: data.studentId },
            data,
            { upsert: true, new: true }
        );
        res.status(200).json({ message: 'Result saved successfully!', student });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save result' });
    }
});

// API 2: Fetch Student Result by ID (Parent Login)
app.get('/api/results/:studentId', async (req, res) => {
    try {
        const student = await Student.findOne({ studentId: req.params.studentId });
        if (!student) {
            return res.status(404).json({ error: 'No student record found with this ID' });
        }
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ error: 'Server error retrieving data' });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
