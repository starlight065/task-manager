import closeIcon from "../../assets/icon-close.svg";
import { useState, type ChangeEvent, type MouseEvent, type SubmitEvent } from "react";
import AppSelect, { type SelectOption } from "../shared/AppSelect";
import type { CreateTaskDto } from "../../shared/types";
import type { TaskFormErrors } from "../../features/tasks/taskForm";

const PRIORITY_OPTIONS: SelectOption<CreateTaskDto["priority"]>[] = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

interface CreateTaskModalProps {
  formValues: CreateTaskDto;
  fieldErrors: TaskFormErrors;
  formError: string | null;
  isSubmitting: boolean;
  isClosing: boolean;
  onCloseComplete: () => void;
  onFieldChange: (field: keyof CreateTaskDto, value: string) => void;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
}

function CreateTaskModal({
  formValues,
  fieldErrors,
  formError,
  isSubmitting,
  isClosing,
  onCloseComplete,
  onFieldChange,
  onSubmit,
}: CreateTaskModalProps) {
  const [isAttentionActive, setIsAttentionActive] = useState(false);
  const [isDismissRequested, setIsDismissRequested] = useState(false);
  const isClosingActive = isClosing || isDismissRequested;

  function handleCloseRequest() {
    if (isSubmitting || isClosingActive) {
      return;
    }

    setIsDismissRequested(true);
  }

  function handleBackdropClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget && !isClosingActive) {
      setIsAttentionActive(false);
      window.requestAnimationFrame(() => {
        setIsAttentionActive(true);
      });
    }
  }

  function handleChange(field: keyof CreateTaskDto) {
    return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onFieldChange(field, event.target.value);
    };
  }

  return (
    <div
      className={`task-modal${isClosingActive ? " task-modal--closing" : ""}`}
      onClick={handleBackdropClick}
    >
      <div
        className={`task-modal__dialog${isAttentionActive ? " task-modal__dialog--attention" : ""}${isClosingActive ? " task-modal__dialog--closing" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-task-title"
        onAnimationEnd={() => {
          if (isClosingActive) {
            onCloseComplete();
            return;
          }

          setIsAttentionActive(false);
        }}
      >
        <div className="task-modal__header">
          <h2 id="create-task-title" className="task-modal__title">
            New task
          </h2>
          <button
            type="button"
            className="task-modal__close"
            onClick={handleCloseRequest}
            disabled={isSubmitting || isClosingActive}
            aria-label="Close new task modal"
          >
            <img src={closeIcon} alt="" width="24" height="24" />
          </button>
        </div>

        <form className="task-modal__form" onSubmit={onSubmit}>
          <label className="task-modal__field">
            <span className="task-modal__label">Title</span>
            <input
              autoFocus
              type="text"
              className="task-modal__input"
              value={formValues.title}
              onChange={handleChange("title")}
              disabled={isSubmitting}
            />
            {fieldErrors.title ? (
              <span className="task-modal__error">{fieldErrors.title}</span>
            ) : null}
          </label>

          <label className="task-modal__field">
            <span className="task-modal__label">Description</span>
            <textarea
              className="task-modal__textarea"
              rows={4}
              value={formValues.description}
              onChange={handleChange("description")}
              disabled={isSubmitting}
            />
            {fieldErrors.description ? (
              <span className="task-modal__error">{fieldErrors.description}</span>
            ) : null}
          </label>

          <div className="task-modal__row">
            <div className="task-modal__field">
              <label className="task-modal__label" htmlFor="create-task-priority">
                Priority
              </label>
              <AppSelect
                inputId="create-task-priority"
                isDisabled={isSubmitting}
                options={PRIORITY_OPTIONS}
                value={formValues.priority}
                onChange={(value) => onFieldChange("priority", value)}
              />
              {fieldErrors.priority ? (
                <span className="task-modal__error">{fieldErrors.priority}</span>
              ) : null}
            </div>

            <label className="task-modal__field">
              <span className="task-modal__label">Due date</span>
              <input
                type="date"
                className="task-modal__input"
                value={formValues.dueDate}
                onChange={handleChange("dueDate")}
                disabled={isSubmitting}
              />
              {fieldErrors.dueDate ? (
                <span className="task-modal__error">{fieldErrors.dueDate}</span>
              ) : null}
            </label>
          </div>

          <label className="task-modal__field">
            <span className="task-modal__label">Tag</span>
            <input
              type="text"
              className="task-modal__input"
              value={formValues.tag}
              onChange={handleChange("tag")}
              disabled={isSubmitting}
            />
            {fieldErrors.tag ? (
              <span className="task-modal__error">{fieldErrors.tag}</span>
            ) : null}
          </label>

          {formError ? <div className="task-modal__form-error">{formError}</div> : null}

          <div className="task-modal__actions">
            <button
              type="button"
              className="task-modal__button task-modal__button--secondary"
              onClick={handleCloseRequest}
              disabled={isSubmitting || isClosingActive}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="task-modal__button task-modal__button--primary"
              disabled={isSubmitting || isClosingActive}
            >
              {isSubmitting ? "Saving..." : "Save task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTaskModal;
