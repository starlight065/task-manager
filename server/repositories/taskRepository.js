const Task = require("../models/Task");

function findTasksByUserId(userId) {
  return Task.findAll({
    where: { user_id: userId },
    order: [
      ["completed", "ASC"],
      ["due_date", "ASC"],
      ["id", "ASC"],
    ],
  });
}

function createTask({ userId, title, description, priority, dueDate, tag }) {
  return Task.create({
    user_id: userId,
    title,
    description,
    priority,
    due_date: dueDate,
    tag,
  });
}

async function updateTask(task, { title, description, priority, dueDate, tag }) {
  task.title = title;
  task.description = description;
  task.priority = priority;
  task.due_date = dueDate;
  task.tag = tag;
  await task.save();
  return task;
}

function findTaskByIdForUser(taskId, userId) {
  return Task.findOne({
    where: {
      id: taskId,
      user_id: userId,
    },
  });
}

async function updateTaskCompletion(task, completed) {
  task.completed = completed;
  await task.save();
  return task;
}

async function deleteTask(task) {
  await task.destroy();
}

module.exports = {
  createTask,
  deleteTask,
  findTasksByUserId,
  findTaskByIdForUser,
  updateTask,
  updateTaskCompletion,
};
