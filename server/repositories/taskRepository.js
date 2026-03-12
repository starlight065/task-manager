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

module.exports = {
  createTask,
  findTasksByUserId,
  findTaskByIdForUser,
  updateTaskCompletion,
};
