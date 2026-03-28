import type { CreateTaskDto } from "../../../shared/types";
import { t } from "../../../shared/i18n";
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
    errors.title = t("validation.titleRequired");
  }

  if (!values.priority) {
    errors.priority = t("validation.priorityRequired");
  }

  if (values.dueDate && values.dueDate < today) {
    errors.dueDate = t("validation.dueDatePast");
  }

  return errors;
}
