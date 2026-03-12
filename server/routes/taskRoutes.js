const express = require("express");
const {
  createTask,
  findTasksByUserId,
} = require("../repositories/taskRepository");
const { serializeTask } = require("../utils/serializeTask");
const { getAuthenticatedUser } = require("../services/sessionService");
const { AUTH_MESSAGES } = require("../validators/authValidator");
const { validateCreateTaskPayload } = require("../validators/taskValidator");

const router = express.Router();

router.get("/tasks", async (req, res) => {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return res.status(401).json({ error: AUTH_MESSAGES.unauthorized });
    }

    const tasks = await findTasksByUserId(user.id);

    return res.json({ tasks: tasks.map(serializeTask) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: AUTH_MESSAGES.serverError });
  }
});

router.post("/tasks", async (req, res) => {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return res.status(401).json({ error: AUTH_MESSAGES.unauthorized });
    }

    const result = validateCreateTaskPayload(req.body);

    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    const task = await createTask({
      userId: user.id,
      title: result.value.title,
      description: result.value.description,
      priority: result.value.priority,
      dueDate: result.value.dueDate,
      tag: result.value.tag,
    });

    return res.status(201).json({ task: serializeTask(task) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: AUTH_MESSAGES.serverError });
  }
});

module.exports = router;
