{
  "code": "const express = require('express');
const mongoose = require('mongoose');
const Todo = require('./models/Todo');

const app = express();

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost/todos', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Routes
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/todos', async (req, res) => {
  const todo = new Todo({
    title: req.body.title,
    completed: req.body.completed,
  });

  try {
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/api/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: 'Todo not found' });

    todo.title = req.body.title || todo.title;
    todo.completed = req.body.completed || todo.completed;

    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: 'Todo not found' });

    await todo.remove();
    res.json({ message: 'Todo removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
",

  "tests": "const request = require('supertest');
const app = require('./app');
const mongoose = require('mongoose');
const Todo = require('./models/Todo');

describe('Todo API', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await Todo.deleteMany({});
  });

  describe('GET /api/todos', () => {
    it('should return all todos', async () => {
      const todo1 = new Todo({ title: 'Todo 1', completed: false });
      const todo2 = new Todo({ title: 'Todo 2', completed: true });
      await todo1.save();
      await todo2.save();

      const res = await request(app).get('/api/todos');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body[0].title).toBe('Todo 1');
      expect(res.body[1].title).toBe('Todo 2');
    });
  });

  describe('POST /api/todos', () => {
    it('should create a new todo', async () => {
      const todo = { title: 'New Todo', completed: false };
      const res = await request(app).post('/api/todos').send(todo);
      expect(res.status).toBe(201);
      expect(res.body.title).toBe('New Todo');
      expect(res.body.completed).toBe(false);
    });
  });

  describe('PUT /api/todos/:id', () => {
    it('should update an existing todo', async () => {
      const todo = new Todo({ title: 'Todo to update', completed: false });
      await todo.save();

      const updatedTodo = { title: 'Updated Todo', completed: true };
      const res = await request(app).put(`/api/todos/${todo._id}`).send(updatedTodo);
      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Updated Todo');
      expect(res.body.completed).toBe(true);
    });
  });

  describe('DELETE /api/todos/:id', () => {
    it('should delete an existing todo', async () => {
      const todo = new Todo({ title: 'Todo to delete', completed: false });
      await todo.save();

      const res = await request(app).delete(`/api/todos/${todo._id}`);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Todo removed');
    });
  });
});
",

  "documentation": "This is a Node.js Express API for a todo list application. It provides CRUD operations for managing todos. The API uses MongoDB as the database for storing todos. The code includes input validation and error handling. The tests folder contains unit tests for all API endpoints using Jest and Supertest.",

  "dependencies": [
    "express",
    "mongoose",
    "supertest",
    "jest"
  ]
}