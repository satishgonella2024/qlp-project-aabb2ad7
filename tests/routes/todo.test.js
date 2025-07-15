const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');

describe('Todo API', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('GET /todos', () => {
    it('should return all todos', async () => {
      const res = await request(app).get('/todos');
      expect(res.statusCode).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
    });
  });

  describe('POST /todos', () => {
    it('should create a new todo', async () => {
      const res = await request(app)
        .post('/todos')
        .send({ text: 'Test todo' });
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('text', 'Test todo');
    });
  });

  describe('PATCH /todos/:id', () => {
    let todoId;
    beforeAll(async () => {
      const res = await request(app)
        .post('/todos')
        .send({ text: 'Test todo' });
      todoId = res.body._id;
    });

    it('should update a todo', async () => {
      const res = await request(app)
        .patch(`/todos/${todoId}`)
        .send({ text: 'Updated todo', completed: true });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('text', 'Updated todo');
      expect(res.body).toHaveProperty('completed', true);
    });
  });

  describe('DELETE /todos/:id', () => {
    let todoId;
    beforeAll(async () => {
      const res = await request(app)
        .post('/todos')
        .send({ text: 'Test todo' });
      todoId = res.body._id;
    });

    it('should delete a todo', async () => {
      const res = await request(app).delete(`/todos/${todoId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Todo deleted');
    });
  });
});