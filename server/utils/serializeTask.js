function serializeTask(task) {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    priority: task.priority,
    dueDate: task.due_date ?? task.dueDate,
    createdAt: task.created_at ?? task.createdAt,
    tag: task.tag,
    completed: task.completed,
  };
}

module.exports = { serializeTask };
