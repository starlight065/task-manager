const ALLOWED_PRIORITIES = new Set(["high", "medium", "low"]);
const DUE_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function validateCreateTaskPayload(payload) {
  const title = typeof payload?.title === "string" ? payload.title.trim() : "";
  const description =
    typeof payload?.description === "string" ? payload.description.trim() : "";
  const priority = payload?.priority;
  const dueDate = typeof payload?.dueDate === "string" ? payload.dueDate.trim() : "";
  const tag = typeof payload?.tag === "string" ? payload.tag.trim() : "";
  const today = new Date().toISOString().slice(0, 10);

  if (!title) {
    return { error: "Title is required" };
  }

  if (!ALLOWED_PRIORITIES.has(priority)) {
    return { error: "Priority must be high, medium, or low" };
  }

  if (dueDate && !DUE_DATE_PATTERN.test(dueDate)) {
    return { error: "Due date must use YYYY-MM-DD format" };
  }

  if (dueDate && dueDate < today) {
    return { error: "Due date cannot be in the past" };
  }

  return {
    value: {
      title,
      description: description || null,
      priority,
      dueDate: dueDate || null,
      tag: tag || null,
    },
  };
}

function validateTaskCompletionPayload(payload) {
  if (typeof payload?.completed !== "boolean") {
    return { error: "Completed must be a boolean" };
  }

  return {
    value: {
      completed: payload.completed,
    },
  };
}

module.exports = {
  validateCreateTaskPayload,
  validateTaskCompletionPayload,
};
