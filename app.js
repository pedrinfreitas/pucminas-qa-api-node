const express = require("express");
const UserRepository = require("./user-repository");
const { MongoClient } = require("mongodb");
const AppContainer = require("./container");

const app = express();
app.use(express.json());

app.set("container", new AppContainer());

app.post("/users", async (req, res) => {
  const repository = await app.get("container").getUserRepository();
  const user = await repository.insert(req.body);

  res.status(201).json(user);
});

app.get("/users", async (_req, res) => {
  const repository = await app.get("container").getUserRepository();
  const users = await repository.findAll();
  res.json(users);
});

app.get("/users/:id", async (req, res) => {
  const repository = await app.get("container").getUserRepository();
  const user = await repository.findById(req.params.id);

  if (user === null) {
    res.status(404).json({
      error: "User not found",
      statusCode: 404,
    });
  } else {
    res.json(user);
  }
});

app.put("/users/:id", async (req, res) => {
  const repository = await app.get("container").getUserRepository();
  const user = await repository.update(req.params.id, req.body);

  if (!user) {
    res.status(404).json({
      error: "User not found",
      statusCode: 404,
    });
  } else {
    res.json(user);
  }
});

app.delete("/users/:id", async (req, res) => {
  const repository = await app.get("container").getUserRepository();
  const deleted = await repository.delete(req.params.id);

  if (deleted > 0) {
    res.status(204).send();
  } else {
    res.status(404).json({
      error: "User not found",
      statusCode: 404,
    });
  }
});

module.exports = app;
