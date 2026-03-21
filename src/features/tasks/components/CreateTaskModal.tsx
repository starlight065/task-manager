import {
  Alert,
  Box,
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
      onClose={handleDialogClose}
    >
      <Box component="form" onSubmit={onSubmit}>
        <DialogTitle
          id={titleId}
          sx={{
            alignItems: "center",
            display: "flex",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <span>{modalTitle}</span>
          <IconButton
            onClick={handleCloseRequest}
            disabled={isSubmitting}
            aria-label={closeLabel}
          >
            <img src={closeIcon} alt="" width="24" height="24" />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              pt: 1,
            }}
          >
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

            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: {
                  sm: "repeat(2, minmax(0, 1fr))",
                  xs: "1fr",
                },
              }}
            >
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
            </Box>

            <TextField
              disabled={isSubmitting}
              error={Boolean(fieldErrors.tag)}
              helperText={fieldErrors.tag}
              label="Tag (optional)"
              type="text"
              value={formValues.tag}
              onChange={handleChange("tag")}
            />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Box sx={{ fontSize: "0.875rem", fontWeight: 500, color: "text.secondary" }}>
                Subtasks
              </Box>
              <Box sx={{ display: "flex", gap: 1 }}>
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
                  disabled={isSubmitting || !subtaskInput.trim()}
                  onClick={handleAddSubtask}
                  sx={{ whiteSpace: "nowrap", flexShrink: 0 }}
                >
                  Add
                </Button>
              </Box>

              {subtasks.length > 0 && (
                <Box
                  component="ul"
                  sx={{ listStyle: "none", p: 0, m: 0, display: "flex", flexDirection: "column", gap: 0.5 }}
                >
                  {subtasks.map((title, index) => (
                    <Box
                      component="li"
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        px: 1.5,
                        py: 0.75,
                        borderRadius: 1,
                        bgcolor: "action.hover",
                      }}
                    >
                      <Box sx={{ flex: 1, fontSize: "0.875rem" }}>{title}</Box>
                      <IconButton
                        size="small"
                        disabled={isSubmitting}
                        onClick={() => onSubtaskRemove(index)}
                        aria-label={`Remove subtask "${title}"`}
                        sx={{ p: 0.25 }}
                      >
                        <img src={closeIcon} alt="" width="16" height="16" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>

            {formError ? <Alert severity="error">{formError}</Alert> : null}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={handleCloseRequest}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {submitLabel}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default CreateTaskModal;
