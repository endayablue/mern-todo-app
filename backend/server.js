

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const todoRoutes = express.Router();
require("dotenv").config();
const { MONGO_URL, PORT } = process.env;
let Todo = require('./models/todo.model');

app.use(bodyParser.json());
app.use(cors());

const connection = mongoose.connection;

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
  })
  .then(() => console.log("MongoDB is  connected successfully"))
  .catch((err) => console.error(err));

todoRoutes.route('/').get(async function (req, res) {
    try {
      const todos = await Todo.find();
      res.json(todos);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  todoRoutes.route('/:id').get(async function (req, res) {
    try {
      const id = req.params.id;
      const todo = await Todo.findById(id);
      res.json(todo);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  todoRoutes.route('/update/:id').post(function (req, res) {
    Todo.findById(req.params.id, function (err, todo) {
      if (!todo) res.status(404).send("data is not found");
      else {
        todo.todo_description = req.body.todo_description;
        todo.todo_responsible = req.body.todo_responsible;
        todo.todo_priority = req.body.todo_priority;
        todo.todo_completed = req.body.todo_completed;
        todo.save()
          .then(todo => {
            res.json('Todo updated!');
          })
          .catch(err => {
            res.status(400).send("Update not possible");
          });
      }
    });
  });
  todoRoutes.route('/add').post(async function (req, res) {
    try {
      const todo = new Todo(req.body);
      await todo.save();
      res.status(200).json({ 'todo': 'todo added successfully' });
    } catch (err) {
      console.error(err);
      res.status(400).send('adding new todo failed');
    }
  });
app.use('/todos', todoRoutes);
app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});