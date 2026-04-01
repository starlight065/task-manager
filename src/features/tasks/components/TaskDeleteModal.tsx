import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useI18n } from "../../../shared/i18n/useI18n";
import type { TaskDeleteModalProps } from "../types/components";

function TaskDeleteModal({
  isOpen,
  taskTitle,
  taskCount,
  error,
  isDeleting,
  onClose,
  onConfirm,
}: TaskDeleteModalProps) {
  const { t } = useI18n();

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
        {taskCount > 1 ? t("tasks.delete.bulkTitle") : t("tasks.delete.title")}
      </DialogTitle>
      <DialogContent className="app-dialog__content">
        <p className="app-dialog__copy task-modal__delete-copy">
          {taskCount > 1 ? (
            t("tasks.delete.confirmMany", { count: taskCount })
          ) : (
            <>
              {t("tasks.delete.confirmBefore")} <strong>{taskTitle}</strong>?{" "}
              {t("tasks.delete.confirmAfter")}
            </>
          )}
        </p>
        {error ? <Alert severity="error">{error}</Alert> : null}
      </DialogContent>
      <DialogActions className="app-dialog__actions">
        <Button onClick={onClose} disabled={isDeleting}>
          {t("common.cancel")}
        </Button>
        <Button color="error" variant="contained" onClick={onConfirm} disabled={isDeleting}>
          {isDeleting
            ? taskCount > 1
              ? t("tasks.delete.deletingSelected")
              : t("tasks.delete.deleting")
            : taskCount > 1
              ? t("tasks.delete.deleteSelected")
              : t("tasks.delete.delete")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default TaskDeleteModal;
