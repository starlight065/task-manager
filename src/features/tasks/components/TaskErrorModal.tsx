import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

interface TaskErrorModalProps {
  open: boolean;
  message: string;
  onClose: () => void;
}

function TaskErrorModal({ open, message, onClose }: TaskErrorModalProps) {
  return (
    <Dialog
      aria-labelledby="task-error-modal-title"
      fullWidth
      maxWidth="xs"
      open={open}
      onClose={() => onClose()}
    >
      <DialogTitle id="task-error-modal-title">Could not update task</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button type="button" variant="contained" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default TaskErrorModal;
