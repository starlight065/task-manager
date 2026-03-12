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

module.exports = {
  createTask,
  findTasksByUserId,
};
