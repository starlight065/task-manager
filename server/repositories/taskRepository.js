const Task = require("../models/Task");
const Subtask = require("../models/Subtask");

function findTasksByUserId(userId) {
  return Task.findAll({
    where: { user_id: userId },
    include: [{ model: Subtask, as: "subtasks" }],
    order: [
      ["completed", "ASC"],
      ["due_date", "ASC"],
      ["id", "ASC"],
    ],
  });
}

async function createTask({ userId, title, description, priority, dueDate, tag, subtasks = [] }) {
  const task = await Task.create({
    user_id: userId,
    title,
    description,
    priority,
    due_date: dueDate,
    tag,
  });

  if (subtasks.length > 0) {
    await Subtask.bulkCreate(
      subtasks.map((subtaskTitle) => ({ task_id: task.id, title: subtaskTitle })),
    );
  }

  return findTaskByIdForUser(task.id, userId);
}

async function updateTask(task, { title, description, priority, dueDate, tag, subtasks }) {
  task.title = title;
  task.description = description;
  task.priority = priority;
  task.due_date = dueDate;
  task.tag = tag;
  await task.save();

  if (subtasks !== undefined) {
    const incomingIds = subtasks.filter((s) => s.id != null).map((s) => s.id);

    await Subtask.destroy({
      where: {
        task_id: task.id,
        ...(incomingIds.length > 0 ? { id: { [require("sequelize").Op.notIn]: incomingIds } } : {}),
      },
    });

    for (const subtask of subtasks) {
      if (subtask.id != null) {
        await Subtask.update({ title: subtask.title }, { where: { id: subtask.id, task_id: task.id } });
      } else {
        await Subtask.create({ task_id: task.id, title: subtask.title });
      }
    }

    if (subtasks.length === 0) {
      await Subtask.destroy({ where: { task_id: task.id } });
    }
  }

  return findTaskByIdForUser(task.id, task.user_id);
}

function findTaskByIdForUser(taskId, userId) {
  return Task.findOne({
    where: {
      id: taskId,
      user_id: userId,
    },
    include: [{ model: Subtask, as: "subtasks" }],
  });
}

async function updateTaskCompletion(task, completed) {
  task.completed = completed;
  await task.save();
  return findTaskByIdForUser(task.id, task.user_id);
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
