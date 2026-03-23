import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  TextField,
} from "@mui/material";
import closeIcon from "../../../assets/icon-close.svg";
import { type ChangeEvent, type KeyboardEvent, useRef, useState } from "react";
import type { CreateTaskDto } from "../../../shared/types";
import type { CreateTaskModalProps } from "../types/components";

const PRIORITY_OPTIONS = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
] satisfies ReadonlyArray<{ label: string; value: CreateTaskDto["priority"] }>;

function CreateTaskModal({
  isOpen,
  mode,
  formValues,
  fieldErrors,
  formError,
  isSubmitting,
  onClose,
  onFieldChange,
  onSubtaskAdd,
  onSubtaskRemove,
  onSubmit,
}: CreateTaskModalProps) {
  const titleId = mode === "create" ? "create-task-title" : "edit-task-title";
  const modalTitle = mode === "create" ? "New task" : "Edit task";
  const closeLabel =
    mode === "create" ? "Close new task modal" : "Close edit task modal";
  const submitLabel = isSubmitting
    ? "Saving..."
    : mode === "create"
      ? "Save task"
      : "Update task";

  const [subtaskInput, setSubtaskInput] = useState("");
  const subtaskInputRef = useRef<HTMLInputElement>(null);

  const subtasks = formValues.subtasks ?? [];

  function handleCloseRequest() {
    if (isSubmitting) {
      return;
    }

    onClose();
  }

  function handleDialogClose(_: object, reason: "backdropClick" | "escapeKeyDown") {
    if (isSubmitting) {
      return;
    }

    if (reason === "backdropClick") {
      return;
    }

    onClose();
  }

  function handleChange(field: keyof CreateTaskDto) {
    return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onFieldChange(field, event.target.value);
    };
  }

  function handleAddSubtask() {
    const trimmed = subtaskInput.trim();
    if (!trimmed) return;
    onSubtaskAdd(trimmed);
    setSubtaskInput("");
    subtaskInputRef.current?.focus();
  }

  function handleSubtaskInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddSubtask();
    }
  }

  return (
    <Dialog
      aria-labelledby={titleId}
      fullWidth
      maxWidth="sm"
      open={isOpen}
      slotProps={{ paper: { className: "app-dialog task-modal" } }}
      onClose={handleDialogClose}
    >
      <form className="task-modal__form" onSubmit={onSubmit}>
        <DialogTitle
          className="app-dialog__title app-dialog__title--split"
          id={titleId}
        >
          <span>{modalTitle}</span>
          <IconButton
            aria-label={closeLabel}
            className="app-dialog__close-button"
            disabled={isSubmitting}
            onClick={handleCloseRequest}
          >
            <img src={closeIcon} alt="" width="24" height="24" />
          </IconButton>
        </DialogTitle>

        <DialogContent className="app-dialog__content app-dialog__content--form">
          <div className="task-modal__fields">
            <TextField
              autoFocus
              disabled={isSubmitting}
              error={Boolean(fieldErrors.title)}
              helperText={fieldErrors.title}
              label="Title"
              type="text"
              value={formValues.title}
              onChange={handleChange("title")}
            />
            <TextField
              disabled={isSubmitting}
              error={Boolean(fieldErrors.description)}
              helperText={fieldErrors.description}
              label="Description (optional)"
              minRows={4}
              multiline
              value={formValues.description}
              onChange={handleChange("description")}
            />

            <div className="task-modal__split-fields">
              <TextField
                disabled={isSubmitting}
                error={Boolean(fieldErrors.priority)}
                fullWidth
                helperText={fieldErrors.priority}
                id="create-task-priority"
                label="Priority"
                select
                value={formValues.priority}
                onChange={(event) =>
                  onFieldChange("priority", event.target.value as CreateTaskDto["priority"])
                }
              >
                {PRIORITY_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                disabled={isSubmitting}
                error={Boolean(fieldErrors.dueDate)}
                fullWidth
                helperText={fieldErrors.dueDate}
                id="create-task-due-date"
                label="Due date (optional)"
                type="date"
                value={formValues.dueDate}
                onChange={handleChange("dueDate")}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />
            </div>

            <TextField
              disabled={isSubmitting}
              error={Boolean(fieldErrors.tag)}
              helperText={fieldErrors.tag}
              label="Tag (optional)"
              type="text"
              value={formValues.tag}
              onChange={handleChange("tag")}
            />

            <div className="task-modal__subtasks">
              <div className="task-modal__subtasks-label">Subtasks</div>
              <div className="task-modal__subtasks-input">
                <TextField
                  inputRef={subtaskInputRef}
                  disabled={isSubmitting}
                  label="Add subtask"
                  size="small"
                  fullWidth
                  value={subtaskInput}
                  onChange={(e) => setSubtaskInput(e.target.value)}
                  onKeyDown={handleSubtaskInputKeyDown}
                  slotProps={{ htmlInput: { maxLength: 200 } }}
                />
                <Button
                  type="button"
                  variant="outlined"
                  size="small"
                  className="task-modal__subtask-add"
                  disabled={isSubmitting || !subtaskInput.trim()}
                  onClick={handleAddSubtask}
                >
                  Add
                </Button>
              </div>

              {subtasks.length > 0 && (
                <ul className="task-modal__subtask-list">
                  {subtasks.map((title, index) => (
                    <li className="task-modal__subtask-item" key={index}>
                      <span className="task-modal__subtask-title">{title}</span>
                      <IconButton
                        className="task-modal__subtask-remove"
                        size="small"
                        disabled={isSubmitting}
                        onClick={() => onSubtaskRemove(index)}
                        aria-label={`Remove subtask "${title}"`}
                      >
                        <img src={closeIcon} alt="" width="16" height="16" />
                      </IconButton>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {formError ? <Alert severity="error">{formError}</Alert> : null}
          </div>
        </DialogContent>

        <DialogActions className="app-dialog__actions">
          <Button disabled={isSubmitting} onClick={handleCloseRequest}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {submitLabel}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default CreateTaskModal;
