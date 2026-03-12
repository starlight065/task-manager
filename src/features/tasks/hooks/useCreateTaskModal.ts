import { useState, type SubmitEvent } from "react";
import type { CreateTaskDto, TaskDto } from "../../../shared/types";
import { createTask } from "../api/tasksApi";
import {
  EMPTY_TASK_FORM,
  normalizeTaskFormValues,
  validateTaskForm,
  type TaskFormErrors,
} from "../taskForm";

interface UseCreateTaskModalOptions {
  onTaskCreated: (task: TaskDto) => void;
}

export function useCreateTaskModal({ onTaskCreated }: UseCreateTaskModalOptions) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [formValues, setFormValues] = useState<CreateTaskDto>(EMPTY_TASK_FORM);
  const [fieldErrors, setFieldErrors] = useState<TaskFormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function open() {
    setFormValues(EMPTY_TASK_FORM);
    setFieldErrors({});
    setFormError(null);
    setIsClosing(false);
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
    setIsClosing(false);
    setFieldErrors({});
    setFormError(null);
  }

  function onFieldChange(field: keyof CreateTaskDto, value: string) {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));

    setFieldErrors((currentErrors) => {
      if (!currentErrors[field]) {
        return currentErrors;
      }

      return {
        ...currentErrors,
        [field]: undefined,
      };
    });

    setFormError(null);
  }

  async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedValues = normalizeTaskFormValues(formValues);
    const nextErrors = validateTaskForm(trimmedValues);

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);
    setFieldErrors({});
    setFormError(null);

    try {
      const createdTask = await createTask(trimmedValues);

      onTaskCreated(createdTask);
      setFormValues(EMPTY_TASK_FORM);
      setIsClosing(true);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to create task");
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    isOpen,
    isClosing,
    formValues,
    fieldErrors,
    formError,
    isSubmitting,
    open,
    close,
    onFieldChange,
    onSubmit,
  };
}
