import { createPortal } from "react-dom";

interface TaskErrorModalProps {
  message: string;
  onClose: () => void;
}

function TaskErrorModal({ message, onClose }: TaskErrorModalProps) {
  return createPortal(
    <div className="task-error-modal" onClick={onClose}>
      <div
        className="task-error-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-error-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="task-error-modal-title" className="task-error-modal__title">
          Could not update task
        </h2>
        <p className="task-error-modal__message">{message}</p>
        <button type="button" className="task-error-modal__button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>,
    document.body,
  );
}

export default TaskErrorModal;
