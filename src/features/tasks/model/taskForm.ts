import type { CreateTaskDto } from "../../../shared/types";
import type { TaskFormErrors } from "../types/model";

export const EMPTY_TASK_FORM: CreateTaskDto = {
  title: "",
  description: "",
  priority: "medium",
  dueDate: "",
  tag: "",
  subtasks: [],
};

function todayAsDateInputValue(): string {
  return new Date().toISOString().slice(0, 10);
}

export function normalizeTaskFormValues(values: CreateTaskDto): CreateTaskDto {
  return {
    title: values.title.trim(),
    description: values.description.trim(),
    priority: values.priority,
    dueDate: values.dueDate,
    tag: values.tag.trim(),
    subtasks: (values.subtasks ?? []).map((s) => s.trim()).filter(Boolean),
  };
}

export function validateTaskForm(values: CreateTaskDto): TaskFormErrors {
  const errors: TaskFormErrors = {};
  const today = todayAsDateInputValue();

  if (!values.title) {
    errors.title = "Title is required.";
  }

  if (!values.priority) {
    errors.priority = "Priority is required.";
  }

  if (values.dueDate && values.dueDate < today) {
    errors.dueDate = "Due date cannot be in the past.";
  }

  return errors;
}
