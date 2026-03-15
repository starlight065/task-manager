import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

interface TaskDeleteModalProps {
  isOpen: boolean;
  taskTitle: string;
  error: string | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

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
      onClose={handleClose}
    >
      <DialogTitle id="delete-task-title">Delete task?</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <p>
          Are you sure you want to delete <strong>{taskTitle}</strong>? This action cannot be
          undone.
        </p>
        {error ? <Alert severity="error">{error}</Alert> : null}
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
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
