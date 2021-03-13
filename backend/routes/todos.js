const debug = require("debug")("app:route:todos");
const express = require("express");
const Todo = require("../models/Todo");
const router = express.Router();

// GET = Get List
router.get("/", async (req, res) => {
  const todos = await Todo.find();
  res.send(todos);
});

// GET = Get TODO by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const { todos } = DB;

  const todo = todos.find((t) => t._id === parseInt(id));

  if (todo) {
    res.send(todo);
  } else {
    res.send(404);
  }
});

// POST = Add new TODO
router.post("/", async (req, res) => {
  const { desc } = req.body;

  // TODO: Joi validation

  // Find if desc already exists
  const exist = await Todo.find((t) => t.desc.toLowerCase() === desc.toLowerCase());

  if (exist)
    return res.status(403).json({ message: "Já existe um documento igual." });

    console.log(desc);

  const todo = new Todo({
    desc: desc,
  });

  await todo.save();

  res.send(todo);
});

// PUT = Edit todo by ID
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { desc } = req.body;

  debug(req.body);

  const todo = DB.todos.find((t) => t._id === parseInt(id));

  if (!todo)
    return res
      .status(404)
      .json({ message: "Este ID não corresponde a nenhum documento." });

  // Find if desc already exists
  const exist = DB.todos.find(
    (t) => t.desc.toLowerCase() === desc.toLowerCase()
  );

  if (exist)
    return res.status(403).json({ message: "Já existe um documento igual." });

  todo.desc = desc;

  res.send(todo);
});

// PUT = IsDone by ID
router.put("/isDone/:id", (req, res) => {
  const { id } = req.params;

  const todo = DB.todos.find((t) => t._id === parseInt(id));

  if (!todo)
    return res
      .status(404)
      .json({ message: "Este ID não corresponde a nenhum documento." });

  todo.isDone = true;

  res.send(todo);
});

// DELETE = Delete TODO by ID
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const todo = DB.todos.find((t) => t._id === parseInt(id));

  debug(todo);

  if (!todo)
    return res
      .status(404)
      .json({ message: "Este ID não corresponde a nenhum documento." });

  const index = DB.todos.indexOf(todo);
  DB.todos.splice(index, 1);

  res.send(todo);
});

module.exports = router;
