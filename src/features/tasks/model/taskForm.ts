import type { CreateTaskDto } from "../../../shared/types";

export type TaskFormErrors = Partial<Record<keyof CreateTaskDto, string>>;

export const EMPTY_TASK_FORM: CreateTaskDto = {
  title: "",
  description: "",
  priority: "medium",
  dueDate: "",
  tag: "",
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
  };
}

export function validateTaskForm(values: CreateTaskDto): TaskFormErrors {
  const errors: TaskFormErrors = {};
  const today = todayAsDateInputValue();

  if (!values.title) {
    errors.title = "Title is required.";
  }

  if (!values.description) {
    errors.description = "Description is required.";
  }

  if (!values.priority) {
    errors.priority = "Priority is required.";
  }

  if (!values.dueDate) {
    errors.dueDate = "Due date is required.";
  } else if (values.dueDate < today) {
    errors.dueDate = "Due date cannot be in the past.";
  }

  if (!values.tag) {
    errors.tag = "Tag is required.";
  }

  return errors;
}
