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
import closeIcon from "../../assets/icon-close.svg";
import { type ChangeEvent, type SubmitEvent } from "react";
import type { CreateTaskDto } from "../../shared/types";
import type { TaskFormErrors } from "../../features/tasks/taskForm";

const PRIORITY_OPTIONS = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
] satisfies ReadonlyArray<{ label: string; value: CreateTaskDto["priority"] }>;

interface CreateTaskModalProps {
  isOpen: boolean;
  formValues: CreateTaskDto;
  fieldErrors: TaskFormErrors;
  formError: string | null;
  isSubmitting: boolean;
  onClose: () => void;
  onFieldChange: (field: keyof CreateTaskDto, value: string) => void;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
}

function CreateTaskModal({
  isOpen,
  formValues,
  fieldErrors,
  formError,
  isSubmitting,
  onClose,
  onFieldChange,
  onSubmit,
}: CreateTaskModalProps) {
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

  return (
    <Dialog
      aria-labelledby="create-task-title"
      fullWidth
      maxWidth="sm"
      open={isOpen}
      onClose={handleDialogClose}
    >
      <Box component="form" onSubmit={onSubmit}>
        <DialogTitle
          id="create-task-title"
          sx={{
            alignItems: "center",
            display: "flex",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <span>
            New task
          </span>
          <IconButton
            onClick={handleCloseRequest}
            disabled={isSubmitting}
            aria-label="Close new task modal"
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
              label="Description"
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
                label="Due date"
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
              label="Tag"
              type="text"
              value={formValues.tag}
              onChange={handleChange("tag")}
            />

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
            {isSubmitting ? "Saving..." : "Save task"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default CreateTaskModal;
