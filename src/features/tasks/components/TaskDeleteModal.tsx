import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import type { TaskDeleteModalProps } from "../types/components";

function TaskDeleteModal({
  isOpen,
  taskTitle,
  error,
  isDeleting,
  onClose,
  onConfirm,
}: TaskDeleteModalProps) {
  function handleClose(_: object, reason: "backdropClick" | "escapeKeyDown") {
    if (isDeleting) {
      return;
    }

    if (reason === "backdropClick") {
      return;
    }

    onClose();
  }

  return (
    <Dialog
      aria-labelledby="delete-task-title"
      fullWidth
      maxWidth="xs"
      open={isOpen}
      slotProps={{ paper: { className: "app-dialog task-modal" } }}
      onClose={handleClose}
    >
      <DialogTitle className="app-dialog__title" id="delete-task-title">
        Delete task?
      </DialogTitle>
      <DialogContent className="app-dialog__content">
        <p className="app-dialog__copy task-modal__delete-copy">
          Are you sure you want to delete <strong>{taskTitle}</strong>? This action cannot be
          undone.
        </p>
        {error ? <Alert severity="error">{error}</Alert> : null}
      </DialogContent>
      <DialogActions className="app-dialog__actions">
        <Button onClick={onClose} disabled={isDeleting}>
          Cancel
        </Button>
        <Button color="error" variant="contained" onClick={onConfirm} disabled={isDeleting}>
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default TaskDeleteModal;
