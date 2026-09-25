const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

let tasks = [
    { id: 1, text: 'เรียน Node.js', done: false },
    { id: 2, text: 'ติดตั้ง VS Code', done: true }
];

let nextId = 3;

// หน้าแรก
app.get('/', (req, res) => {
    res.send('Welcome to Home Page');
});

// ดูรายการงานทั้งหมด และกรองด้วย done
app.get('/api/tasks', (req, res) => {
    const { done } = req.query;

    if (done === undefined) {
        return res.json(tasks);
    }

    res.json(
        tasks.filter(t => String(t.done) === done)
    );
});

// ดูงานตาม ID
app.get('/api/tasks/:id', (req, res) => {
    const task = tasks.find(
        t => t.id === Number(req.params.id)
    );

    if (!task) {
        return res.status(404).json({
            error: 'ไม่พบรายการนี้'
        });
    }

    res.json(task);
});

// เพิ่มงานใหม่
app.post('/api/tasks', (req, res) => {
    const text = req.body.text;

    if (!text) {
        return res.status(400).json({
            error: 'ต้องระบุ text'
        });
    }

    const newTask = {
        id: nextId++,
        text: text,
        done: false
    };

    tasks.push(newTask);

    res.status(201).json(newTask);
});

// เปลี่ยนสถานะงาน
app.patch('/api/tasks/:id', (req, res) => {
    const task = tasks.find(
        t => t.id === Number(req.params.id)
    );

    if (!task) {
        return res.status(404).json({
            error: 'ไม่พบรายการนี้'
        });
    }

    task.done = !task.done;

    res.json(task);
});

// ลบงาน
app.delete('/api/tasks/:id', (req, res) => {
    const id = Number(req.params.id);

    tasks = tasks.filter(
        t => t.id !== id
    );

    res.status(204).end();
});

// เริ่ม Server
const PORT = 3000;

app.listen(PORT, () => {
    console.log`(
        Server is running at http://localhost:${PORT}/
    )`;
});