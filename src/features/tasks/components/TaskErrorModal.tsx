import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import type { TaskErrorModalProps } from "../types/components";

function TaskErrorModal({ open, message, onClose }: TaskErrorModalProps) {
  return (
    <Dialog
      aria-labelledby="task-error-modal-title"
      fullWidth
      maxWidth="xs"
      open={open}
      slotProps={{ paper: { className: "app-dialog task-modal" } }}
      onClose={() => onClose()}
    >
      <DialogTitle className="app-dialog__title" id="task-error-modal-title">
        Could not update task
      </DialogTitle>
      <DialogContent className="app-dialog__content">
        <DialogContentText className="app-dialog__subdued-text">{message}</DialogContentText>
      </DialogContent>
      <DialogActions className="app-dialog__actions">
        <Button type="button" variant="contained" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default TaskErrorModal;
