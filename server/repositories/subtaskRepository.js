const Subtask = require("../models/Subtask");

async function updateSubtaskCompletion(subtask, completed) {
  subtask.completed = completed;
  await subtask.save();
  return subtask;
}

function findSubtaskByIdForTask(subtaskId, taskId) {
  return Subtask.findOne({
    where: {
      id: subtaskId,
      task_id: taskId,
    },
  });
}

module.exports = {
  updateSubtaskCompletion,
  findSubtaskByIdForTask,
};
