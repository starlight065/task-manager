const express = require("express");
const {
  createTask,
  deleteTask,
  findTasksByUserId,
  findTaskByIdForUser,
  updateTask,
  updateTaskCompletion,
} = require("../../repositories/taskRepository");
const { requireAuth } = require("../../middleware/requireAuth");
const { serializeTask } = require("../../utils/serializeTask");
const { AUTH_MESSAGES } = require("../../validators/authValidator");
const {
  validateCreateTaskPayload,
  validateTaskCompletionPayload,
} = require("../../validators/taskValidator");

const router = express.Router();

router.use(requireAuth);

router.get("/tasks", async (req, res) => {
  try {
    const tasks = await findTasksByUserId(req.user.id);

    return res.json({ tasks: tasks.map(serializeTask) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: AUTH_MESSAGES.serverError });
  }
});

router.post("/tasks", async (req, res) => {
  try {
    const result = validateCreateTaskPayload(req.body);

    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    const task = await createTask({
      userId: req.user.id,
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

router.put("/tasks/:taskId", async (req, res) => {
  try {
    const taskId = Number.parseInt(req.params.taskId, 10);
    if (!Number.isInteger(taskId) || taskId <= 0) {
      return res.status(400).json({ error: "Task id must be a positive integer" });
    }

    const result = validateCreateTaskPayload(req.body);
    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    const task = await findTaskByIdForUser(taskId, req.user.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    const updatedTask = await updateTask(task, result.value);

    return res.json({ task: serializeTask(updatedTask) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: AUTH_MESSAGES.serverError });
  }
});

router.patch("/tasks/:taskId", async (req, res) => {
  try {
    const taskId = Number.parseInt(req.params.taskId, 10);
    if (!Number.isInteger(taskId) || taskId <= 0) {
      return res.status(400).json({ error: "Task id must be a positive integer" });
    }

    const result = validateTaskCompletionPayload(req.body);
    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    const task = await findTaskByIdForUser(taskId, req.user.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    const updatedTask = await updateTaskCompletion(task, result.value.completed);

    return res.json({ task: serializeTask(updatedTask) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: AUTH_MESSAGES.serverError });
  }
});

router.delete("/tasks/:taskId", async (req, res) => {
  try {
    const taskId = Number.parseInt(req.params.taskId, 10);
    if (!Number.isInteger(taskId) || taskId <= 0) {
      return res.status(400).json({ error: "Task id must be a positive integer" });
    }

    const task = await findTaskByIdForUser(taskId, req.user.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    await deleteTask(task);

    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: AUTH_MESSAGES.serverError });
  }
});

module.exports = router;
